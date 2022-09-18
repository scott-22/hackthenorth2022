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

function round(value) {
  return Math.round(value);
}

function App() {
  const [page, setPage] = useState("speed-vs-time");
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
  const [graphData3, setGraphData3] = useState({
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

  function fetchData() {
    fetch("https://hackthenorth2022.uc.r.appspot.com/api/velocities")
      .then(res1 => res1.json())
      .then(res1 => {
        fetch("https://hackthenorth2022.uc.r.appspot.com/api/pose_types")
          .then(res2 => res2.json())
          .then(res2 => {
            console.log({res1, res2});
            const times = res1.map(d => d.time);
            const speeds = res1.map(d => d.value);
            let _maxSpeed = 0;
            let _averageSpeed = 0;
            let count = 0;

            for (const item of res1) {
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
                  label: "Speed",
                  data: speeds,
                  fill: true,
                  backgroundColor: "rgba(75,192,192,0.2)",
                  borderColor: "rgba(75,192,192,1)"
                },
              ]
            });

            // ==========================
            // Pose types
            // ==========================

            const poses = res2;

            // At each index i, stores whether or not velocity[i] is a kick.
            // 2 if it is a kick, 1 if it's a dribble
            const _categorizations = [];

            for (const time of times) {
              const date = new Date(time);
              for (let i = 0; i < poses.length - 1; i++) {
                const pose = poses[i];
                const nextPose = poses[i + 1];
                if (new Date(pose.time).getTime() <= date.getTime() && date.getTime() < new Date(nextPose.time).getTime()) {
                  _categorizations.push(pose.type);
                  break;
                }
              }
            }
            console.log({_categorizations, poses});

            setGraphData3({
              labels: times.map(time => new Date(time).getMinutes() + ":" + new Date(time).getSeconds()),
              datasets: [
                {
                  label: "Speed",
                  data: speeds.map((s, i) => _categorizations[i] === 2 ? s : 0),
                  fill: true,
                  backgroundColor: "rgba(75,192,192,0.2)",
                  borderColor: "rgba(75,192,192,1)"
                },
              ]
            });
            setGraphData2({
              labels: times.map(time => new Date(time).getMinutes() + ":" + new Date(time).getSeconds()),
              datasets: [
                {
                  label: "Speed",
                  data: speeds.map((s, i) => _categorizations[i] === 1 ? s : 0),
                  fill: true,
                  backgroundColor: "rgba(75,192,192,0.2)",
                  borderColor: "rgba(75,192,192,1)"
                },
              ]
            });
          });
      });
  }

  useEffect(() => {
    const interval = setInterval(() => {
      fetchData();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

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
