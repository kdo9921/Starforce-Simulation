var statisMode = false;

var resultArr = new Array();
var luckArr = new Array();
var labelArr = new Array();
var accumulateArr = new Array();
var statisTryCount;
var howManyTry;
var howManyRun;


function statis() {
    statisMode = true;
    var startStar = Number(document.getElementById("statis_start").value);
    var goalStar = Number(document.getElementById("statis_goal").value);
    if (maxStar < goalStar) {
        alert("오류 : 목표 강화수치가 현재 강화중인 장비의 최대 강화 수치보다 높습니다");
        statisMode = false;
        return 0;
    }
    if (startStar >= goalStar) {
        alert("오류 : 시작 강화수치가 목표 강화수치보다 높습니다");
        statisMode = false;
        return 0;
    }
    howManyTry = Number(document.getElementById("statis_hmt").value);
    howManyRun = Number(document.getElementById("statis_hmr").value);
    for (var i = 0; i < howManyTry + 1; i++) {
        resultArr[i] = 0;
    }
    
    function setluck() {
        for (var i = 0; i < howManyTry; i++) {
            luckArr[i] = Math.random();
        }
    }
    
   
    for(var i = 0; i < howManyRun; i++) {
        setluck()
        statisTryCount = 0;
        starforce = startStar;
        for (var j = 0; j < howManyTry; j++) {
            if (starforce < goalStar) {
                force();
                statisTryCount += 1;
            } else {break;}
        }
        resultArr[statisTryCount] += 1;
    }
    setInfo();
    document.getElementById('statis_graph').style.display = "block";
    const element =  document.querySelector('#statis_graph')
    element.classList.add('animated', 'slideInUp')
    makeChart();
    resultArr.splice(0)
    statisMode = false;
}

function makeChart() {
    accumulateArr.splice(0);
    labelArr.splice(0);
    var ctx = document.getElementById('sfChart').getContext('2d');
    
    for (var i = 0; i < howManyTry; i++) {
        labelArr[i] = i+1;
        accumulateArr[i] = 0;
    }
    
    for (var i = 0; i < howManyTry; i++) {
        for (var j = 0; j <= i; j++) {
            accumulateArr[i] += resultArr[j];
        }
    }
    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labelArr,
            datasets: [{
                label: '스타포스 통계',
                data: accumulateArr,
                
                backgroundColor: [
                    'rgba(76, 175, 80, 1)'
                ],
                borderColor: [
                    'rgba(173, 255, 47, 1)'
                ],
                
                borderWidth: 0
            }]
        },
        options: {
            responsive: false,
            title: {
                display: true,
                text: '스타포스 통계',
                fontSize: 24
            },
            legend: {
                hidden: true
            },
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
    
}

