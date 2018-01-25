// -*- Mode: javascript; tab-width: 4; indent-tabs-mode: nil; c-basic-offset: 4 -*-
var width = 18;
var height = 18;
var data1 = [196,196,196,255,196,196,196,255,196,196,196,255,196,196,196,255,196,196,196,255,196,196,196,255,196,196,196,255,196,196,196,255,196,196,196,255,196,196,196,255,196,196,196,255,196,196,196,255,196,196,196,255,196,196,196,255,196,196,196,255,196,196,196,255,196,196,196,255,196,196,196,255,196,196,196,255,196,196,196,255,196,196,196,255,196,196,196,255,196,196,196,255,196,196,196,255,0,0,0,255,0,0,0,255,0,0,0,255,0,0,0,255,0,0,0,255,196,196,196,255,196,196,196,255,196,196,196,255,196,196,196,255,196,196,196,255,196,196,196,255,196,196,196,255,196,196,196,255,196,196,196,255,196,196,196,255,196,196,196,255,0,0,0,255,0,0,0,255,192,192,192,255,192,192,192,255,192,192,192,255,192,192,192,255,192,192,192,255,0,0,0,255,0,0,0,255,196,196,196,255,196,196,196,255,196,196,196,255,196,196,196,255,196,196,196,255,196,196,196,255,196,196,196,255,196,196,196,255,0,0,0,255,192,192,192,255,192,192,192,255,224,224,224,255,224,224,224,255,224,224,224,255,224,224,224,255,224,224,224,255,224,224,224,255,192,192,192,255,0,0,0,255,196,196,196,255,196,196,196,255,196,196,196,255,196,196,196,255,196,196,196,255,196,196,196,255,0,0,0,255,192,192,192,255,224,224,224,255,224,224,224,255,248,248,248,255,248,248,248,255,248,248,248,255,248,248,248,255,248,248,248,255,248,248,248,255,224,224,224,255,224,224,224,255,0,0,0,255,196,196,196,255,196,196,196,255,196,196,196,255,196,196,196,255,196,196,196,255,0,0,0,255,192,192,192,255,0,0,0,255,248,248,248,255,0,0,0,255,248,248,248,255,248,248,248,255,248,248,248,255,0,0,0,255,0,0,0,255,248,248,248,255,224,224,224,255,0,0,0,255,196,196,196,255,196,196,196,255,196,196,196,255,196,196,196,255,0,0,0,255,192,192,192,255,224,224,224,255,0,0,0,255,248,248,248,255,0,0,0,255,248,248,248,255,248,248,248,255,0,0,0,255,248,248,248,255,248,248,248,255,0,0,0,255,224,224,224,255,192,192,192,255,0,0,0,255,196,196,196,255,196,196,196,255,196,196,196,255,0,0,0,255,192,192,192,255,224,224,224,255,0,0,0,255,248,248,248,255,0,0,0,255,248,248,248,255,248,248,248,255,0,0,0,255,248,248,248,255,248,248,248,255,0,0,0,255,248,248,248,255,224,224,224,255,192,192,192,255,0,0,0,255,196,196,196,255,196,196,196,255,0,0,0,255,192,192,192,255,224,224,224,255,248,248,248,255,248,248,248,255,248,248,248,255,248,248,248,255,248,248,248,255,248,248,248,255,248,248,248,255,248,248,248,255,0,0,0,255,248,248,248,255,224,224,224,255,192,192,192,255,0,0,0,255,196,196,196,255,196,196,196,255,0,0,0,255,192,192,192,255,224,224,224,255,248,248,248,255,248,248,248,255,248,248,248,255,248,248,248,255,248,248,248,255,248,248,248,255,248,248,248,255,248,248,248,255,0,0,0,255,248,248,248,255,224,224,224,255,0,0,0,255,196,196,196,255,196,196,196,255,196,196,196,255,0,0,0,255,192,192,192,255,248,16,88,255,248,248,248,255,248,16,88,255,248,248,248,255,248,16,88,255,248,248,248,255,248,248,248,255,248,248,248,255,248,248,248,255,248,248,248,255,224,224,224,255,192,192,192,255,192,192,192,255,0,0,0,255,196,196,196,255,196,196,196,255,0,0,0,255,192,192,192,255,224,224,224,255,248,16,88,255,248,248,248,255,248,16,88,255,248,248,248,255,248,16,88,255,248,248,248,255,248,248,248,255,248,248,248,255,248,248,248,255,248,248,248,255,224,224,224,255,192,192,192,255,0,0,0,255,196,196,196,255,196,196,196,255,196,196,196,255,0,0,0,255,192,192,192,255,224,224,224,255,224,224,224,255,248,248,248,255,248,248,248,255,248,248,248,255,248,248,248,255,248,248,248,255,248,248,248,255,248,248,248,255,224,224,224,255,192,192,192,255,0,0,0,255,196,196,196,255,196,196,196,255,196,196,196,255,196,196,196,255,0,0,0,255,192,192,192,255,192,192,192,255,192,192,192,255,224,224,224,255,224,224,224,255,224,224,224,255,248,248,248,255,248,248,248,255,248,248,248,255,224,224,224,255,192,192,192,255,192,192,192,255,0,0,0,255,196,196,196,255,196,196,196,255,196,196,196,255,196,196,196,255,196,196,196,255,0,0,0,255,192,192,192,255,192,192,192,255,224,224,224,255,224,224,224,255,224,224,224,255,224,224,224,255,224,224,224,255,224,224,224,255,192,192,192,255,0,0,0,255,0,0,0,255,196,196,196,255,196,196,196,255,196,196,196,255,196,196,196,255,196,196,196,255,196,196,196,255,196,196,196,255,0,0,0,255,0,0,0,255,192,192,192,255,192,192,192,255,192,192,192,255,192,192,192,255,192,192,192,255,0,0,0,255,0,0,0,255,196,196,196,255,196,196,196,255,196,196,196,255,196,196,196,255,196,196,196,255,196,196,196,255,196,196,196,255,196,196,196,255,196,196,196,255,196,196,196,255,196,196,196,255,0,0,0,255,0,0,0,255,0,0,0,255,0,0,0,255,0,0,0,255,196,196,196,255,196,196,196,255,196,196,196,255,196,196,196,255,196,196,196,255,196,196,196,255,196,196,196,255,196,196,196,255,196,196,196,255,196,196,196,255,196,196,196,255,196,196,196,255,196,196,196,255,196,196,196,255,196,196,196,255,196,196,196,255,196,196,196,255,196,196,196,255,196,196,196,255,196,196,196,255,196,196,196,255,196,196,196,255,196,196,196,255,196,196,196,255,196,196,196,255];

var w = [255,255,255,255];
var b = [0,0,0,255];
var red = [255,0,0,255];
var green = [0,255,0,255];
var blue = [0,0,255,255];
var g = [220,220,220,255];

var data2 = [
    b, w, w, w, w, w, b, b,
    w, w, b, b, w, w, w, b,
    w, b, w, w, b, w, w, w,
    w, b, w, w, b, b, w, w,
    w, w, b, b, w, w, b, w,
    w, w, w, b, w, w, b, w,
    b, w, w, w, b, b, w, w,
    b, b, w, w, w, w, w, w,
].reduce(function (p,c) { return p.concat(c);});

var data3 = [
    w, w, b, b, b, w,
    b, b, b, b, b, b,
    w, w, b, w, b, b,
    w, b, w, b, b, w,
    w, b, w, w, w, w,
    w, w, b, w, w, w,
].reduce(function (p,c) { return p.concat(c);});

var data4 = [
    w, w, w, b,
    w, w, b, b,
    w, b, b, b,
].reduce(function (p,c) { return p.concat(c);});

var data5 = [
    w, w, w,
    w, b, w,
    w, b, w,
    w, b, w,
    w, w, w,
].reduce(function (p,c) { return p.concat(c);});

var data6 = [
    w, w, w, w, w,
    w, w, b, w, w,
    w, b, w, b, w,
    w, b, w, b, w,
    w, b, w, b, w,
    w, w, w, b, w,
    w, w, w, w, w,
].reduce(function (p,c) { return p.concat(c);});

var data7 = [
    w, w,     w,    w,
    w, red,   red,  w,
    w, green, blue, w,
    w, green, blue, w,
    w, w,     w,    w,
].reduce(function (p,c) { return p.concat(c);});

var data8 = [
    w, w, w, w, w,
    w, w, w, w, b,
    w, w, w, b, b,
    w, w, b, b, b,
    w, b, b, b, b,
    b, b, b, b, b,
].reduce(function (p,c) { return p.concat(c);});

var data9 = [
    w, w, w, w, g,
    w, w, w, w, g,
    w, w, g, g, g,
    g, w, g, g, g,
    g, w, g, g, g,
    g, w, g, g, g,
].reduce(function (p,c) { return p.concat(c);});

var data10 = [
    w,    w,    w, w, green,
    blue, w,    w, green, w,
    w,    blue, green, w, w,
    w,    green,    blue, w, w,
    w,    green,    w, w, w,
    green,    w,    w, w, w,
].reduce(function (p,c) { return p.concat(c);});


//var graph = depixel(new Uint8Array(data1), width, height);
//var graph = depixel(new Uint8Array(data2), 8, 8);
//var graph = depixel(new Uint8Array(data3), 6, 6);

function generateChoices(size, choiceValues) {
    var choicesStub = new Array(size);
    var choices = [choicesStub];
    var nChoices = choiceValues.length;

    for (var i = 0; i < size; ++i) {
        for (var j = choices.length - 1; j >= 0; --j) {
            choices[j][i] = choiceValues[0];
            for (var k = 1; k < nChoices; ++k) {
                var choice = choices[j].slice();
                choice[i] = choiceValues[k];
                choices.push(choice);
            }
        }
    }

    return choices;
}

function generateTemplateData() {
    var templates = generateChoices(6, [w, b]);

    var graphs = [];

    var pushGraph = function pushGraph(graphs, graph) {
        var diagonals = 0;
        for (var x = 1; x < 3; ++x) {
            for (var y = 1; y < 2; ++y) {
                var diagonalNodes = graph.getDiagonals(x - 1, y - 1);

                if (graph.constructor.diagonals(diagonalNodes) > 0) {
                    graphs.push(graph);
                    return;
                }
            }
        }
    };

    for (var i = templates.length - 1; i >= 0; --i) {
        var template = templates[i];
        var pixels = new Uint8Array(template.reduce(function (p,c) { return p.concat(c); }));
        var graph = depixel(pixels, 3, 2);
        graph.createSimilarityGraph();

        var crosses = 0;
        for (var x = 1; x < 3; ++x) {
            for (var y = 1; y < 2; ++y) {
                var diagonalNodes = graph.getDiagonals(x - 1, y - 1);

                if (graph.constructor.diagonals(diagonalNodes) == 2) {
                    crosses++;
                }
            }
        }

        if (crosses) {
            var graphChoices = generateChoices(crosses, [[0], [1], [0,1]]);
                while (true) {
                var choice = graphChoices.pop();

                for (var x = 1; x < 3; ++x) {
                    for (var y = 1; y < 2; ++y) {
                        var diagonals = graph.getDiagonals(x - 1, y - 1);
                        if (graph.constructor.diagonals(diagonals) == 2) {
                            var c = choice.pop();
                            for (var z = c.length - 1; z >= 0; --z) {
                                diagonals[c[z]][0].removeEdge(diagonals[c[z]][1]);
                            }
                        }
                    }
                }

                pushGraph(graphs, graph);

                if (graphChoices.length > 0) {
                    graph = depixel(new Uint8Array(pixels), 3, 2);
                    graph.createSimilarityGraph();
                } else {
                    break;
                }
            }
        } else {
            pushGraph(graphs, graph);
        }
    }

    return graphs;
}

function createCanvas(graph, scale) {
    var text = document.createTextNode(" ");
    document.body.appendChild(drawCanvas(graph, scale, false, false))
    document.body.appendChild(document.createTextNode(" => "));
    document.body.appendChild(drawCanvas(graph, scale, false, true))
    document.body.appendChild(document.createTextNode(" => "));
    graph.createVoronoiDiagram();
    document.body.appendChild(drawCanvas(graph, scale, false, true))
    document.body.appendChild(document.createTextNode(" => "));

    var it = graph.nodes();

    var canvas = createEmptyCanvas(graph, scale);
    document.body.appendChild(canvas);
    document.body.appendChild(document.createTextNode(" "));
    document.body.appendChild(document.createElement("br"));
    document.body.appendChild(document.createElement("br"));

    var foo = 0;
    for (let node of graph.nodes()) {
        var vertices = graph.contour(node);
        if (vertices.length > 0) {
            drawContour(canvas, vertices, node.color, scale)
        }
    }
}

var fn = function (g, i) {
    document.body.appendChild(document.createTextNode(i + ". "));
    createCanvas(g, 20);
};

function depixel2(image, scale) {
  const width = image.width;
  const height = image.height;
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  canvas.width = width;
  canvas.height = height;
  context.drawImage(image, 0, 0);

  let data = context.getImageData(0, 0, width, height).data;
  createCanvas(depixel(data, width, height).createSimilarityGraph().linearize(), scale);
}

createCanvas(depixel(new Uint8Array(data10), 5, 6), 20);

depixel2(document.getElementById('image'), 10);
/*
document.body.appendChild(drawCanvas(graph, 20));
graph.createSimilarityGraph();
document.body.appendChild(drawCanvas(graph, 20))
graph.createVoronoiDiagram();
document.body.appendChild(drawCanvas(graph, 20))
*/
