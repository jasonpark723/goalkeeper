var donutCategories = JSON.parse(donutCategories);
console.log(donutCategories);
var donutTotal = JSON.parse(donutTotal);
var barMonth = JSON.parse(barMonth);
var barTotal = JSON.parse(barTotal);

var ctx = document.getElementById("chart-overview").getContext("2d");
var myChart = new Chart(ctx, {
  type: "bar",
  data: {
    labels: barMonth,
    datasets: [
      {
        label: "# of Votes",
        data: barTotal,
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)"
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)"
        ],
        borderWidth: 1
      }
    ]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    legend: {
      display: false
    },
    tooltips: {
      enabled: true,
      mode: "single",
      callbacks: {
        label: function(tooltipItems, data) {
          return "$" + tooltipItems.yLabel;
        }
      }
    },
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true
          },
          gridLines: {
            display: false
          }
        }
      ]
    }
  },
  plugins: {
    deferred: {
      // enabled by default
      xOffset: 150, // defer until 150px of the canvas width are inside the viewport
      yOffset: "50%", // defer until 50% of the canvas height are inside the viewport
      delay: 500 // delay of 500 ms after the canvas is considered inside the viewport
    }
  }
});

var ctx = document.getElementById("chart-spending-pattern").getContext("2d");
new Chart(ctx, {
  type: "doughnut",
  data: {
    labels: donutCategories,
    datasets: [
      {
        label: "My First Dataset",
        data: donutTotal,
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
    responsive: true,
    maintainAspectRatio: false,
    legend: {
      display: true,
      fullWidth: false
    },
    tooltips: {
      enabled: true,
      mode: "single",
      callbacks: {
        label: function(tooltipItems, data) {
          return "$" + data.datasets[0].data[tooltipItems.index];
        }
      }
    }
  }
});
