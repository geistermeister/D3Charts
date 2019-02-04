import React, { Component } from 'react'
import * as d3 from 'd3'
import propTypes from 'prop-types'

export default class BarChart extends Component {

  componentDidMount() {
    this.DrawChart()
  }

  DrawChart = () => {
    const margin = {top: 40, right: 20, bottom: 80, left: 50}
    const width = this.props.width - margin.left - margin.right
    const height = this.props.height - margin.top - margin.bottom
    let parseTime = d3.timeParse('%d.%m.%Y')
    let colors = ['orange', 'blue', 'red', 'yellow', 'green']
    let data = this.props.data.data
    let keys = Object.keys(data[0])
    let buffer = []
    let bufferline
    let maxX = 0

    data.forEach((d, i) => {
      buffer.push(Object.values(d))
      // format the date string into date type
      buffer[i][0] = parseTime(buffer[i][0])
      for (let j = 1; j < buffer[0].length; j++) {
        if (typeof buffer[i][1] != 'number') {
          // number string into int
          buffer[i][j] = parseInt(buffer[i][j])
        }
        if (buffer[i][j] > maxX) {
          maxX = buffer[i][j]
        }
      }
    })

    let x = d3.scaleBand()
      .rangeRound([0, width])
      .domain(buffer.map(d => d[0]))
      .padding(0.1)


    let y = d3.scaleLinear()
      .domain([0, maxX])
      .range([height, 0])


    // manipulate svg and create group
    let svg = d3.select('.svgBarChart')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform',
            `translate(${margin.left},${margin.top})`)

    let barWidth = x.bandwidth() / buffer[0].length

    // splits data array into arrays
    // e.g. array[date, value1, value2] = array[date, value1] & array[date, value2] 
    for(let i = 1; i < buffer[0].length; i++){
      bufferline = []
      for(let j = 0; j < buffer.length; j++){
        let fusionArray = []
        fusionArray[0] = buffer[j][0]
        fusionArray[1] = buffer[j][i]
        bufferline.push(fusionArray)
      }

      // add the bars
      svg.append('g')
        .selectAll('g')
        .data(bufferline)
        .enter().append('rect')
        .style('fill', () => (i-1 > colors.length) ? colors[colors.length -1] : colors[i-1])
        .attr('x', d => x(d[0]) + (i-1) * barWidth + barWidth / 2)
        .attr('y', d => y(d[1]))
        .attr('width', barWidth)
        .attr('height', d => height - y(d[1]))
        // append text for line when mouse over
        .on('mouseover', () => {
          svg.append('text')
            .attr('class', 'title')
            .attr('font-family', 'sans-serif')
            .attr('font-weight', 'bold')
            .attr('fill', () => (i-1 > colors.length) ? colors[colors.length -1] : colors[i-1])
            .text(keys[i])
            .attr('x', width/2)
            .attr('y', -20)
        })
        .on('mouseout', () => {
          svg.select('.title').remove()
        })
    }

    // add the x axis
    svg.append('g')
    .attr('transform', `translate(0,${height})`)
    .call(d3.axisBottom(x).tickFormat(d3.timeFormat('%d.%m.%Y')))
    .selectAll('text')
    .attr('transform', 'rotate(-90)')
    .style('text-anchor', 'end')
    .attr('dx', '-.8em')
    .attr('dy', '-.55em')

    // add the y axis
    svg.append('g')
      .call(d3.axisLeft(y))
      
  }

  render() {
    return <svg className='svgBarChart'></svg>
  }
}

BarChart.propTypes = {
  data: propTypes.array.isRequired,
  width: propTypes.number.isRequired,
  height: propTypes.number.isRequired
}