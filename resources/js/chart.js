import Chart from 'chart.js/auto'

up.compiler('canvas#chart', function (element, data) {
  console.log(data)
  new Chart(element, {
    type: 'line',
    data,
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  })
})
