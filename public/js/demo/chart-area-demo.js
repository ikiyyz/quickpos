// Chart.js global style
Chart.defaults.global.defaultFontFamily = 'Nunito', '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#858796';

function number_format(number, decimals, dec_point, thousands_sep) {
  number = (number + '').replace(',', '').replace(' ', '');
  var n = !isFinite(+number) ? 0 : +number,
    prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
    sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
    dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
    s = '',
    toFixedFix = function(n, prec) {
      var k = Math.pow(10, prec);
      return '' + Math.round(n * k) / k;
    };
  s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
  if (s[0].length > 3) {
    s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
  }
  if ((s[1] || '').length < prec) {
    s[1] = s[1] || '';
    s[1] += new Array(prec - s[1].length + 1).join('0');
  }
  return s.join(dec);
}

function formatMonthLabel(monthStr) {
  // Expects 'August 2022' or similar
  var date = new Date(monthStr);
  if (!isNaN(date)) {
    var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return monthNames[date.getMonth()] + ' ' + String(date.getFullYear()).slice(-2);
  }
  // fallback: just return string
  return monthStr;
}

if (typeof myLineChart === 'undefined') {
  var myLineChart = null;
} else {
  try { myLineChart.destroy(); } catch(e) {}
}

function initDashboardCharts() {
  var ctx = document.getElementById("myAreaChart");
  if (!ctx) return;
  if (myLineChart) { myLineChart.destroy(); }

  // Data
  var earningsData = monthlyEarnings || [];
  if (earningsData.length === 0) return;
  var labels = earningsData.map(function(item) { return formatMonthLabel(item.month); });
  var data = earningsData.map(function(item) { return item.earning; });

  myLineChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: false,
        data: data,
        lineTension: 0.4,
        backgroundColor: "rgba(78, 115, 223, 0.10)",
        borderColor: "#377dff",
        borderWidth: 3,
        pointRadius: 4,
        pointBackgroundColor: "#377dff",
        pointBorderColor: "#377dff",
        pointHoverRadius: 6,
        pointHoverBackgroundColor: "#377dff",
        pointHoverBorderColor: "#377dff",
        pointHitRadius: 10,
        pointBorderWidth: 2,
        fill: true
      }]
    },
    options: {
      maintainAspectRatio: false,
      layout: { padding: { left: 10, right: 10, top: 10, bottom: 0 } },
      scales: {
        xAxes: [{
          gridLines: { display: false, drawBorder: false },
          ticks: { fontColor: '#858796', fontSize: 13 }
        }],
        yAxes: [{
          gridLines: {
            color: "#f0f1f6",
            zeroLineColor: "#f0f1f6",
            drawBorder: false,
            borderDash: [2],
            zeroLineBorderDash: [2]
          },
          ticks: {
            fontColor: '#858796',
            fontSize: 13,
            callback: function(value) { return 'Rp ' + number_format(value); },
            beginAtZero: true,
            maxTicksLimit: 6
          }
        }]
      },
      legend: { display: false },
      tooltips: {
        backgroundColor: "#fff",
        bodyFontColor: "#858796",
        borderColor: '#e3e6f0',
        borderWidth: 1,
        xPadding: 15,
        yPadding: 15,
        displayColors: false,
        caretPadding: 10,
        callbacks: {
          label: function(tooltipItem) {
            return 'Rp ' + number_format(tooltipItem.yLabel);
          }
        }
      }
    }
  });
}
document.addEventListener('DOMContentLoaded', initDashboardCharts);