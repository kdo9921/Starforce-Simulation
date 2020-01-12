var statisMode = false;
var startStar;
var goalStar;
var resultArr = new Array();
var luckArr = new Array();
var statisTryCount;
function statis() {
    alert("주의 : 통계모드는 아직 테스트 중인 기능이며 데이터 처리는 사용자의 기기에서 담당합니다.\n너무 큰 값을 넣거나 오류가 발생하면 브라우저가 종료될 수 있습니다.")
    statisMode = true;
    startStar = Number(prompt("시작 강화수치를 입력해주세요"));
    goalStar = Number(prompt("목표 강화수치를 입력해주세요"));
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
    var howManyTry = Number(prompt("한 장비당 최대 시도 횟수를 입력하세요", 100));
    var howManyRun = Number(prompt("표본 갯수를 입력하세요\n값이 클수록 오차가 적은 값을 얻을 수 있지만 계산하는데 많은 시간이 걸립니다.", 100));
    for (var i = 0; i < howManyTry; i++) {
        resultArr[i] = 0;
    }
    
    function setluck() {
        for (var i = 0; i < howManyTry; i++) {
            luckArr[i] = Math.random();
        }
    }
    
   
    for(var i = 0; i < howManyRun; i++) {
        statisTryCount = 0;
        starforce = startStar;
        for (var i = 0; i < howManyTry; i++) {
            if (starforce < goalStar) {
                force();
                setInfo();
                statisTryCount += 1;
            } else {break;}
        }
        resultArr[statisTryCount];
    }
    alert("done!\n" + resultArr);
}
