// select svg container
const svg = d3
  .select('.canvas')
  .append('svg')
  .attr('width', 600)
  .attr('height', 600);

d3.json('menu.json').then(data => {
  const min = d3.min(data, d => d.orders);
  const max = d3.max(data, d => d.orders);
  const extent = d3.extent(data, d => d.orders); // find both min and max

  // linear scale
  const y = d3
    .scaleLinear()
    .domain([0, max]) // min 0, max 1000
    .range([0, 500]);

  // band scale
  const x = d3
    .scaleBand()
    .domain(data.map(item => item.name))
    .range([0, 500])
    .paddingInner(0.2)
    .paddingOuter(0.2);

  // join data to rects
  const rects = svg.selectAll('rect').data(data);

  // add attrs to rects already in DOM, just in case there's data already in DOM
  rects
    .attr('width', x.bandwidth())
    .attr('height', d => y(d.orders))
    .attr('fill', 'orange')
    .attr('x', d => x(d.name));

  // append new rects
  rects
    .enter()
    .append('rect')
    .attr('width', x.bandwidth())
    .attr('height', d => y(d.orders))
    .attr('fill', 'orange')
    .attr('x', d => x(d.name));
});
