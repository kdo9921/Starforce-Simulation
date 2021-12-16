var statis = {
    modeOn : false,
    tryCount : 0,   //한 장비당 강화 시도 카운트
    start : 0,
    goal : 0,
    restore : 0,
    numOfTry : 0,  //통계낼 장비의 수
    destroyCount : 0
}
var statisResult = {
    max : 0,
    min : 0,
    sum : 0
}
var statisArr = new Object();
statisArr.useMeso = new Array();
statisArr.tryCount = new Array();
function resetArr() {
    statisArr.useMeso.splice(0);
    statisArr.tryCount.splice(0);
}
function showStatis() {
    for (var i = 0; i < statis.numOfTry; i++) {
        console.log(i + "번째 시도");
        console.log("\t사용 메소 : " + addComma(statisArr.useMeso[i]));
        console.log("\t강화 횟수 : " + statisArr.tryCount[i]);
    }
    console.log("\n\n평균 사용 메소 : " + addComma(Math.round(statisResult.sum / statis.numOfTry)));
    console.log("\n\n최대 사용 메소 : " + addComma(statisResult.max));
    console.log("\n\n최저 사용 메소 : " + addComma(statisResult.min));
    document.getElementById('statisResult').innerHTML = "<p>평균 사용 메소 : " 
    + addComma(Math.round(statisResult.sum / statis.numOfTry)) + "</p><br><p>최대 사용 메소 : " 
    + addComma(statisResult.max) + "</p><br><p>최저 사용 메소 : " + addComma(statisResult.min) +"</p><br>"
    + "<p>평균 파괴 횟수 : " + (statis.destroyCount == 0 ? "0" : ((statis.destroyCount / statis.numOfTry).toFixed(3))) + "</p><br>";
    console.log(statis.destroyCount);
    console.log(statis.numOfTry);
}
function startStatis() {
    statis.modeOn = true;
    resetArr();
    for (var i = 0; i < statis.numOfTry; i++) {
        reset()
        itemState.currentStar = statis.start;
        while(itemState.currentStar < statis.goal) {
            force();
        }
        forceValue.totalUseCost += forceValue.destroyCount * statis.restore;
        statisArr.useMeso[i] = forceValue.totalUseCost;
        statisArr.tryCount[i] = forceValue.tryCount;
        if (statisResult.max < forceValue.totalUseCost) {
            statisResult.max = forceValue.totalUseCost;
        }
        if (forceValue.totalUseCost < statisResult.min || i == 0) {
            statisResult.min = forceValue.totalUseCost;
        }
        statisResult.sum += forceValue.totalUseCost;
    }
    statis.modeOn = false;
    showStatis();
    reset();
    showInfo();
}
function setStatis() {
    statis.start = Math.floor(Number(document.getElementById('statisStartStar').value));
    statis.goal = Math.floor(Number(document.getElementById('statisGoalStar').value));
    statis.numOfTry = Math.floor(Number(document.getElementById('statisNumOfTry').value));
    statis.restore = Math.floor(Number(document.getElementById('statisRestore').value));
    statis.destroyCount = 0;
    if (isNaN(statis.start + statis.goal + statis.numOfTry + statis.restore)) {
        alert("오류 :입력된 값이 숫자가 아닙니다.");
        console.log(statis.start);
        console.log(statis.goal);
        console.log(statis.numOfTry);
        console.log(statis.restore);
        return;
    }
    if (statis.start >= statis.goal) {
        alert("오류 : 시작값은 목표값보다 작아야합니다");
        return; 
    }
    if (statis.start < 0) {
        statis.start = 0;
        console.log("오류 : 시작값 0 미만. 시작값에 0 넣음.");
    }
    if (statis.goal > 25) {
        statis.goal = 25;
        console.log("오류 : 목표값 25 초과. 목표값에 25 넣음.");
    }
    if (statis.numOfTry < 1) {
        statis.numOfTry = 1;
        console.log("오류 : 시행횟수 0 미만. 시행횟수에 1 넣음.");
    }
    if (statis.restore < 0) {
        statis.restore = 0;
        console.log("오류 : 복구비용 0 미만. 복구비용에 0 넣음.");
    } 
    statisResult.max = 0;
    statisResult.min = 0;
    statisResult.sum = 0;
    startStatis();
}
