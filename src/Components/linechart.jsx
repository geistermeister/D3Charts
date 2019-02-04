import React, { Component } from 'react'
import * as d3 from 'd3'
import propTypes from 'prop-types'

export default class LineChart extends Component {

  componentDidMount() {
    this.DrawChart()
  }

  DrawChart = () => {
    const margin = {top: 40, right: 30, bottom: 45, left: 50}
    const width = this.props.width - margin.left - margin.right
    const height = this.props.height - margin.top - margin.bottom
    let parseTime = d3.timeParse('%d.%m.%Y')
    let colors = ['orange', 'blue', 'red', 'yellow', 'green']
    let buffer = []
    let bufferLine = []
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
        }
        if(buffer[i][j] > maxX){
          maxX = buffer[i][j]
        }
      }
    })

    // manipulate svg and create group
    let svg = d3.select('.svgLineChart')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .attr('font-family', 'Sans-Serif')
      .attr('font-size', 14)
      
      svg.append('g')
      .attr('class', 'legend')
      .attr('height', 100)
      .attr('width', '100%')
      
      svg.append('g')
      .attr('class', 'graph')
      .attr('transform',
            `translate(${margin.left},${margin.top})`)
      
  
    let x = d3.scaleTime()
      .domain(d3.extent(buffer, d => d[0]))
      .range([0, width])

    
    let y = d3.scaleLinear()
      .domain([0, maxX + 0.05 * height])
      .range([height + 0.05 * height, 0])


    // splits data array into arrays
    // e.g. array[date, value1, value2] = array[date, value1] & array[date, value2] 
    for(let lineNr = 1; lineNr < buffer[0].length; lineNr++){
      let fusionArray1 = []
      for(let j = 0; j < buffer.length; j++){
        let fusionArray2 = []
        fusionArray2[0] = buffer[j][0]
        fusionArray2[1] = buffer[j][lineNr]
        fusionArray1.push(fusionArray2)
      }

      bufferLine.push(fusionArray1)

      // define the line
      let line = d3.line()
        .x(d => x(d[0]))
        .y(d => y(d[1]))
        .curve(d3.curveMonotoneX)
      

      let legendPlacer = width / (keys.length) 

      // add key to legend
      svg.select('.legend')
        .append('rect')
        .attr('fill', () => (lineNr-1 > colors.length - 1) ? colors[colors.length -1] : colors[lineNr-1])
        .attr('height', 10)
        .attr('width', 40)
        .attr('x', lineNr * legendPlacer - (keys[keys.length - 1].length / 2) * 8)
        .attr('y', 20)
      
      svg.selectAll('.legend').append('text')
        .text(keys[lineNr])
        .attr('fill', () => (lineNr-1 > colors.length - 1) ? colors[colors.length -1] : colors[lineNr-1])
        .attr('x', lineNr * legendPlacer - (keys[keys.length - 1].length / 2) * 8 + 50)
        .attr('y', 30)

      // add the line
      svg.select('.graph')
      .append('g')
        .attr('class', 'lineContainer')
        .append('path')
        .data([bufferLine[lineNr-1]])
        .attr('id', `line${lineNr}`)
        .attr('class', 'line')
        .attr('d', line)
        .attr('fill', 'none')
        .attr('stroke', () => (lineNr-1 > colors.length - 1) ? colors[colors.length -1] : colors[lineNr-1])
        .attr('stroke-width', '2.5')
        // append text for line when mouse over
        .on('mouseover', () => {
          svg.select('.graph').append('title')
            .attr('class', 'title')
            .text(keys[lineNr])
        })
        .on('mouseout', () => {
          svg.select('.title').remove()
        })
        
      // add the dots  
      svg.selectAll('.lineContainer').selectAll('circle')
        .data(bufferLine[lineNr-1]).enter()
        .append('circle')
        .attr('class', 'dot')
        .attr('cx', d => x(d[0]))
        .attr('cy', d => y(d[1]))
        .attr('r', '3')
        .attr('fill', () => (lineNr-1 > colors.length - 1) ? colors[colors.length -1] : colors[lineNr-1])
        // append text for line when mouse over
        .on('mouseover', (d,i) => {
          svg.select('.graph').append('title')
            .attr('class', 'title')
            .text(() => `${keys[lineNr]} Value: ${bufferLine[lineNr - 1][i][1]}`)
        })
        .on('mouseout', () => {
          svg.select('.title').remove()
        })  
    } 

    let xAxsesPosition = height + 0.05 * height

    // add the x axis
    svg.select('.graph')
    .append('g')
      .attr('transform', `translate(0,${xAxsesPosition})`)
      .call(d3.axisBottom(x).tickFormat(d3.timeFormat('%d.%m.%Y')))

    // add the y axis
    svg.select('.graph')
    .append('g')
      .call(d3.axisLeft(y))
    
  }

  render() {
    return <svg className='svgLineChart'></svg>
  }
}

LineChart.propTypes = {
  data: propTypes.array.isRequired,
  width: propTypes.number.isRequired,
  height: propTypes.number.isRequired
}