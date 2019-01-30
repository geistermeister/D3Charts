import React, { Component } from 'react'
import * as d3 from 'd3'

export default class LineCHart extends Component {

  componentDidMount() {
    this.DrawChart()
  }

  DrawChart = () => {
    const margin = {top: 20, right: 30, bottom: 45, left: 50}
    const width = this.props.width - margin.left - margin.right
    const height = this.props.height - margin.top - margin.bottom

    let parseTime = d3.timeParse('%d.%m.%Y')

    let buffer = []
    let data = this.props.data.data

    data.forEach((d,i) => {
      buffer.push(Object.values(d))
      buffer[i][0] = parseTime(buffer[i][0])
      for(let j = 1; j < buffer[0].length; j++){
        if(typeof buffer[i][j] != 'number'){
          buffer[i][j] = parseInt(buffer[i][j])
        }
      }
    })

    console.log(buffer)

    let x = d3.scaleTime()
      .domain(d3.extent(buffer, d => d[0]))
      .range([0, width])


    let y = d3.scaleLinear()
      .domain([0, d3.max(buffer, d => d[1])])
      .range([height, 0])

    // define the line
    let line = d3.line()
      .x(d => x(d[0]))
      .y(d => y(d[1]))
      .curve(d3.curveMonotoneX)

    // manipulate svg and create group
    let svg = d3.select('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform',
            `translate(${margin.left},${margin.top})`)
  
    // add the x axis
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%d.%m.%Y")))
  
    // add the y axis
    svg.append('g')
      .call(d3.axisLeft(y))

    // add the line
    svg.append('path')
      .data([buffer])
      .attr('class', 'line')
      .attr('d', line)
      .attr('fill', 'none')
      .attr('stroke', 'steelblue')
      .attr('stroke-width', '1.5')

    svg.selectAll('circle')
      .data(buffer).enter()
      .append('circle')
      .attr('class', 'dot')
      .attr('cx', d => x(d[0]))
      .attr('cy', d => y(d[1]))
      .attr('r', '3')
      .attr('fill', 'steelblue')
    
  }

  render() {
    return <svg></svg>
  }
}