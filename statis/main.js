var startForce;
var goalForce;
var isNoDust;
var levelIndex;
var starcatchValue;
var isCatchMultiple = true;
var dc30p=false;
var onePlusOne=false;
var ftft100p=false
var isFreeNoDestEvent;
var isPCcafe;
var howManyTry;
var howManyRun;
var luckArr = new Array();
var countTryArr = new Array();
var destroyed = 0;
function setArr() {
    for (var i = 0; i < howManyTry; i++) {
        countTryArr[i] = 0;
    }
}

function setLuckArr() {
    for (var i = 0; i < howManyTry; i++) {
        luckArr[i] = Math.random();
    }
}

function checkSetting() {
    if(document.getElementById('hmr').value < 1) {
        alert("시행 횟수는 1 이상의 수가 와야 합니다")
        return 0;
    }
    howManyRun = document.getElementById('hmr').value;
    if(document.getElementById('hmt').value < 1) {
        alert("최대 강화 시도 횟수는 1 이상의 수가 와야 합니다")
        return 0;
    }
    howManyTry = document.getElementById('hmt').value;
    startForce = document.getElementById('start').value;
    goalForce = document.getElementById('goal').value;
    if (goalForce <= startForce) {
        alert("목표 강화수치는 시작 강화수치보다 높아야합니다.");
        return 0;
    }
    isNoDust = document.getElementById("noDest").checked;
    var levelSelect = document.getElementById("level");
    var level = levelSelect.options[levelSelect.selectedIndex].value;
    levelIndex = level / 10 - 10 == 10 ? 7 : level / 10 - 10; 
    if(goalForce > maxStarArr[levelIndex]) {
        alert("목표 강화수치가 강화할 장비의 최대 강화 수치보다 큽니다.\n목표 강화수치를 " + maxStarArr[levelIndex] + "성 이하로 설정해주세요");
        return 0;
    }
    starcatchValue = document.getElementById('catchPercent').value;
    isFreeNoDestEvent = document.getElementById("freeNoDestEvent").checked;
    var mvp = document.getElementById("mvp");
    mvp = mvp.options[mvp.selectedIndex].value;
    isPCcafe = document.getElementById("PCcafe").checked;
    document.getElementById('setting').style.display = "none";

    doTest();
}

function doTest() {
    var destroyed;
    var currentStar;
    var countTry;
    var chance = 0;
    starcatchValue = (starcatchValue * 0.01).toFixed(2);
    function force(i) {
        if (isCatchMultiple) {
            starcatchValue = percentDB[currentStar][0] * starcatchValue;
        }
        if ((luckArr[i] < starcatchValue + percentDB[currentStar][0]) || chance == 2) {
            currentStar += 1; //강화성공
            if (onePlusOne && currentStar < 12) {
                currentStar += 1;
            }
            chance = 0;
        } else if (ftft100p && currentStar < 16 && currentStar % 5 == 0) {
            currentStar += 1; //강화성공
            chance = 0;
        } else if ((luckArr[i] - percentDB[currentStar][0]) < percentDB[currentStar][1]) {
            currentStar += 0; //강화실패, 등급유지
        } else if ((luckArr[i] - percentDB[currentStar][0] - percentDB[currentStar][1]) < percentDB[currentStar][2]) {
            currentStar += -1; //강화실패, 등급하락
            chance += 1;
        }   else {
            if (noDestCheck || freeNoDest) {
                if (percentDB[currentStar][1] > 0) {
                    currentStar += 0; //강화실패, 등급유지
                } else {
                    currentStar += -1; //강화실패, 등급하락
                    chance += 1;
                }
            } else {
                if (currentStar > 11) { //아주 가끔 버그 
                    destroyed += 1;
                    currentStar = 12;
                    chance = 0;
                    //장비파괴
                }
            }
        }
    }
    function startToGoal() {
        setLuckArr();
        setArr();
        countTry = 0;
        currentStar = startForce;
        for (var i = 0; i < howManyTry; i++) {
            if (currentStar < goalForce) {
                force(countTry);
                countTry += 1;
            } else {break;}
        }
        countTryArr[countTry] += 1;
    }
    for (var i = 1; i < howManyRun; i++) {
        startToGoal();
    }
    alert("done");
}

