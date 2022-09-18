import React, {useEffect, useState} from 'react';

import './App.css';
import {Line, Bar} from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
)

function roundToTenth(value) {
  return Math.round(value * 10) / 10;
}

function App() {
  const [page, setPage] = useState("dribbles");
  const [maxSpeed, setMaxSpeed] = useState(0);
  const [averageSpeed, setAverageSpeed] = useState(0);
  const [graphData, setGraphData] = useState({
    labels: [],
    datasets: [
      {
        label: "Speed",
        data: [],
        fill: true,
        backgroundColor: "rgba(75,192,192,0.2)",
        borderColor: "rgba(75,192,192,1)"
      },
    ]
  });
  const [graphData2, setGraphData2] = useState({
    labels: [0, 1, 2],
    datasets: [
      {
        label: "Speed",
        data: [1, 2, 3],
        fill: true,
        backgroundColor: "rgba(75,192,192,0.2)",
        borderColor: "rgba(75,192,192,1)"
      },
    ]
  });
  const [graphData3, setGraphData3] = useState({
    labels: [0, 1, 2],
    datasets: [
      {
        label: "Speed",
        data: [1, 2, 3],
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
        console.log("Received some ttuff");

        const times = res.map(d => d.time);
        const speeds = res.map(d => d.value);
        let _maxSpeed = 0;
        let _averageSpeed = 0;
        let count = 0;

        for (const item of res) {
          _maxSpeed = Math.max(_maxSpeed, item.value);
          _averageSpeed = (_averageSpeed * count + item.value) / (count + 1);
          count++;
        }
        console.log("Calculated times, speeds, etc.");
        console.log({times, speeds})

        _averageSpeed = Math.round(_averageSpeed * 1000) / 1000;

        setAverageSpeed(_averageSpeed);
        setMaxSpeed(_maxSpeed);
        console.log("Set average speed and max speed");

        setGraphData2({
          labels: times.map(time => new Date(time).getMinutes() + ":" + new Date(time).getSeconds()),
          datasets: [
            {
              label: "Speed",
              data: speeds,
              fill: true,
              backgroundColor: "rgba(75,192,192,0.2)",
              borderColor: "rgba(75,192,192,1)"
            },
          ]
        });
        console.log("Set graph data");
      })

    fetch("https://hackthenorth2022.uc.r.appspot.com/api/pose_types")
      .then(res => res.json())
      .then(res => {
        let poseType = {};
        for (const _type of res) {
          poseType[roundToTenth(_type.time)] = _type.value;
        }

        const times = [];
        const types = [];
        for (const item of res) {
          if (roundToTenth(item.time) in poseType) {
            if (page === "dribbles" && poseType[item.time] === 1) {
              times.push(item.time);
              types.push(item.value);
            } else if (page === "kicks" && poseType[item.time] === 2) {
              times.push(item.time);
              types.push(item.value);
            } else {
              times.push(item.time);
              types.push(0);
            }
          }
        }
        console.log("Got times and types from pose_types");
        console.log({times, types});

        if (page !== "speed-vs-time") {
          setGraphData3({
            labels: times.map(time => new Date(time).getMinutes() + ":" + new Date(time).getSeconds()),
            datasets: [
              {
                label: "Speed",
                data: types,
                fill: true,
                backgroundColor: "rgba(75,192,192,0.2)",
                borderColor: "rgba(75,192,192,1)"
              },
            ]
          })
        }
      })
  }, [])

  return (
    <div className="dashboard">
      <h2>Dashboard</h2>
      <div className="dashboard-links">
        <div className={page === "speed-vs-time" ? "dashboard-link-active" : ""}
             onClick={() => setPage("speed-vs-time")}>Speed vs. Time
        </div>
        <div className={page === "dribbles" ? "dashboard-link-active" : ""}
             onClick={() => setPage("dribbles")}>Dribbles
        </div>
        <div className={page === "kicks" ? "dashboard-link-active" : ""}
             onClick={() => setPage("kicks")}>Kicks
        </div>
      </div>
      <div className="data-container">
        <div style={{height: "60vh", width: "50vw"}}>
          {page === "speed-vs-time" &&
            <Line data={graphData} options={{maintainAspectRatio: false}}/>
          }
          {page === "dribbles" &&
            <Bar data={graphData2} options={{maintainAspectRatio: false}}/>
          }
          {page === "kicks" &&
            <Bar data={graphData3} options={{maintainAspectRatio: false}}/>
          }
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
