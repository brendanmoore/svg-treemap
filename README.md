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

![Example Treemap](https://cdn.rawgit.com/brendanmoore/svg-treemap/master/example.svg "Example Treemap")
