import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";

// Register the necessary chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const YearlyProjects = () => {
  // Full data for all years
  const fullData = {
    labels: ["2020", "2021", "2022", "2023", "2024"],
    datasets: [
      {
        label: "Projects per Year",
        data: [5, 10, 5, 20, 25],
        borderColor: "rgba(75,192,192,1)",
        backgroundColor: "rgba(75,192,192,0.2)",
        fill: true,
        tension: 0.1,
      },
    ],
  };

  // State for the selected year range
  const [yearRange, setYearRange] = useState([2020, 2024]);

  // Filter data based on the selected range
  const filteredData = {
    labels: fullData.labels.filter((label) => {
      const year = parseInt(label);
      return year >= yearRange[0] && year <= yearRange[1];
    }),
    datasets: [
      {
        ...fullData.datasets[0],
        data: fullData.datasets[0].data.slice(yearRange[0] - 2020, yearRange[1] - 2020 + 1),
      },
    ],
  };

  // Options for the line chart
  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: `Projects per Year (${yearRange[0]}-${yearRange[1]})`,
        font: { size: 16 },
      },
      legend: { position: "top" },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Year",
          font: { size: 12 },
        },
        ticks: {
          font: { size: 10 },
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Projects",
          font: { size: 12 },
        },
      },
    },
  };

  // Handle year range change
  const handleYearChange = (e) => {
    const [start, end] = e.target.value.split("-").map(Number);
    setYearRange([start, end]);
  };

  return (
    <div style={{ width: "60%", height: "1000px", margin: "0 auto", marginTop: "-10px",}}>
      <div style={{ marginBottom: "20px" }}>
        <select
          id="yearRange"
          onChange={handleYearChange}
          value={`${yearRange[0]}-${yearRange[1]}`}
          style={{ width: "150px", padding: "5px" }} // Adjusted width and padding
        >
          <option value="2020-2024">2020-2024</option>
          <option value="2021-2022">2021-2022</option>
          <option value="2022-2023">2022-2023</option>
          <option value="2023-2024">2023-2024</option>
        </select>
      </div>

      <Line data={filteredData} options={options} />
    </div>
  );
};

export default YearlyProjects;
