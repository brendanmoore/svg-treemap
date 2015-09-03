(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.svgTreemap = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports["default"] = draw;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _vendorTreemapSquarfiy = require('./vendor/treemap-squarfiy');

var _vendorTreemapSquarfiy2 = _interopRequireDefault(_vendorTreemapSquarfiy);

function longestSide(width, height) {
    return Math.max(width, height);
}

function shortestSide(width, height) {
    return Math.min(width, height);
}

function getFontSize(width, height) {
    var l = longestSide(width, height),
        size = l * 0.1 * 0.8; //make it 80% of 1/10 of the longestSide...
    // console.log(l, size);
    return size;
}

function createRect(node, label, containerWidth, containerHeight) {
    // console.log(node);
    var x = node[0],
        y = node[1],
        w = node[2] - x,
        h = node[3] - y,
        containerArea = containerWidth * containerHeight,
        area = w * h,
        opacity = area / containerArea,
        fill = "hsla(208, 56%, 49%, " + opacity + ")";

    var textX = x + w / 2,
        textY = y + h / 2,
        fontSize = Math.max(10, getFontSize(w, h)),
        transform = "";

    if (h > w) {
        transform = "transform=\"rotate(-90 " + textX + " " + textY + ")\"";
    }

    if (fontSize * label.length > longestSide(w, h)) {
        fontSize = 0;
    }

    return "<g>\n            <rect x=\"" + x + "\" y=\"" + y + "\" width=\"" + w + "\" height=\"" + h + "\" fill=\"" + fill + "\" stroke=\"#FFFFFF\" strokeWidth=\"1\" />\n            <text x=\"" + textX + "\" y=\"" + textY + "\" text-anchor=\"middle\" fill=\"#FFFFFF\" font-size=\"" + fontSize + "\" " + transform + ">" + label + "</text>\n        </g>";
}

function draw(data, width, height) {
    var nodes = (0, _vendorTreemapSquarfiy2["default"])(data.data, width, height);
    // console.log(nodes);
    var squares = nodes.map(function (node, i) {
        return createRect(node, data.labels[i], width, height);
    }).join("\n");

    var svg = "<svg version=\"1.1\"\n     baseProfile=\"full\"\n     width=\"" + width + "\" height=\"" + height + "\"\n     viewBox=\"0 0 " + width + " " + height + "\"\n     xmlns=\"http://www.w3.org/2000/svg\">\n     <style type=\"text/css\"><![CDATA[\n       text {\n         font-family: Arial, Sans, sans-serif;\n         font-weight: bold;\n         alignment-baseline: central\n       }\n    ]]></style>\n    <rect x=\"0\" y=\"0\" width=\"100%\" height=\"100%\" fill=\"hsl(208, 56%, 20%)\" />\n     " + squares + "\n     </svg>";

    return svg;
}

module.exports = exports["default"];

},{"./vendor/treemap-squarfiy":2}],2:[function(require,module,exports){
/*
 * treemap-squarify.js - open source implementation of squarified treemaps
 *
 * Treemap Squared 0.5 - Treemap Charting library
 *
 * https://github.com/imranghory/treemap-squared/
 *
 * Copyright (c) 2012 Imran Ghory (imranghory@gmail.com)
 * Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) license.
 *
 *
 * Implementation of the squarify treemap algorithm described in:
 *
 * Bruls, Mark; Huizing, Kees; van Wijk, Jarke J. (2000), "Squarified treemaps"
 * in de Leeuw, W.; van Liere, R., Data Visualization 2000:
 * Proc. Joint Eurographics and IEEE TCVG Symp. on Visualization, Springer-Verlag, pp. 33–42.
 *
 * Paper is available online at: http://www.win.tue.nl/~vanwijk/stm.pdf
 *
 * The code in this file is completeley decoupled from the drawing code so it should be trivial
 * to port it to any other vector drawing library. Given an array of datapoints this library returns
 * an array of cartesian coordinates that represent the rectangles that make up the treemap.
 *
 * The library also supports multidimensional data (nested treemaps) and performs normalization on the data.
 *
 * See the README file for more details.
 */

"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports["default"] = treemapMultidimensional;
function Container(xoffset, yoffset, width, height) {
    this.xoffset = xoffset; // offset from the the top left hand corner
    this.yoffset = yoffset; // ditto
    this.height = height;
    this.width = width;

    this.shortestEdge = function () {
        return Math.min(this.height, this.width);
    };

    // getCoordinates - for a row of boxes which we've placed
    //                  return an array of their cartesian coordinates
    this.getCoordinates = function (row) {
        var coordinates = [];
        var subxoffset = this.xoffset,
            subyoffset = this.yoffset; //our offset within the container
        var areawidth = sumArray(row) / this.height;
        var areaheight = sumArray(row) / this.width;
        var i;

        if (this.width >= this.height) {
            for (i = 0; i < row.length; i++) {
                coordinates.push([subxoffset, subyoffset, subxoffset + areawidth, subyoffset + row[i] / areawidth]);
                subyoffset = subyoffset + row[i] / areawidth;
            }
        } else {
            for (i = 0; i < row.length; i++) {
                coordinates.push([subxoffset, subyoffset, subxoffset + row[i] / areaheight, subyoffset + areaheight]);
                subxoffset = subxoffset + row[i] / areaheight;
            }
        }
        return coordinates;
    };

    // cutArea - once we've placed some boxes into an row we then need to identify the remaining area,
    //           this function takes the area of the boxes we've placed and calculates the location and
    //           dimensions of the remaining space and returns a container box defined by the remaining area
    this.cutArea = function (area) {
        var newcontainer;

        if (this.width >= this.height) {
            var areawidth = area / this.height;
            var newwidth = this.width - areawidth;
            newcontainer = new Container(this.xoffset + areawidth, this.yoffset, newwidth, this.height);
        } else {
            var areaheight = area / this.width;
            var newheight = this.height - areaheight;
            newcontainer = new Container(this.xoffset, this.yoffset + areaheight, this.width, newheight);
        }
        return newcontainer;
    };
}

// normalize - the Bruls algorithm assumes we're passing in areas that nicely fit into our
//             container box, this method takes our raw data and normalizes the data values into
//             area values so that this assumption is valid.
function normalize(data, area) {
    var normalizeddata = [];
    var sum = sumArray(data);
    var multiplier = area / sum;
    var i;

    for (i = 0; i < data.length; i++) {
        normalizeddata[i] = data[i] * multiplier;
    }
    return normalizeddata;
}

// treemapSingledimensional - simple wrapper around squarify
function treemapSingledimensional(data, width, height, xoffset, yoffset) {
    xoffset = typeof xoffset === "undefined" ? 0 : xoffset;
    yoffset = typeof yoffset === "undefined" ? 0 : yoffset;

    var rawtreemap = squarify(normalize(data, width * height), [], new Container(xoffset, yoffset, width, height), []);
    return flattenTreemap(rawtreemap);
}

// flattenTreemap - squarify implementation returns an array of arrays of coordinates
//                  because we have a new array everytime we switch to building a new row
//                  this converts it into an array of coordinates.
function flattenTreemap(rawtreemap) {
    var flattreemap = [];
    var i, j;

    for (i = 0; i < rawtreemap.length; i++) {
        for (j = 0; j < rawtreemap[i].length; j++) {
            flattreemap.push(rawtreemap[i][j]);
        }
    }
    return flattreemap;
}

// squarify  - as per the Bruls paper
//             plus coordinates stack and containers so we get
//             usable data out of it
function squarify(data, currentrow, container, stack) {
    var length;
    var nextdatapoint;
    var newcontainer;

    if (data.length === 0) {
        stack.push(container.getCoordinates(currentrow));
        return;
    }

    length = container.shortestEdge();
    nextdatapoint = data[0];

    if (improvesRatio(currentrow, nextdatapoint, length)) {
        currentrow.push(nextdatapoint);
        squarify(data.slice(1), currentrow, container, stack);
    } else {
        newcontainer = container.cutArea(sumArray(currentrow), stack);
        stack.push(container.getCoordinates(currentrow));
        squarify(data, [], newcontainer, stack);
    }
    return stack;
}

// improveRatio - implements the worse calculation and comparision as given in Bruls
//                (note the error in the original paper; fixed here)
function improvesRatio(currentrow, nextnode, length) {
    var newrow;

    if (currentrow.length === 0) {
        return true;
    }

    newrow = currentrow.slice();
    newrow.push(nextnode);

    var currentratio = calculateRatio(currentrow, length);
    var newratio = calculateRatio(newrow, length);

    // the pseudocode in the Bruls paper has the direction of the comparison
    // wrong, this is the correct one.
    return currentratio >= newratio;
}

// calculateRatio - calculates the maximum width to height ratio of the
//                  boxes in this row
function calculateRatio(row, length) {
    var min = Math.min.apply(Math, row);
    var max = Math.max.apply(Math, row);
    var sum = sumArray(row);
    return Math.max(Math.pow(length, 2) * max / Math.pow(sum, 2), Math.pow(sum, 2) / (Math.pow(length, 2) * min));
}

// isArray - checks if arr is an array
function isArray(arr) {
    return arr && arr.constructor === Array;
}

// sumArray - sums a single dimensional array
function sumArray(arr) {
    var sum = 0;
    var i;

    for (i = 0; i < arr.length; i++) {
        sum += arr[i];
    }
    return sum;
}

// sumMultidimensionalArray - sums the values in a nested array (aka [[0,1],[[2,3]]])
function sumMultidimensionalArray(arr) {
    var i,
        total = 0;

    if (isArray(arr[0])) {
        for (i = 0; i < arr.length; i++) {
            total += sumMultidimensionalArray(arr[i]);
        }
    } else {
        total = sumArray(arr);
    }
    return total;
}

// treemapMultidimensional - takes multidimensional data (aka [[23,11],[11,32]] - nested array)
//                           and recursively calls itself using treemapSingledimensional
//                           to create a patchwork of treemaps and merge them

function treemapMultidimensional(data, width, height, xoffset, yoffset) {
    xoffset = typeof xoffset === "undefined" ? 0 : xoffset;
    yoffset = typeof yoffset === "undefined" ? 0 : yoffset;

    var mergeddata = [];
    var mergedtreemap;
    var results = [];
    var i;

    if (isArray(data[0])) {
        // if we've got more dimensions of depth
        for (i = 0; i < data.length; i++) {
            mergeddata[i] = sumMultidimensionalArray(data[i]);
        }
        mergedtreemap = treemapSingledimensional(mergeddata, width, height, xoffset, yoffset);

        for (i = 0; i < data.length; i++) {
            results.push(treemapMultidimensional(data[i], mergedtreemap[i][2] - mergedtreemap[i][0], mergedtreemap[i][3] - mergedtreemap[i][1], mergedtreemap[i][0], mergedtreemap[i][1]));
        }
    } else {
        results = treemapSingledimensional(data, width, height, xoffset, yoffset);
    }
    return results;
}

module.exports = exports["default"];

},{}]},{},[1])(1)
});