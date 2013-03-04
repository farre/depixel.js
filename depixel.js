// -*- Mode: c++; tab-width: 4; indent-tabs-mode: nil; c-basic-offset: 4 -*-
var depixel = (function() {
    "use strict";

    function Point() {
    }

    Point.prototype = Object.create(null, {});

    function Color(r, g, b) {
        var y = 0.299 * r + 0.587 * g + 0.114 * b;
        this.y = Math.round(y);
        this.u = Math.round(0.492 * (b - y));
        this.v = Math.round(0.877 * (r - y));
    }

    Color.prototype = Object.create(null, {});

    Color.prototype.toRGB = function toRGB() {
        var y = this.y;
        var u = this.u;
        var v = this.v;
        var r = y + 1.140 * v;
        var g = y - 0.394 * u - 0.581 * v;
        var b = y + 2.032 * u;
        return [r, g, b].map(Math.round);
    }

    Color.prototype.toYUV = function toYUV() {
        return [this.y, this.u, this.v];
    }

    Color.prototype.dissimilar = function dissimilar(color) {
        return Math.abs(this.y - color.y) > 48
            || Math.abs(this.u - color.u) > 7
            || Math.abs(this.v - color.v) > 6;
    }

    Color.prototype.toString = function toString() {
        var rgb = this.toRGB();
        return 'rgb(' + rgb.join() + ')';
    }

    function Vertex(x, y) {
        this.x = x;
        this.y = y;
    }

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
        }}
    });

    function Node(x, y, color, vertices) {
        this.x = x;
        this.y = y;
        this.edges = [];
        this.vertices = vertices;
        this.color = color;
    }

    Node.prototype = Object.create(null, {
        addEdge : { enumerable : false, value : function addEdge(node) {
            if (this.edges.indexOf(node) === -1) {
                this.edges.push(node);
                node.addEdge(this);
            }
        }}
    });

    Node.prototype.removeEdge = function removeEdge(node) {
        var index = this.edges.indexOf(node);
        if (index !== -1) {
            this.edges.splice(index,1);
            node.removeEdge(this);
        }
    }

    Node.prototype.addSimilarEdge = function addSimilarEdge(node) {
        if (!this.color.dissimilar(node.color)) {
            this.addEdge(node);
        }
    }

    Node.prototype.canReach = function canReach(node) {
        return this.edges.indexOf(node) != -1;
    }

    Node.prototype.valence = function valence() {
        return this.edges.length;
    }

    Node.prototype.toString = function toString() {
        var str = "(" + [this.x, this.y].join() + ") => ";
        var edges = this.edges.map(function (n) { return "(" + [n.x, n.y].join() + ")"; });
        return str + edges.join();
    }

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
    }

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
    }

    Graph.prototype = Object.create(null, {
        constructor : { enumerable : false, value : Graph }
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
    }

    function getDiagonals(nodes, x,y) {
        return [slant(nodes, x, y), rise(nodes, x, y+1)];
    }

    function getRect(nodes, x, y, w, h) {
        var rect = new Array(h);
        for (var i = 0; i < h; ++i) {
            rect[i] = nodes[i + y].slice(x, x + w);
        }
        return rect;
    }

    Graph.prototype.getDiagonals = function getDiagonals(x, y) {
        return [slant(this.nodes, x, y), rise(this.nodes, x, y+1)];
    }

    Graph.diagonals = function diagonals(diags) {
        var p = diags[0][0].canReach(diags[0][1]);
        var q = diags[1][0].canReach(diags[1][1]);
        return p + q;
    }

    var reach = function(args) {
        return args[0].canReach(args[1]);
    }

    var add = function(args) {
        args[0].addSimilarEdge(args[1]);
    }

    var id = function id(x) {
        return x;
    }

    var not = function not(x) {
        return !x;
    }

    var curve = function curve(nodes) {
        var m = nodes[0];
        var n = nodes[1];
        var result = m.follow(n);
        if (right[right.length - 1] != m) {
            result = n.follow(m).concat(result);
        }
        return result;
    }

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
    }

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
    }

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
    }

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
    }

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
    }

    return function depixel(data, width, height) {
        var graph = new Graph(data, width, height);
    //  graph.createSimilarityGraph();
        return graph;
    };
})();
