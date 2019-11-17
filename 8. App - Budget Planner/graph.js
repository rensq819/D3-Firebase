const dims = { height: 300, width: 300, radius: 150 };
const cent = { x: dims.width / 2 + 5, y: dims.height / 2 + 5 }; // center of the chart

const svg = d3
  .select('.canvas')
  .append('svg')
  .attr('width', dims.width + 150)
  .attr('height', dims.height + 150);

// add group
const graph = svg.append('g').attr('transform', `translate(${cent.x}, ${cent.y})`);

const pie = d3
  .pie()
  .sort(null) // not sort based on value, which might be default by d3
  .value(d => d.cost);

const angles = pie([{ name: 'rent', cost: 500 }, { name: 'bills', cost: 300 }, { name: 'gaming', cost: 200 }]);

const arcPath = d3
  .arc()
  .outerRadius(dims.radius)
  .innerRadius(dims.radius / 2); // for donut chart
