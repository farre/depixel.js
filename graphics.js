// -*- Mode: javascript; tab-width: 4; indent-tabs-mode: nil; c-basic-offset: 4 -*-
function drawCanvas(graph, scale, reshaped, similar) {
    var width = graph.width;
    var height = graph.height;
    var nodes = graph.nodes;
    var canvas = document.createElement('canvas');
    canvas.width = width * scale;
    canvas.height = height * scale;
    var context = canvas.getContext('2d');
    context.strokeStyle = "black";

    for (let node of graph.nodes()) {
        var stroke_color = 'rgba(255,75,75,255)';
        context.strokeStyle = "" + stroke_color;
        context.fillStyle = "" + node.color;
        var vertices = node.vertices;
        context.beginPath();
        var v = vertices[0];
        context.moveTo(v.x * scale, v.y * scale);
        for (var i = 1; i < vertices.length; ++i) {
            v = vertices[i];
            context.lineTo(v.x * scale, v.y * scale);
        }
        context.closePath();
        context.fill();
        if (reshaped) {
            context.stroke();
        }
        var half_scale = scale / 2;
        stroke_color = 'rgba(0,200,0,255)';
        context.strokeStyle = "" + stroke_color;
        context.beginPath();
        var x = node.x * scale + half_scale;
        var y = node.y * scale + half_scale;

        for (let n of node.edges.filter(x => x)) {
            context.moveTo(x, y);
            context.lineTo(n.x * scale + half_scale, n.y * scale + half_scale);
        }
        context.closePath();
        if (similar) {
            context.stroke();
        }
    }

    return canvas;
}

function createEmptyCanvas(graph, scale) {
    var width = graph.width;
    var height = graph.height;
    var canvas = document.createElement('canvas');
    canvas.width = width * scale;
    canvas.height = height * scale;

    return canvas;
}

function drawContour(canvas, vertices, color, scale) {
    var context = canvas.getContext('2d');
    context.strokeStyle = "black";

    var stroke_color = 'rgba(255,75,75,255)';
    context.strokeStyle = "" + stroke_color;
    context.fillStyle = "" + color;
    context.beginPath();
    var v = vertices[0];
    context.moveTo(v.x * scale, v.y * scale);
    for (var i = 1; i < vertices.length; ++i) {
        v = vertices[i];
        context.lineTo(v.x * scale, v.y * scale);
    }
    context.closePath();
    context.fill();

    return canvas;
}
