import React, { Component } from 'react';
import LineChart from './Components/linechart'
import BarChart from './Components/barchart'
import Data from './Data/example'

export default class App extends Component {
  height = 500
  width = 950

  render() {
    return (
      <div>
        <LineChart data={Data} height={this.height} width={this.width}></LineChart>
        <BarChart data={Data} height={this.height} width={this.width}></BarChart>
      </div>
    )
  }
}
