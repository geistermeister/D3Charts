import React, { Component } from 'react'
import * as d3 from 'd3'

export default class LineCHart extends Component {

  componentDidMount() {
    this.DrawChart()
  }

  DrawChart = () => {
    const margin = {top: 40, right: 20, bottom: 80, left: 50}
    const width = this.props.width - margin.left - margin.right
    const height = this.props.height - margin.top - margin.bottom
    let parseTime = d3.timeParse('%d.%m.%Y')
    let data = this.props.data.data
    let keys = Object.keys(data[0])
    let buffer = []

    data.forEach((d,i) => {
      buffer.push(Object.values(d))
      // format the date string into date type
      buffer[i][0] = parseTime(buffer[i][0])
      if(typeof buffer[i][1] != 'number'){
        // number string into int
        buffer[i][1] = parseInt(buffer[i][1])
      }
    })

    let x = d3.scaleBand()
      .rangeRound([0, width])
      .domain(buffer.map(d => d[0]))
      .padding(0.2)


    let y = d3.scaleLinear()
      .domain([0,d3.max(buffer, d => d[1])])
      .range([height, 0])


    // manipulate svg and create group
    let svg = d3.select('.svgBarChart')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform',
            `translate(${margin.left},${margin.top})`)

    // add the x axis
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x).tickFormat(d3.timeFormat('%d.%m.%Y')))
      .selectAll('text')
      .attr("transform", "rotate(-90)")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", "-.55em")


    // add the y axis
    svg.append('g')
     .call(d3.axisLeft(y))

    // add the bars
    svg.selectAll("rect")
      .data(buffer)
      .enter().append("rect")
      .style("fill", "steelblue")
      .attr("x", d => x(d[0]))
      .attr("y", d => y(d[1]) )
      .attr("width", x.bandwidth())
      .attr("height", d => height - y(d[1]))
      // append text for line when mouse over
      .on('mouseover', () => {
        svg.append('text')
          .attr('class', 'title')
          .attr('font-family', 'sans-serif')
          .attr('font-weight', 'bold')
          .attr('fill', 'steelblue')
          .text(keys[0])
          .attr('x', width/2)
          .attr('y', -20)
      })
      .on('mouseout', () => {
        svg.select('.title').remove()
      })
      
  }

  render() {
    return <svg className="svgBarChart"></svg>
  }
}