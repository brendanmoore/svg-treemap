var generate = require("../dist/svg-treemap");

var data = { data:
   [1, 1, 3, 5],
  labels:
   ["Apples", "Pears", "Oranges", "Peaches"] }


console.log(generate(data, 800, 400));