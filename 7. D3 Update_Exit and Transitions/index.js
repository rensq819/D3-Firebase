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
  .append('g') // create group
  .attr('width', graphWidth)
  .attr('height', graphHeight)
  .attr('transform', `translate(${margin.left}, ${margin.top})`);

const xAxisGroup = graph.append('g').attr('transform', `translate(0, ${graphHeight})`);
const yAxisGroup = graph.append('g');

// init set linear scale
const y = d3.scaleLinear().range([graphHeight, 0]);

// init set band scale
const x = d3
  .scaleBand()
  .range([0, 500])
  .paddingInner(0.2)
  .paddingOuter(0.2);

// create the axes
const xAxis = d3.axisBottom(x);
const yAxis = d3
  .axisLeft(y)
  .ticks(3) // try to get only around 3 ticks
  .tickFormat(d => d + '  orders');

// apply transform/rotate on all text on x axis
xAxisGroup
  .selectAll('text')
  .attr('fill', 'orange')
  .attr('transform', 'rotate(-40)')
  .attr('text-anchor', 'end'); // rotate at the end of the text

// assgin variable to transition
const t = d3.transition().duration(1000);

// update function
const update = data => {
  /** 1. update any scale (domains) if they rely on our data */

  // update linear scale
  y.domain([0, d3.max(data, d => d.orders)]); // min 0, max 1000

  // update band scale
  x.domain(data.map(item => item.name));

  /** 2. join updated data to elements */
  // join data to rects
  const rects = graph.selectAll('rect').data(data);

  /** 3. remove unwanted shapes using the exit selection */
  rects.exit().remove();

  /** 4. update current shapes in the dom */
  // add attrs to rects already in DOM, update with animation, just in case there's data already in DOM
  rects
    .attr('width', x.bandwidth())
    .attr('fill', 'orange')
    .attr('x', d => x(d.name)); // below are commented out because we have the .merge() on enter()
  // .transition(t) // update already has a start position, only need to put down ending postions below
  // .attr('height', d => graphHeight - y(d.orders))
  // .attr('y', d => y(d.orders)); // rect always runs from top to down, so we need to set a starting/top position

  /** 5. append the enter selection to the dom */
  // append new rects with animation
  rects
    .enter() // create new rect thats not in the DOM
    .append('rect')
    // .attr('width', 0)
    .attr('height', 0)
    .attr('fill', 'orange')
    .attr('x', d => x(d.name))
    .attr('y', graphHeight)
    .merge(rects) // apply below to both groups
    .transition(t) // transition state goes after
      .attrTween('width', widthTween)
      .attr('y', d => y(d.orders))
      .attr('height', d => graphHeight - y(d.orders));

  // call the axes
  xAxisGroup.call(xAxis);
  yAxisGroup.call(yAxis);
};

var data = [];
// real time listening
db.collection('dishes').onSnapshot(res => {
  res.docChanges().forEach(change => {
    const doc = { ...change.doc.data(), id: change.doc.id };

    switch (change.type) {
      case 'added':
        data.push(doc);
        break;
      case 'modified':
        const index = data.findIndex(item => item.id === doc.id); // indexOf expects actual value while findIndex expects callback
        data[index] = doc; // overwrite the original record
        break;
      case 'removed':
        data = data.filter(item => item.id !== doc.id);
        break;
      default:
        break;
    }
  });

  update(data);
});

// TWEENS
const widthTween = d => {
  // define interpolation
  // d3.interpolate returns a function which we call 'i'
  let i = d3.interpolate(0, x.bandwidth());

  // return a function which takes in a time ticker 't'
  // should be a value between 0-1
  return function(t) {
    // return the value from passing hte ticker into the interpolation
    return i(t);
  };
};
