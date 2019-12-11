function createUrl(allStocks) {
  let searchstring = "";
  for (let stock of allStocks) {
    searchstring += stock.symbol + ",";
  }
  const url =
    "https://financialmodelingprep.com/api/v3/stock/real-time-price/" +
    searchstring;
  return url;
}

function addQuantityToList(allStocks, companyList) {
  for (let stockA of allStocks) {
    for (let stockB of companyList) {
      if (stockA.symbol == stockB.symbol) {
        stockB.quantity = stockA.quantity;
        break;
      }
    }
  }
  return companyList;
}

function updateChart(label, data, quantity) {
  var ctx = document.getElementById("chart-stock").getContext("2d");
  new Chart(ctx, {
    type: "pie",
    data: {
      labels: label,
      datasets: [
        {
          label: "My First Dataset",
          data: data,
          backgroundColor: [
            "#ff6384",
            "#ff9f40",
            "#ffcd56",
            "#4bc0c0",
            "#36a2eb",
            "#6c5ce7",
            "#636e72",
            "#fd79a8",
            "#2d3436"
          ]
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      legend: {
        display: true,
        fullWidth: true
      },
      tooltips: {
        enabled: true,
        mode: "single",
        callbacks: {
          label: function(tooltipItems, data) {
            return (
              data.labels[tooltipItems.index] +
              "(" +
              quantity[tooltipItems.index] +
              " shares): $" +
              data.datasets[0].data[tooltipItems.index]
            );
          }
        }
      }
    }
  });
}

$.ajax({
  url: createUrl(allStocks),
  type: "GET",
  crossDomain: true,
  success: function(response) {
    var companyList = response.companiesPriceList;
    addQuantityToList(allStocks, companyList);
    let label = companyList.map(a => a.symbol);

    let data = companyList.map(a => a.price * a.quantity);

    let quantity = companyList.map(a => a.quantity);

    updateChart(label, data, quantity);
  },
  error: function(xhr, status) {
    alert("error");
  }
});
