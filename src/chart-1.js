import * as d3 from 'd3'

const margin = { top: 30, left: 30, right: 30, bottom: 30 }
const height = 300 - margin.top - margin.bottom
const width = 700 - margin.left - margin.right

const svg = d3
  .select('#chart-1')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

// Normal scales
const xPositionScale = d3
  .scaleLinear()
  .domain([1, 25])
  .range([0, width])

// 10 degrees to 50 degrees
// 0 does not mean anything when coming to temperature
// 10 because it looks nicer
const yPositionScale = d3
  .scaleLinear()
  .domain([10, 50])
  .range([height, 0])

//
const line = d3
	.line()
	.x(d => {
		return xPositionScale(d.day)
	})
	.y(d => {
		return yPositionScale(d.temperature)
	})

// require because we are using parcel
d3.csv(require('./data-singleline-cimmeria.csv'))
  .then(ready)
  .catch(err => {
    console.log('Failed with', err)
  })

function ready(datapoints) {
  /* Add in your temperature circles */

  //
  svg
    .append('path') // svg.append('line') line only goes to one point to the other
    .datum(datapoints)
    .attr('stroke', 'blue')
    .attr('stroke-width', 2)
    .attr('d', line)
    .attr('fill', 'none')

  /**
  svg
    .append('path')
    .attr('stroke', 'red')
    .attr('stroke-width', 2)
    .attr('d', 'M 10,30 A 20,20 0,0,1 50,30 A 20,20 0,0,1 90,30 Q 90,60 50,90 Q 10,60 10,30 z')
	**/
  svg
    .selectAll('circle') // .selectAll('.cimmeria-temp')
    .data(datapoints)
    .enter()
    .append('circle')
    // .attr('class', 'cimmeria-temp')
    .attr('r', 3)
    .attr('cx', d => {
      return xPositionScale(d.day)
    })
    .attr('cy', d => {
      return yPositionScale(d.temperature)
    })
    .attr('fill', 'blue')

  /* Add in your axes */

  const xAxis = d3.axisBottom(xPositionScale)
  svg
    .append('g')
    .attr('class', 'axis x-axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis)

  const yAxis = d3.axisLeft(yPositionScale)
  svg
    .append('g')
    .attr('class', 'axis y-axis')
    .call(yAxis)
}

export { xPositionScale, yPositionScale, line }