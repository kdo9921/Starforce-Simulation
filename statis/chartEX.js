//<canvas id="myChart" width="400px" height="400px"></canvas>

var ctx = document.getElementById('myChart').getContext('2d');
var chart = new Chart(ctx, {
    // The type of chart we want to create
    type: 'line',

    // The data for our dataset
    data: {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [{
            label: 'My First dataset',
            backgroundColor: 'rgb(255, 99, 132)',
            borderColor: 'rgb(255, 99, 132)',
            data: [0, 10, 5, 2, 20, 30, 45]
        },
        {    
            label: 'My second dataset',
            backgroundColor: 'rgb(99, 255, 132)',
            borderColor: 'rgb(255, 99, 132)',
            data: [10, 20, 15, 12, 30, 40, 55]
        }]
    },

    // Configuration options go here
    options: {}
});