new Chart(document.getElementById("piechart1"), {
  type: "doughnut",
  data: {
    labels: ["Food", "Transportation", "Leisure", "Rent"],
    datasets: [
      {
        label: "My First Dataset",
        data: [200, 100, 50, 100],
        backgroundColor: [
          "rgb(255, 99, 132)",
          "rgb(54, 162, 235)",
          "rgb(255, 205, 86)",
          "rgb(132, 233, 99)"
        ]
      }
    ]
  },
  options: {
    legend: {
      display: true,
      fullWidth: false
    }
  }
});
