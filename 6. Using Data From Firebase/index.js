// select svg container
const svg = d3
  .select('.canvas')
  .append('svg')
  .attr('width', 600)
  .attr('height', 600);

// create margin and dimensions
const margin = { top: 20, right: 20, bottom: 100, left: 100 };
const graphWidth = 600 - margin.left - margin.right;
const graphHeight = 600 - margin.top - margin.bottom;

const graph = svg
  .append('g')
  .attr('width', graphWidth)
  .attr('height', graphHeight)
  .attr('transform', `translate(${margin.left}, ${margin.top})`);

const xAxisGroup = graph.append('g').attr('transform', `translate(0, ${graphHeight})`);
const yAxisGroup = graph.append('g');

db.collection('dishes')
  .get()
  .then(res => {
    var data = [];
    res.docs.forEach(doc => {
      data.push(doc.data());
    });

    const min = d3.min(data, d => d.orders);
    const max = d3.max(data, d => d.orders);
    const extent = d3.extent(data, d => d.orders); // find both min and max

    // linear scale
    const y = d3
      .scaleLinear()
      .domain([0, max]) // min 0, max 1000
      .range([graphHeight, 0]);

    // band scale
    const x = d3
      .scaleBand()
      .domain(data.map(item => item.name))
      .range([0, 500])
      .paddingInner(0.2)
      .paddingOuter(0.2);

    // join data to rects
    const rects = graph.selectAll('rect').data(data);

    // add attrs to rects already in DOM, just in case there's data already in DOM
    rects
      .attr('width', x.bandwidth())
      .attr('height', d => graphHeight - y(d.orders))
      .attr('fill', 'orange')
      .attr('x', d => x(d.name))
      .attr('y', d => y(d.orders)); // rect always runs from top to down, so we need to set a starting/top position

    // append new rects
    rects
      .enter()
      .append('rect')
      .attr('width', x.bandwidth())
      .attr('height', d => graphHeight - y(d.orders))
      .attr('fill', 'orange')
      .attr('x', d => x(d.name))
      .attr('y', d => y(d.orders));

    // create and call the
    const xAxis = d3.axisBottom(x);
    const yAxis = d3
      .axisLeft(y)
      .ticks(3) // try to get only around 3 ticks
      .tickFormat(d => d + '  orders');

    xAxisGroup.call(xAxis);
    yAxisGroup.call(yAxis);

    // apply transform/rotate on all text on x axis
    xAxisGroup
      .selectAll('text')
      .attr('fill', 'orange')
      .attr('transform', 'rotate(-40)')
      .attr('text-anchor', 'end'); // rotate at the end of the text
  });
