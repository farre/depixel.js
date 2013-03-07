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

    var it = graph.iterator();
    var node = null;
    while (node = it.next()) {
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

        for (var e = 0; e < node.edges.length; ++e) {
            var n = node.edges[e];
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
