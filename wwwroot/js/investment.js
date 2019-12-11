function addClickListener() {
  $("tr").click(function() {
    var symbol = $(this)
      .children("td:first-child")
      .text();
    var price = $(this)
      .children("td:nth-child(2)")
      .text();
    $("#stockSymbol").html(symbol);
    $("#stock-symbol").val(symbol);
  });
}

function compare(a, b) {
  const stockA = a.symbol;
  const stockB = b.symbol;
  let comparison = 0;
  if (stockA > stockB) {
    comparison = 1;
  } else if (stockA < stockB) {
    comparison = -1;
  }
  return comparison;
}

function updateData() {
  // https://financialmodelingprep.com/developer/docs
  var url = "https://financialmodelingprep.com/api/v3/stock/real-time-price";
  $.ajax({
    url: url,
    type: "GET",
    crossDomain: true,
    beforeSend: function() {
      // Show image container
      $(".loadingio-spinner-pulse-nrey7o4q7t").show();
      $(".search-form").hide();
    },
    success: function(response) {
      $(".table").remove();

      let resp = response.stockList.slice(0, 2000).sort(compare);
      // let resp = response.stockList.slice(0, 200);

      let $table = $(
        "<table class='table table-hover' id='stock-table'></table>"
      );

      for (let i = 0; i < resp.length; i++) {
        let financial = resp[i];
        let $line = $("<tr></tr>");
        let $lineHader = $("<tr></tr>");
        var $head = $("<thead></thead>");

        for (var key in financial) {
          if (i === 0 && financial.hasOwnProperty(key)) {
            $lineHader.append($("<th></th>").html(key));
          }
        }

        $head.append($lineHader);
        // $table.append($head);

        for (var key2 in financial) {
          if (financial.hasOwnProperty(key2)) {
            $line.append(
              $("<td></td>").html(
                "<a href='#' data-toggle='modal' data-target='#newstock'>" +
                  financial[key2] +
                  "</a>"
              )
            );
          }
        }

        $table.append($line);
      }
      $table.prepend(
        "<thead><tr><th class='sticky-header'>symbol</th><th class='sticky-header'>price</th></tr></thead>"
      );

      $table.appendTo($(".stock-name"));

      addClickListener();
    },
    complete: function(data) {
      // Hide image container
      $(".loadingio-spinner-pulse-nrey7o4q7t").hide();
      $(".search-form").show();
    },

    error: function(xhr, status) {
      alert("error");
    }
  });
}

$("#stock-search").keyup(function() {
  let text = $("#stock-search")
    .val()
    .toUpperCase();
  var table = document.getElementById("stock-table");
  for (let i = 1; i < table.rows.length; i++) {
    let currentRow = table.rows[i];
    let currentSymbol = currentRow.cells[0].innerHTML;
    if (!currentSymbol.includes(text)) {
      $(currentRow).hide();
    } else {
      $(currentRow).show();
    }
  }
});

$(document).ready(function() {
  updateData();
});
