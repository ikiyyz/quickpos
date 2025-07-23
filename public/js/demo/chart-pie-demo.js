// Chart.js global style
Chart.defaults.global.defaultFontFamily = 'Nunito', '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#858796';

if (typeof myPieChart === 'undefined') {
  var myPieChart = null;
} else {
  try { myPieChart.destroy(); } catch(e) {}
}

function initDashboardChartsPie() {
  var ctx = document.getElementById("myPieChart");
  if (!ctx) return;
  if (myPieChart) { myPieChart.destroy(); }

  var chartData = pieData || { direct: 0, customer: 0 };
  var direct = chartData.direct || 0;
  var customer = chartData.customer || 0;
  // Agar dua warna selalu muncul minimal 1 slice tipis
  if (direct === 0 && customer > 0) direct = 0.01;
  if (customer === 0 && direct > 0) customer = 0.01;

  myPieChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ["Direct", "Customer"],
      datasets: [{
        data: [direct, customer],
        backgroundColor: ['#377dff', '#1cc88a'],
        hoverBackgroundColor: ['#285ec7', '#17a673'],
        hoverBorderColor: "#e3e6f0",
        borderWidth: 3
      }]
    },
    options: {
      cutoutPercentage: 80,
      maintainAspectRatio: false,
      legend: {
        display: false
      },
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
          label: function(tooltipItem, data) {
            var label = data.labels[tooltipItem.index] || '';
            var value = data.datasets[0].data[tooltipItem.index] || 0;
            return label + ': Rp ' + value.toLocaleString('id-ID');
          }
        }
      }
    }
  });
}
document.addEventListener('DOMContentLoaded', initDashboardChartsPie);