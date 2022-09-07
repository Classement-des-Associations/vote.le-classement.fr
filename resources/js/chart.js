import Chart from 'chart.js/auto'

up.compiler('canvas#chart', function (element, data) {
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

up.compiler('canvas#chartBar', function (element, data) {
  new Chart(element, {
    type: 'bar',
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

up.compiler('canvas#chartPie', function (element, data) {
  new Chart(element, {
    type: 'pie',
    data,
  })
})
