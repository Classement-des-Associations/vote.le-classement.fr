import Chart from 'chart.js/auto'
import 'chartjs-adapter-date-fns'

up.compiler('canvas#chart', function (element, data) {
  data.datasets.forEach((dataset) => {
    dataset.data = dataset.data.map((item) => ({
      x: new Date(item.x).valueOf(),
      y: item.y,
    }))
  })
  console.log(data)
  new Chart(element, {
    type: 'line',
    data,
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
        x: {
          type: 'time',
          time: {
            unit: 'day',
            displayFormats: {
              day: 'dd/MM/yyyy',
            },
          },
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
