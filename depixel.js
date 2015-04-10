// -*- Mode: javascript; tab-width: 4; indent-tabs-mode: nil; c-basic-offset: 4-*-
var depixel = (function() {
    "use strict";

    function Point() {
    };

    Point.prototype = Object.create(null, {});

    function Color(r, g, b) {
        var y = 0.299 * r + 0.587 * g + 0.114 * b;
        this.y = Math.round(y);
        this.u = Math.round(0.492 * (b - y));
        this.v = Math.round(0.877 * (r - y));
    };

    Color.prototype = Object.create(null, {});

    Color.prototype.toRGB = function toRGB() {
        var y = this.y;
        var u = this.u;
        var v = this.v;
        var r = y + 1.140 * v;
        var g = y - 0.394 * u - 0.581 * v;
        var b = y + 2.032 * u;
        return [r, g, b].map(Math.round);
    };

    Color.prototype.toYUV = function toYUV() {
        return [this.y, this.u, this.v];
    };

    Color.prototype.dissimilar = function dissimilar(color) {
        return Math.abs(this.y - color.y) > 48
            || Math.abs(this.u - color.u) > 7
            || Math.abs(this.v - color.v) > 6;
    };

    Color.prototype.toString = function toString() {
        var rgb = this.toRGB();
        return 'rgb(' + rgb.join() + ')';
    };

    function Vertex(x, y) {
        this.x = x;
        this.y = y;
    };

    Vertex.prototype = Object.create(null, {
        split : { enumerable : false, value : function split(v) {
            return new Vertex((this.x + v.x) / 2, (this.y + v.y) / 2);
        }},
        adjust : { enumerable : false, value : function adjust(x, y) {
            this.x += x;
            this.y += y;
            return this;
        }},
        clone : { enumerable : false, value : function clone() {
            return new Vertex(this.x, this.y);
        }},
        toString : { enumerable : false, value : function toString() {
            return ["(",this.x, ", ", this.y, ")"].join('');
        }},
        equals : { enumerable : false, value : function equals(other) {
            return this.x === other.x && this.y === other.y;
        }},
    });

    function Node(x, y, color, vertices) {
        this.x = x;
        this.y = y;
        this.edges = [];
        this.vertices = vertices || [];
        this.color = color;
        this.marked = false;
    };

    Node.prototype = Object.create(null, {
        addEdge : { enumerable : false, value : function addEdge(node) {
            if (this.edges.indexOf(node) === -1) {
                this.edges.push(node);
                node.addEdge(this);
            }
        }},
        equals : { enumerable : false, value : function equals(node) {
            return this.x === node.x && this.y === node.y;
        }},
    });

    Node.prototype.removeEdge = function removeEdge(node) {
        var index = this.edges.indexOf(node);
        if (index !== -1) {
            this.edges.splice(index,1);
            node.removeEdge(this);
        }
    };

    Node.prototype.addSimilarEdge = function addSimilarEdge(node) {
        if (!this.color.dissimilar(node.color)) {
            this.addEdge(node);
        }
    };

    Node.prototype.canReach = function canReach(node) {
        return this.edges.indexOf(node) != -1;
    };

    Node.prototype.valence = function valence() {
        return this.edges.length;
    };

    Node.prototype.toString = function toString() {
        var str = "(" + [this.x, this.y].join() + ") => ";
        var edges = this.edges.map(function (n) { return "(" + [n.x, n.y].join() + ")"; });
        return str + edges.join();
    };

    Node.prototype.follow = function follow(node, reverse) {
        var curve = [];
        var begin = this;

        while (begin.canReach(node) && begin.valence() < 3) {
            if (reverse) {
                curve.unshift(node);
            } else {
                curve.push(node);
            }

            if (node.valence() > 2) {
                break;
            }

            var next = node.edges[0] != begin ? node.edges[0] : node.edges[1];
            begin = node;
            node = next;

            if (node == this) {
                break;
            }
        }

        return curve;
    };

    Node.prototype.edge = function edge(horizontal, vertical) {
        return this.edges.find(function (e) {
            return this.x === (e.x - Math.sign(horizontal)) && this.y === (e.y - Math.sign(vertical))
        }, this);
    };

    Node.prototype.right = function right() {
        return this.edges.find(function (e) {
            return this.y === e.y && this.x === (e.x - 1)
        }, this);
    };

    Node.prototype.left = function left() {
        return this.edges.find(function (e) {
            return this.y === e.y && this.x === (e.x + 1)
        }, this);
    };

    Node.prototype.up = function up() {
        return this.edges.find(function (e) {
            return this.x === e.x && this.y === (e.y + 1)
        }, this);
    };

    Node.prototype.down = function down() {
        return this.edges.find(function (e) {
            return this.x === e.x && this.y === (e.y - 1)
        }, this);
    };

    Node.prototype.isEdge = function isEdge() {
        return this.edges.length < 4;
    };

    function Graph(pixels, x, y) {
        if (pixels.length != x * y * 4) {
            throw new Error("Wrong dimension of pixel buffer");
        }

        this.width = x;
        this.height = y;
        var nodes = new Array(y);
        var vertices = new Array(y + 1);
        vertices[0] = new Array(x + 1);

        for (var i = 0; i < x + 1; ++i) {
            vertices[0][i] = new Vertex(i, 0);
        }

        for (var i = 0; i < y; ++i) {
            var line = nodes[i] = new Array(x);
            var top = vertices[i];
            var bottom = vertices[i + 1] = new Array(x + 1);
            bottom[0] = new Vertex(0, i + 1);
            for (var j = 0; j < x; ++j) {
                var ix = i * x * 4 + j * 4;
                var color = pixels.subarray(ix, ix + 3);
                bottom[j + 1] = new Vertex(j + 1, i + 1);

                var nodeVertices = [top[j], top[j + 1], bottom[j + 1], bottom[j]];
                line[j] = new Node(j, i, new Color(color[0], color[1], color[2]), nodeVertices);
            }
        }

        this.nodes = nodes;
        this.vertices = nodes;
    };

    Graph.prototype = Object.create(null, {
        constructor : { enumerable : false, value : Graph },
	iterator : { enumerable : false, value : function iterator() {
	    var x = 0;
	    var y = 0;
	    var width = this.width;
	    var height = this.height;
	    var nodes = this.nodes;
	    return Object.create(null, {
		next : {
		    enumerable : false,
		    value : function next() {
			while (y < height) {
			    if (x < width) {
				return nodes[y][x++];
			    } else {
				x = 0;
				++y;
			    }
			}
			return null;
		    }
		}
	    });
	}}
    });

    var createNeighborAccessor = function(x, y) {
        var offsetX = x;
        var offsetY = y;
        return function(nodes, x, y) {
            return [nodes[y][x], nodes[y + offsetY][x + offsetX]];
        };
    };

    var down = createNeighborAccessor(0,1);
    var right = createNeighborAccessor(1,0);
    var slant = createNeighborAccessor(1,1);
    var rise = createNeighborAccessor(1,-1);

    var neighbours = [down, right];

    function getSquare(nodes, x, y) {
        return [down(nodes, x, y), right(nodes, x, y), down(nodes, x+1, y), right(nodes, x, y+1)];
    };

    function getDiagonals(nodes, x,y) {
        return [slant(nodes, x, y), rise(nodes, x, y+1)];
    };

    function getRect(nodes, x, y, w, h) {
        var rect = new Array(h);
        for (var i = 0; i < h; ++i) {
            rect[i] = nodes[i + y].slice(x, x + w);
        }
        return rect;
    };

    Graph.prototype.getDiagonals = function getDiagonals(x, y) {
        return [slant(this.nodes, x, y), rise(this.nodes, x, y+1)];
    };

    Graph.diagonals = function diagonals(diags) {
        var p = diags[0][0].canReach(diags[0][1]);
        var q = diags[1][0].canReach(diags[1][1]);
        return p + q;
    };

    var reach = function(args) {
        return args[0].canReach(args[1]);
    };

    var add = function(args) {
        args[0].addSimilarEdge(args[1]);
    };

    var id = function id(x) {
        return x;
    };

    var not = function not(x) {
        return !x;
    };

    var curve = function curve(nodes) {
        var m = nodes[0];
        var n = nodes[1];
        var result = m.follow(n);
        if (right[right.length - 1] != m) {
            result = n.follow(m).concat(result);
        }
        return result;
    };

    var getConnected = function getConnected(xmin, xmax, ymin, ymax) {
        var x0 = xmin;
        var x1 = xmax;
        var y0 = ymin;
        var y1 = ymax;
        return function(nodes) {
            var nodes = nodes[0].edges.slice();
            var connected = [];
            while (nodes.length > 0) {
                var node = nodes.pop();
                if (connected.indexOf(node) == -1) {
                    if (node.x > xmin && node.x < xmax && node.y > ymin && node.y < ymax) {
                        connected.push(node);
                        nodes = nodes.concat(node.edges);
                    }
                }
            }
            return connected;
        }
    };

    Graph.prototype.createSimilarityGraph = function createSimilarityGraph() {
        for (var x = 0; x < this.width - 1; ++x) {
            for (var z = 0; z < neighbours.length; ++z) {
                add(neighbours[z](this.nodes, x, 0));
            }

            this.nodes[this.height - 1][x].addSimilarEdge(this.nodes[this.height - 1][x + 1]);
        }

        for (var y = 0; y < this.height - 1; ++y) {
            for (var z = 0; z < neighbours.length; ++z) {
                add(neighbours[z](this.nodes, 0, y));
            }

            this.nodes[y][this.width - 1].addSimilarEdge(this.nodes[y + 1][this.width - 1]);
        }

        for (var x = 1; x < this.width - 1; ++x) {
            for (var y = 1; y < this.height - 1; ++y) {
                for (var z = 0; z < neighbours.length; ++z) {
                    add(neighbours[z](this.nodes, x, y));
                }

                var square = getSquare(this.nodes, x - 1, y - 1).map(reach);
                if (!square.every(id)) {
                    getDiagonals(this.nodes, x - 1, y - 1).forEach(add);
                }
            }
        }

        for (var x = 1; x < this.width; ++x) {
            var square = getSquare(this.nodes, x - 1, this.height - 2).map(reach);
            if (!square.every(id)) {
                getDiagonals(this.nodes, x - 1, this.height - 2).forEach(add);
            }
        }

        for (var y = 1; y < this.height; ++y) {
            var square = getSquare(this.nodes, this.width - 2, y - 1).map(reach);
            if (!square.every(id)) {
                getDiagonals(this.nodes, this.width - 2, y - 1).forEach(add);
            }
        }

        return this;
    };

    Graph.prototype.linearize = function linearize() {
        for (var x = 1; x < this.width; ++x) {
            for (var y = 1; y < this.height; ++y) {
                var square = getSquare(this.nodes, x - 1, y - 1).map(reach);
                if (square.every(not)) {
                    var diagonals = getDiagonals(this.nodes, x - 1, y - 1);
                    var heuristics = [0, 0];
                    // computing curves this way will generate a lot of curves.
                    var curves = diagonals.map(curve);
                    var connecteds = diagonals.map(getConnected(x - 3, x + 2, y - 3, y + 2));

                    var lengthHeuristic = curves[0].length - curves[1].length;
                    if (lengthHeuristic > 0) {
                        heuristics[0] += lengthHeuristic;
                    } else {
                        heuristics[1] -= lengthHeuristic;
                    }

                    var connectedHeuristic = connecteds[0].length - connecteds[1].length;
                    if (connectedHeuristic > 0) {
                        heuristics[1] += connectedHeuristic;
                    } else {
                        heuristics[0] -= connectedHeuristic;
                    }

                    var islands = diagonals.map(function (v) {
                        return v[0].valence() == 1 || v[1].valence() == 1;
                    });

                    if (islands[0] && !islands[1]) {
                        heuristics[0] += 5;
                    } else if (!islands[0] && islands[1]) {
                        heuristics[1] += 5;
                    }

                    if (heuristics[0] > heuristics[1]) {
                        diagonals[1][0].removeEdge(diagonals[1][1]);
                    } else if (heuristics[0] < heuristics[1]) {
                        diagonals[0][0].removeEdge(diagonals[0][1]);
                    } else {
                        diagonals[0][0].removeEdge(diagonals[0][1]);
                        diagonals[1][0].removeEdge(diagonals[1][1]);
                    }
                }
            }
        }

        return this;
    };

    var reshape = function reshape(rect) {
        var node = rect[0][1];
        if (node.canReach(rect[1][0])) {
            var vertices = node.vertices;
            var v1 = vertices[3];
            var v2 = v1.clone();

            if (!node.canReach(rect[1][1])) {
                v1.adjust(0.25, 0.25);
            }

            if (!node.canReach(rect[0][0])) {
                v2.adjust(-0.25, -0.25);
            }

            // This is important. We need to keep the order of
            // vertices somewhat similar to before reshaping.
            rect[0][0].vertices[2] = v2;
            vertices.splice(4, 0, v2);
            vertices = rect[1][0].vertices;
            v2 = vertices.splice(0,1,v2).pop();
            vertices.push(v2);
        }

        if (node.canReach(rect[1][2])) {
            var vertices = node.vertices;
            var v1 = vertices[2];
            var v2 = v1.clone();

            if (!node.canReach(rect[1][1])) {
                v1.adjust(-0.25, 0.25);
            }

            if (!node.canReach(rect[0][2])) {
                v2.adjust(0.25, -0.25);
            }

            // This is important. We need to keep the order of
            // vertices somewhat similar to before reshaping.
            rect[0][2].vertices[3] = v2;
            vertices.splice(2, 0, v2);
            vertices = rect[1][2].vertices;
            v2 = vertices.splice(0,1,v2).pop();
            vertices.push(v2);
        }
    };

    Graph.prototype.createVoronoiDiagram = function createVoronoiDiagram() {
        var w = this.width - 2;
        var h = this.height - 1;
        var nodes = this.nodes;

        for (var y = 0; y < h; ++y) {
            var rect = getRect(nodes, 0, y, 2, 2);
            rect[0].unshift(new Node());
            rect[1].unshift(new Node());
            reshape(rect);

            for (var x = 0; x < w; ++x) {
                reshape(getRect(nodes, x, y, 3, 2));
            }

            rect = getRect(nodes, x, y, 2, 2);
            rect[0].push(new Node());
            rect[1].push(new Node());
            reshape(rect);
        }

        return this;
    };

    Graph.prototype.contour = function contour(startNode) {
        var UP = 0;
        var UP_RIGHT = 1;
        var RIGHT = 2;
        var DOWN_RIGHT = 3;
        var DOWN = 4;
        var DOWN_LEFT = 5;
        var LEFT = 6;
        var UP_LEFT = 7;

        var current = startNode;
        var vertices = [];
        var start;
        var next;

        var up, right, down, left;

        if (current.valence() === 0) {
            return current.vertices.slice();
        }

        if (current.marked || !current.isEdge() || [[-1,-1],[0,-1],[1,-1]].some(function (e) {
            return this.edge.apply(this, e) != undefined;
        }, current)) {
            return vertices;
        }

        var marked = [];

        var heading = UP_RIGHT;
        var vertex = 0;
        var currentVertex;
        var startVertex = current.vertices[0];
        var previous = null;

        while (true) {
            current.marked = true;
            marked.push(current);

            next = undefined;
            switch (heading) {
            case UP_RIGHT:
                next = current.edge(1,-1);
                if (next) {
                    heading = UP_LEFT;
                    break;
                }
            case RIGHT:
                next = current.edge(1,0);
                if (next) {
                    heading = UP;
                    break;
                }
            case DOWN_RIGHT:
                next = current.edge(1,1);
                if (next) {
                    heading = UP_RIGHT;
                    break;
                }
            case DOWN:
                next = current.edge(0,1);
                if (next) {
                    heading = RIGHT;
                    break;
                }
            case DOWN_LEFT:
                next = current.edge(-1,1);
                if (next) {
                    heading = DOWN_RIGHT;
                    break;
                }
            case LEFT:
                next = current.edge(-1,0);
                if (next) {
                    heading = DOWN;
                    break;
                }
            case UP_LEFT:
                next = current.edge(-1,-1);
                if (next) {
                    heading = DOWN_LEFT;
                    break;
                }
            case UP:
                next = current.edge(0,-1);
                if (next) {
                    heading = LEFT;
                } else {
                    heading = UP_RIGHT;
                }
                break;
            }

            if (!next) {
                continue;
            }

            // add every vertex of current node from 'vertex' to the first common vertex in current node and next node
            var i = vertex, ilen = current.vertices.length;

            if (next == previous) {
                currentVertex = current.vertices[i++ % ilen];
                vertices.push(currentVertex);
            }

            while (true) {
                currentVertex = current.vertices[i++ % ilen];
                var j = next.vertices.indexOf(currentVertex);

                if (j != -1) {
                    vertex = j;
                    break;
                }

                vertices.push(currentVertex);
            }

            if (startNode.equals(next)) {
                currentVertex = next.vertices[vertex];
                vertices.push(currentVertex);
                break
            }

            previous = current;
            current = next;
        }

        while (marked.length != 0) {
            var mark = marked.pop();
            var unmarkedNeighbors = mark.edges.filter(function (e) { return !e.marked });
            unmarkedNeighbors.forEach(function (e) { e.marked = true });
            marked.push.apply(marked, unmarkedNeighbors);
        }

        alert (vertices)

        return vertices;
    };

    return function depixel(data, width, height) {
        var graph = new Graph(data, width, height);
    //  graph.createSimilarityGraph();
        return graph;
    };
})();
