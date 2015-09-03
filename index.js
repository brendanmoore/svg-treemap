import generate from './vendor/treemap-squarfiy';


function longestSide(width, height) {
    return Math.max(width, height);
}

function shortestSide(width, height) {
    return Math.min(width, height);
}

function getFontSize(width, height) {
    var l = longestSide(width, height),
        size = (l * 0.1) * 0.8; //make it 80% of 1/10 of the longestSide...
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
        fill = `hsla(208, 56%, 49%, ${opacity})`;

    var textX = x + (w/2),
        textY = y + (h/2),
        fontSize = Math.max(10, getFontSize(w, h)),
        transform = "";


    if(h > w) {
        transform = `transform="rotate(-90 ${textX} ${textY})"`;
    }

    if(fontSize * label.length > longestSide(w, h)) {
        fontSize = 0;
    }


    return `<g>
            <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}" stroke="#FFFFFF" strokeWidth="1" />
            <text x="${textX}" y="${textY}" text-anchor="middle" fill="#FFFFFF" font-size="${fontSize}" ${transform}>${label}</text>
        </g>`;
}

export default function draw(data, width, height) {
    var nodes = generate(data.data, width, height);
    // console.log(nodes);
    var squares = nodes.map(function(node, i){
        return createRect(node, data.labels[i], width, height);
    }).join("\n");

    var svg = `<svg version="1.1"
     baseProfile="full"
     width="${width}" height="${height}"
     viewBox="0 0 ${width} ${height}"
     xmlns="http://www.w3.org/2000/svg">
     <style type="text/css"><![CDATA[
       text {
         font-family: Arial, Sans, sans-serif;
         font-weight: bold;
         alignment-baseline: central
       }
    ]]></style>
    <rect x="0" y="0" width="100%" height="100%" fill="hsl(208, 56%, 20%)" />
     ${squares}
     </svg>`

     return svg;

}
