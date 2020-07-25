var statis = {
    modeOn : false,
    tryCount : 0,   //한 장비당 강화 시도 카운트
    start : 0,
    goal : 0,
    numOfTry : 0   //통계낼 장비의 수
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
}
function setStatis() {
    statis.start = Number(prompt("시작"));
    statis.goal = Number(prompt("끝"));
    if (statis.start >= statis.goal) {
        alert("오류 : 시작값은 목표값보다 작아야합니다");
        return; 
    }
    statis.numOfTry = prompt("시행횟수");
    statisResult.max = 0;
    statisResult.min = 0;
    statisResult.sum = 0;
    startStatis();
}