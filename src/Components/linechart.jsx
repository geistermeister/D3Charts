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
    // IAM, DCI, HOLDING
    let colors = ["#D31409", "#0068B4", "#E05206"]
    let buffer = []
    let bufferline
    let maxX = 0
    let data = this.props.data.data
    let keys = Object.keys(data[0])

    // copy data object into array, 
    data.forEach((d,i) => {
      buffer.push(Object.values(d))
      // format the date string into date type
      buffer[i][0] = parseTime(buffer[i][0])
      for(let j = 1; j < buffer[0].length; j++){
        if(typeof buffer[i][j] != 'number'){
          // number string into int
          buffer[i][j] = parseInt(buffer[i][j])
          if(buffer[i][j] > maxX){
            maxX = buffer[i][j]
          }
        }
      }
    })

    // manipulate svg and create group
    let svg = d3.select('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform',
            `translate(${margin.left},${margin.top})`)
  
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

      let x = d3.scaleTime()
      .domain(d3.extent(buffer, d => d[0]))
      .range([0, width])


      let y = d3.scaleLinear()
        .domain([0, maxX])
        .range([height, 0])

      // define the line
      let line = d3.line()
        .x(d => x(d[0]))
        .y(d => y(d[1]))
        .curve(d3.curveMonotoneX)
      
      // add the line
      svg.append('g')
        .attr('class', 'lineContainer')
        .append('path')
        .data([bufferline])
        .attr('class', 'line')
        .attr('d', line)
        .attr('fill', 'none')
        .attr('stroke', colors[i-1])
        .attr('stroke-width', '1.5')
        // append text for line when mouse over
        .on('mouseover', () => {
          svg.append('text')
            .attr('class', 'title')
            .attr('font-family', 'sans-serif')
            .attr('font-weight', 'bold')
            .attr('fill', colors[i-1])
            .text(keys[i])
            .attr('x', width/2)
            .attr('y', 5)
        })
        .on('mouseout', () => {
          svg.select('.title').remove()
        })
        
      // add the dots  
      svg.selectAll('.lineContainer').selectAll('circle')
        .data(bufferline).enter()
        .append('circle')
        .attr('class', 'dot')
        .attr('cx', d => x(d[0]))
        .attr('cy', d => y(d[1]))
        .attr('r', '3')
        .attr('fill', colors[i-1])  

      // add the x axis
      svg.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x).tickFormat(d3.timeFormat('%d.%m.%Y')))

      // add the y axis
      svg.append('g')
        .call(d3.axisLeft(y))

    } 
    
  }

  render() {
    return <svg></svg>
  }
}