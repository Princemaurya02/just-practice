/* ========= TIME SERIES CROWD GRAPH ========= */

const timeSeriesCtx = document.getElementById("timeSeriesChart");

new Chart(timeSeriesCtx, {
  type: "line",
  data: {
    labels: [
      "06:00", "07:00", "08:00", "09:00",
      "10:00", "12:00", "15:00", "18:00", "21:00"
    ],
    datasets: [{
      label: "Crowd Level (0–10)",
      data: [2, 4, 8, 9, 6, 4, 5, 8, 4],
      fill: true,
      tension: 0.4,
      backgroundColor: "rgba(37, 99, 235, 0.2)",
      borderColor: "#2563eb",
      pointRadius: 5
    }]
  },
  options: {
    responsive: true,
    scales: {
      y: {
        min: 0,
        max: 10,
        title: {
          display: true,
          text: "Crowd Intensity"
        }
      },
      x: {
        title: {
          display: true,
          text: "Time"
        }
      }
    }
  }
});


/* ========= DAILY CROWD LINE GRAPH ========= */

const lineCtx = document.getElementById("lineChart");

new Chart(lineCtx, {
  type: "line",
  data: {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [{
      label: "Average Crowd",
      data: [6, 7, 8, 7, 9, 5, 4],
      borderColor: "#16a34a",
      backgroundColor: "rgba(22, 163, 74, 0.2)",
      tension: 0.4,
      fill: true,
      pointRadius: 5
    }]
  },
  options: {
    responsive: true,
    scales: {
      y: {
        min: 0,
        max: 10,
        title: {
          display: true,
          text: "Crowd Level"
        }
      }
    }
  }
});
