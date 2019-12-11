// var monthly = JSON.parse(monthly);
var today = new Date();
var dd = today.getDate(); //day (number)
var label_days = [];
for (let i = 1; i <= 31; i++) {
  label_days.push(i);
}

var newData = {
  Bills: [],
  Leisure: [],
  Transportation: [],
  Food: []
};

for (let item of monthly) {
  newData[item.category][item.day - 1] = item.total;
}

for (let category in newData) {
  for (let i = 0; i < newData[category].length; i++) {
    if (!newData[category][i]) {
      newData[category][i] = 0;
    }
  }
}

var barChartData = {
  labels: label_days,
  datasets: [
    {
      label: "Rent",
      backgroundColor: "rgba(255, 99, 132, 0.6)",
      data: newData.Bills //rent cost on 1st, 2nd, 3rd etc
    },
    {
      label: "Leisure",
      backgroundColor: "rgba(54, 162, 235, 0.6)",
      data: newData.Leisure //leisure cost on 1st, 2nd, 3rd etc
    },
    {
      label: "Food",
      backgroundColor: "rgba(255, 206, 86, 0.6)",
      data: newData.Food //food cost on 1st, 2nd, 3rd etc
    },
    {
      label: "Transportation",
      backgroundColor: "rgb(132, 233, 99, 0.6)",
      data: newData.Transportation // transportation cost on 1st, 2nd, 3rd etc
    }
  ]
};
window.onload = function() {
  var ctx = document.getElementById("canvas").getContext("2d");
  window.myBar = new Chart(ctx, {
    type: "bar",
    data: barChartData,
    options: {
      legend: {
        display: false
      },
      tooltips: {
        mode: "index",
        title: false,
        intersect: false,
        enabled: true,
        callbacks: {
          label: function(tooltipItems, data) {
            return (
              data.datasets[tooltipItems.datasetIndex].label +
              ": $" +
              tooltipItems.yLabel
            );
          }
        }
      },
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        xAxes: [
          {
            stacked: true,
            gridLines: {
              display: false
            }
          }
        ],
        yAxes: [
          {
            stacked: true,
            gridLines: {
              display: false
            },
            ticks: {
              // Include a dollar sign in the ticks
              callback: function(value, index, values) {
                return "$" + value;
              }
            }
          }
        ]
      }
    }
  });
};
