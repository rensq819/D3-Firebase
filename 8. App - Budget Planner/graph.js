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

const arcPath = d3
  .arc()
  .outerRadius(dims.radius)
  .innerRadius(dims.radius / 2); // for donut chart

// update function
const update = data => {
  // join enhanced (pie)data to path elements
  const paths = graph.selectAll('path').data(pie(data));

  paths
    .enter()
    .append('path')
    .attr('class', 'arc')
    .attr('d', arcPath) // equals to: d => archPath(d)
    .attr('stroke', '#fff')
    .attr('stroke-width', 3);
};

// data array and firestore
var data = [];

db.collection('expenses').onSnapshot(res => {
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
