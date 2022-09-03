import Chart from 'chart.js/auto'

const ctx = document.getElementById('votes-by-day')

new Chart(ctx, {
  type: 'line',
  data: votesByDayData,
  options: {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  },
})
