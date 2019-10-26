const data = [
  { width: 200, height: 100, fill: 'purple' },
  { width: 100, height: 60, fill: 'pink' },
  { width: 50, height: 30, fill: 'green' }
];

const svg = d3.select('svg');

// params we can take in includes (d, i, n)
// d: data
// i: index
// n: current selection

// there's difference between arrow function and funtion()

// svg.select() select only first match, .selectAll() select array of them all.
// join data to rect
const rect = svg.selectAll('rect').data(data);

// add attrs to rects already ih the DOM
rect
  .attr('width', (d, i, n) => {
    console.log(d, i, n);
    return d.width;
  })
  .attr('height', function(d) {
    console.log(this);
    return d.height;
  })
  .attr('fill', (d, i, n) => {
    console.log(this);
    console.log(n[i]); // get the same as function() by using this way around
    return d.fill;
  });

// append the enter selection to DOM
rect
  .enter()
  .append('rect')
  .attr('width', d => d.width)
  .attr('height', d => d.height)
  .attr('fill', d => d.fill);
