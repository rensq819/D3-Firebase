const canvas = d3.select('.canvas');

// returns the svg created from .append()
// const svg = canvas.append("svg");

// method chaining
// svg.attr("height", 600);
// svg.attr("width", 600);
const svg = canvas
  .append('svg')
  .attr('height', 600)
  .attr('width', 600);

// group svg, eaiser to apply att together
const group = svg.append('g').attr('transform', 'translate(50,50)');

// append shapes to svg container
group
  .append('rect')
  .attr('height', 100)
  .attr('width', 200)
  .attr('fill', 'blue')
  .attr('x', 20)
  .attr('y', 20);

group
  .append('circle')
  .attr('r', 50)
  .attr('cx', 300)
  .attr('cy', 70)
  .attr('fill', 'pink');

group
  .append('line')
  .attr('x1', 370)
  .attr('x2', 400)
  .attr('y1', 20)
  .attr('y2', 120)
  .attr('stroke', 'red');

// text svg
svg
  .append('text')
  .attr('x', 20)
  .attr('y', 200)
  .attr('fill', 'grey')
  .text('Hello bibibi---')
  .style('font-family', 'arial');
