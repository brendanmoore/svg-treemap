# SVG From Treemap

Usage:

```javascript
import svgTreemap from 'svg-treemap';

let input = {
    data: [1, 1, 3, 5],
    labels: ["Apples", "Pears", "Oranges", "Peaches"]
};
let width = 800;
let height = 400;

let svg = svgTreemap(input, width, height);
```

![Example Treemap](https://cdn.jsdelivr.net/gh/brendanmoore/svg-treemap/example.svg "Example Treemap")
