import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register the necessary chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const YearlyProjects = () => {
  // Full data for all years
  const fullData = {
    labels: ["2020", "2021", "2022", "2023", "2024"],
    datasets: [
      {
        label: "Projects per Year",
        data: [5, 5, 15, 5, 25],
        borderColor: "rgba(75,192,192,1)",
        backgroundColor: "rgba(75,192,192,0.2)",
        fill: true,
        tension: 0.1,
      },
    ],
  };

  const [yearRange, setYearRange] = useState([2020, 2024]);
  const [showOptions, setShowOptions] = useState(false);

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

  const handleYearChange = (range) => {
    const [start, end] = range.split("-").map(Number);
    setYearRange([start, end]);
    setShowOptions(false);
  };

  return (
    <div style={{ width: "70%", margin: "0 auto", textAlign: "center" }}>
      <div style={{ marginBottom: "20px" }}>
        <button
          className="select-yearly-button"
          onClick={() => setShowOptions((prev) => !prev)}
          style={{ display: "inline-block", margin: "auto" }}
        >
          Select Range
        </button>

        {showOptions && (
          <div style={{ marginTop: "50px" }}>
            <ul style={{ listStyle: "none", padding: 0 }}>
              <li>
                <button onClick={() => handleYearChange("2020-2024")}>2020-2024</button>
              </li>
              <li>
                <button onClick={() => handleYearChange("2021-2022")}>2021-2022</button>
              </li>
              <li>
                <button onClick={() => handleYearChange("2022-2023")}>2022-2023</button>
              </li>
              <li>
                <button onClick={() => handleYearChange("2022-2024")}>2022-2024</button>
              </li>
              <li>
                <button onClick={() => handleYearChange("2023-2024")}>2023-2024</button>
              </li>
            </ul>
          </div>
        )}
      </div>

      <Line data={filteredData} options={options} />
    </div>
  );
};

export default YearlyProjects;
