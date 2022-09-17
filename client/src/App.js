import React, { useEffect, useState } from 'react';

import './App.css';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
)

function App() {
  const [data, setData] = useState([]);
  const [maxSpeed, setMaxSpeed] = useState(0);
  const [averageSpeed, setAverageSpeed] = useState(0);
  const [graphData, setGraphData] = useState({
    labels: [0, 1, 2],
    datasets: [
      {
        label: "Speed",
        data: [0, 1, 2],
        fill: true,
        backgroundColor: "rgba(75,192,192,0.2)",
        borderColor: "rgba(75,192,192,1)"
      },
    ]
  });

  useEffect(() => {
    fetch("https://hackthenorth2022.uc.r.appspot.com/api/velocities")
        .then(res => res.json())
        .then(res => {
          setData(res);

          const times = data.map(d => d.time);
          const speeds = data.map(d => d.value);
          let _maxSpeed = 0;
          let _averageSpeed = 0;
          let count = 0;

          for (const item of data) {
            _maxSpeed = Math.max(_maxSpeed, item.value);
            _averageSpeed = (_averageSpeed * count + item.value) / (count + 1);
            count++;
          }

          _averageSpeed = Math.round(_averageSpeed * 1000) / 1000;

          setAverageSpeed(_averageSpeed);
          setMaxSpeed(_maxSpeed);

          setGraphData({
            labels: times.map(time => new Date(time).getMinutes() + ":" + new Date(time).getSeconds()),
            datasets: [
              {
                label: "speeds",
                data: speeds,
                fill: true,
                backgroundColor: "rgba(75,192,192,0.2)",
                borderColor: "rgba(75,192,192,1)"
              },
            ]
          });
        })
  })

  return (
    <div className="dashboard">
      <h2>Dashboard</h2>
      <div className="data-container">
        <div style={{height: "60vh", width: "50vw"}} >
          <Line data={graphData} options={{ maintainAspectRatio: false }}/>
        </div>

        <div>
          <div className="velocity-display">
            <h3>HIGHEST SPEED</h3>
            <p><span>{maxSpeed}</span> m/s</p>
          </div>
          <div className="velocity-display">
            <h3>AVERAGE SPEED</h3>
            <p><span>{averageSpeed}</span> m/s</p>
          </div>
        </div>
      </div>
    </div>
  );

}

export default App;
