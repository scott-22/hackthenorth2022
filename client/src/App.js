import React from 'react';

import './App.css';
import { Line } from 'react-chartjs-2';

function App() {
  const data = [
    {time: 0.17, speed: 10},
    {time: 3.17, speed: 14},
    {time: 6.20, speed: 5},
    {time: 9.15, speed: 7},
    {time: 12.15, speed: 8},
  ];

  const times = [];
  const speeds = [];

  for (const item of data) {
    times.push(item.time);
    speeds.push(item.speed);
  }

  const graphData = {
    labels: times,
    datasets: [
      {
        label: "speeds",
        data: speeds,
        fill: true,
        backgroundColor: "rgba(75,192,192,0.2)",
        borderColor: "rgba(75,192,192,1)"
      },
    ]
  };

  console.log(times, speeds);

  return (
    <div class="html-body">

      <div class="header-container" id="home-div">
        <button class="header-text" onClick="document.getElementById('home-div').scrollIntoView();">Home</button>
        <button class="header-text" onClick="document.getElementById('about-div').scrollIntoView();">Graphs</button>
        <button class="header-text" onClick="document.getElementById('portfolio-div').scrollIntoView();">About Us</button>
        <button class="header-text" onClick="document.getElementById('portfolio-div').scrollIntoView();">Contacts</button>
      </div>
      <div>
        <h2>Data</h2>
        <Line data={graphData} />
      </div>
    </div>
    
  );
}

export default App;
