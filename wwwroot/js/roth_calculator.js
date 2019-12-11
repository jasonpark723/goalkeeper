$("#roth-calculator").submit(function(e) {
  e.preventDefault();
  var starting_balance = Number($(this).context[0].value);
  var annual_contribution = Number($(this).context[1].value);
  var current_age = Number($(this).context[2].value);
  var retire_age = Number($(this).context[3].value);
  var rate = Number($(this).context[4].value / 100);
  generateChart(
    current_age,
    retire_age,
    annual_contribution,
    starting_balance,
    rate
  );
});

("use strict");

window.chartColors = {
  red: "rgb(255, 99, 132)",
  orange: "rgb(255, 159, 64)",
  yellow: "rgb(255, 205, 86)",
  green: "rgb(75, 192, 192)",
  blue: "rgb(54, 162, 235)",
  purple: "rgb(153, 102, 255)",
  grey: "rgb(201, 203, 207)"
};

(function(global) {
  var MONTHS = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];

  var COLORS = [
    "#4dc9f6",
    "#f67019",
    "#f53794",
    "#537bc4",
    "#acc236",
    "#166a8f",
    "#00a950",
    "#58595b",
    "#8549ba"
  ];

  var Samples = global.Samples || (global.Samples = {});
  var Color = global.Color;

  Samples.utils = {
    // Adapted from http://indiegamr.com/generate-repeatable-random-numbers-in-js/
    srand: function(seed) {
      this._seed = seed;
    },

    rand: function(min, max) {
      var seed = this._seed;
      min = min === undefined ? 0 : min;
      max = max === undefined ? 1 : max;
      this._seed = (seed * 9301 + 49297) % 233280;
      return min + (this._seed / 233280) * (max - min);
    },

    numbers: function(config) {
      var cfg = config || {};
      var min = cfg.min || 0;
      var max = cfg.max || 1;
      var from = cfg.from || [];
      var count = cfg.count || 8;
      var decimals = cfg.decimals || 8;
      var continuity = cfg.continuity || 1;
      var dfactor = Math.pow(10, decimals) || 0;
      var data = [];
      var i, value;

      for (i = 0; i < count; ++i) {
        value = (from[i] || 0) + this.rand(min, max);
        if (this.rand() <= continuity) {
          data.push(Math.round(dfactor * value) / dfactor);
        } else {
          data.push(null);
        }
      }

      return data;
    },

    labels: function(config) {
      var cfg = config || {};
      var min = cfg.min || 0;
      var max = cfg.max || 100;
      var count = cfg.count || 8;
      var step = (max - min) / count;
      var decimals = cfg.decimals || 8;
      var dfactor = Math.pow(10, decimals) || 0;
      var prefix = cfg.prefix || "";
      var values = [];
      var i;

      for (i = min; i < max; i += step) {
        values.push(prefix + Math.round(dfactor * i) / dfactor);
      }

      return values;
    },

    months: function(config) {
      var cfg = config || {};
      var count = cfg.count || 12;
      var section = cfg.section;
      var values = [];
      var i, value;

      for (i = 0; i < count; ++i) {
        value = MONTHS[Math.ceil(i) % 12];
        values.push(value.substring(0, section));
      }

      return values;
    },

    color: function(index) {
      return COLORS[index % COLORS.length];
    },

    transparentize: function(color, opacity) {
      var alpha = opacity === undefined ? 0.5 : 1 - opacity;
      return Color(color)
        .alpha(alpha)
        .rgbString();
    }
  };

  // DEPRECATED
  window.randomScalingFactor = function() {
    return Math.round(Samples.utils.rand(-100, 100));
  };

  // INITIALIZATION

  Samples.utils.srand(Date.now());

  // Google Analytics
  /* eslint-disable */
  if (document.location.hostname.match(/^(www\.)?chartjs\.org$/)) {
    (function(i, s, o, g, r, a, m) {
      i["GoogleAnalyticsObject"] = r;
      (i[r] =
        i[r] ||
        function() {
          (i[r].q = i[r].q || []).push(arguments);
        }),
        (i[r].l = 1 * new Date());
      (a = s.createElement(o)), (m = s.getElementsByTagName(o)[0]);
      a.async = 1;
      a.src = g;
      m.parentNode.insertBefore(a, m);
    })(
      window,
      document,
      "script",
      "//www.google-analytics.com/analytics.js",
      "ga"
    );
    ga("create", "UA-28909194-3", "auto");
    ga("send", "pageview");
  }
  /* eslint-enable */
})(this);

var presets = window.chartColors;
var utils = Samples.utils;
var inputs = {
  min: -100,
  max: 100,
  count: 8,
  decimals: 2,
  continuity: 1
};

function generateData(
  current_age,
  retire_age,
  annual_contribution,
  starting_balance,
  rate
) {
  let data = [];
  let balance = starting_balance;
  for (let i = 0; i <= retire_age - current_age; i++) {
    data.push(balance);
    balance = (balance + annual_contribution) * (1 + rate);
  }
  return data;
}

function generateLabels(current_age, retire_age) {
  let label = [];
  for (let i = current_age; i <= retire_age; i++) {
    label.push(i);
  }
  return label;
}

var options = {
  responsive: true,
  maintainAspectRatio: false,
  spanGaps: false,
  elements: {
    line: {
      tension: 0.000001
    }
  },
  plugins: {
    filler: {
      propagate: true
    }
  },
  scales: {
    xAxes: [
      {
        gridLines: {
          display: false
        },
        ticks: {
          autoSkip: false,
          maxRotation: 0
        }
      }
    ],
    yAxes: [
      {
        gridLines: {
          display: false
        },
        ticks: {
          // Include a dollar sign in the ticks
          callback: function(value, index, values) {
            return "$" + value / 1000 + "k";
          }
        }
      }
    ]
  }
};

function generateChart(
  current_age,
  retire_age,
  annual_contribution,
  starting_balance,
  rate
) {
  new Chart("roth-chart", {
    type: "line",
    data: {
      labels: generateLabels(current_age, retire_age),
      datasets: [
        {
          backgroundColor: utils.transparentize(presets.green),
          borderColor: presets.green,
          data: generateData(
            current_age,
            retire_age,
            annual_contribution,
            starting_balance,
            rate
          ),
          fill: "origin"
        }
      ]
    },
    options: Chart.helpers.merge(options, {
      legend: {
        display: false
      },
      title: {
        display: false
      },
      tooltips: {
        mode: "index",
        title: false,
        intersect: false,
        enabled: true,
        callbacks: {
          label: function(tooltipItems, data) {
            $("#summary").text(
              "ROTH IRA balance at age " +
                tooltipItems.xLabel +
                " will be $" +
                (tooltipItems.yLabel / 1000).toFixed(1) +
                "k"
            );
            return (
              "at age " +
              tooltipItems.xLabel +
              ": $" +
              (tooltipItems.yLabel / 1000).toFixed(1) +
              "k"
            );
          }
        }
      }
    })
  });
}

// eslint-disable-next-line no-unused-vars
