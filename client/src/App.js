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
  const data = [
    {time: 0.17, speed: 10},
    {time: 3.17, speed: 14},
    {time: 6.20, speed: 5},
    {time: 9.15, speed: 7},
    {time: 12.15, speed: 8},
  ];

  const times = [];
  const speeds = [];
  let maxSpeed = 0;
  let averageSpeed = 0;
  let count = 0;

  for (const item of data) {
    times.push(item.time);
    speeds.push(item.speed);
    maxSpeed = Math.max(maxSpeed, item.speed);
    averageSpeed = (averageSpeed * count + item.speed) / (count + 1);
    count++;
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
    <div className="dashboard">
      <h2>Dashboard</h2>
      <div className="data-container">
        <div style={{height: "60vh", width: "50vw"}} >
          <Line data={graphData} options={{ maintainAspectRatio: false }}/>
        </div>

        <div className="velocity-display">
          <h3>HIGHEST VELOCITY</h3>
          <p><span>{maxSpeed}</span> m/s</p>
        </div>
        <div className="velocity-display">
          <h3>AVERAGE VELOCITY</h3>
          <p><span>{averageSpeed}</span> m/s</p>
        </div>
      </div>
    </div>
  );
}

export default App;
