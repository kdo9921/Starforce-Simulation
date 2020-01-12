const maxStarArr = [8,10,15,20,25,25,25,25];
var chance = 0;
var destroyed = 0;
var noDestCheck = 0;
var cost = 0;
var totalUse = 0;
var maxStar;
var levelIndex;
var tryCount = 0;
var starforce = 0; //현재 강화수치
var pcCafeDC = 0;
var totalDC = 1;
var mvp = 0;
var dc30p = false;
var onePlusOne = false;
var ftft100p = false;
var freeNoDest = false;
var isCatchMultiple = true;
var preLevel = 160;

function addComma(num) {
    return Number(num).toLocaleString('en');
}

function levelApply(){
    var levelSelect = document.getElementById("level");
    level = levelSelect.options[levelSelect.selectedIndex].value;
    levelIndex = level / 10 - 10 == 10 ? 7 : level / 10 - 10; //200제 장비 때문에 한짓
    maxStar = maxStarArr[levelIndex];
    if (preLevel != level) {
        animateCSS('#background', 'fadeOut', function() {
            document.getElementById("background").style.backgroundImage = "url('./img/background/" + level + ".jpg')"
            animateCSS('#background', 'fadeIn');
        });
        preLevel = level;
    }
    return level;
}

function setInfo(){
    var noDest = document.getElementById("noDest");
    if ((starforce < 12) || (starforce > 16)) {
        noDest.disabled = true;
    } else {
        noDest.disabled = false;
    }
    if (freeNoDest && starforce < 15) {
        noDest.disabled = true;
        noDest.checked = false;
    }
    if (noDest.checked) {
        noDestCheck = 1;
    } else {
        noDestCheck = 0;
    }
    if (starforce > 16) {
        noDestCheck = 0;
        document.getElementById("noDest").value = "false";
    }
    cost = costDB[levelIndex][starforce] * totalDC;
    var notice = document.getElementById("notice");
    var itemImg = document.getElementById("itemImg");
    var currentStar = document.getElementById("star");
    var price = document.getElementById("price");
    var totalUsedMeso = document.getElementById("totalUse");
    var info = document.getElementById("info");
    var dest = document.getElementById("dest");
    var tryCountNotice = document.getElementById("tryCount");
    tryCountNotice.innerHTML = addComma(tryCount);
    if (11 < starforce && starforce < 17 && noDestCheck) {
        cost = cost + costDB[levelIndex][starforce];
    }
    var starHTML = "";
    for (var i = 0; i < maxStar; i++) {
        if (i%5 == 0){
            starHTML += " ";
            if (maxStar > 15 && i == 15) {
                starHTML += "<br>";
            }
        }
        if (i < starforce) {
            starHTML += "<span onclick='starforce = " + (i + 1) +";setInfo();'>★</span>";
        } else {
            starHTML += "<span onclick='starforce = " + (i + 1) +";setInfo();'>☆</span>";
        }
    }
    currentStar.innerHTML = starHTML;
    if (cost < costDB[levelIndex][starforce]) {
        price.innerHTML = "<span style='color:#999999;'><s>" + addComma(costDB[levelIndex][starforce]) + "</s></span>&nbsp;&nbsp;" + addComma(cost);
    } else {
        price.innerHTML = addComma(cost);
    }
    totalUsedMeso.innerHTML = addComma(totalUse);
    itemImg.style.backgroundImage = "url('./img/" + itemImgDB[levelIndex] + ".png')"
    infoTextValue = starforce + "성 > " + (starforce + 1) + "성<br>";
    if (onePlusOne && starforce < 11) {
        infoTextValue = starforce + "성 > " + (starforce + 2) + "성<br>";
    }
    if (chance == 2) {
        notice.innerHTML = "찬스타임!"
        infoTextValue += "성공확률 100%"
    } else {
        if (starforce < 11){
            notice.innerHTML = "메소를 사용하여 장비를 강화합니다"
        }else {
            notice.innerHTML = "실패시 장비가 파괴되서나 강화 단계가 하락할 수 있습니다"
            if (starforce < 12) {
                notice.innerHTML = "실패시 강화 단계가 하락할 수 있습니다"
            } else if (starforce == 15 || starforce == 20){
                notice.innerHTML = "실패시 장비가 파괴될 수 있습니다"
            }
        }
        infoTextValue += "성공확률 : " + (percentDB[starforce][0] * 0.1).toFixed(1) + "%";
        if (starforce < 11 || starforce == 15 || starforce == 20){
            infoTextValue += "<br>실패(유지)확률 : " +((freeNoDest?percentDB[starforce][1]+percentDB[starforce][3]:percentDB[starforce][1]) * 0.1).toFixed(1) + "%";
        } else {
            infoTextValue += "<br>실패(하락)확률 : " + ((freeNoDest?percentDB[starforce][2]+percentDB[starforce][3]:percentDB[starforce][2]) * 0.1).toFixed(1) + "%";
        }
        if (starforce > 11 && !freeNoDest) {
            infoTextValue += "<br>파괴확률 : " + (percentDB[starforce][3] * 0.1).toFixed(1) + "%";
        }
        if (ftft100p && starforce < 16 && starforce % 5 == 0) {
            infoTextValue = starforce + "성 > " + (starforce + 1) + "성<br>성공확률 100%";
        }
    }
    dest.innerHTML = addComma(destroyed);
    if (starforce == maxStarArr[levelIndex]) {
        infoTextValue = starforce + "성<br><br>최대치까지 강화되었습니다";
    }
    info.innerHTML = infoTextValue;
}
function force(){
    var starcatchPoint = 0;
    var isStarcatchChecked = document.getElementById('isCatch').checked;
    if (isStarcatchChecked) {
        if (isCatchMultiple) {
            starcatchPoint = percentDB[starforce][0] * document.getElementById("catchPercent").value * 0.01;
        } else {
            starcatchPoint = document.getElementById("catchPercent").value * 10;
        }
    } else {
        starcatchPoint = 0;
    }
    tryCount += 1;
    totalUse += cost;
    if (starforce == 0) {
        levelApply();
    }
    if ((starforce > 0) && level != levelApply()) {
        alert("오류 : 강화도중 장비의 레벨이 변경되었습니다.");
    }
    if (starforce == maxStar){
        alert("최대치까지 강화되었습니다.");
        return 0;
    }
    var luck = Math.floor(Math.random() * 1000) + 1;
    if ((luck < starcatchPoint + percentDB[starforce][0]) || chance == 2) {
        starforce += 1; //강화성공
        if (onePlusOne && starforce < 12) {
            starforce += 1;
        }
        chance = 0;
    }   else if (ftft100p && starforce < 16 && starforce % 5 == 0) {
        starforce += 1; //강화성공
        chance = 0;
    } 
    else if ((luck - percentDB[starforce][0]) < percentDB[starforce][1]) {
        starforce += 0; //강화실패, 등급유지
    } else if ((luck - percentDB[starforce][0] - percentDB[starforce][1]) < percentDB[starforce][2]) {
        starforce += -1; //강화실패, 등급하락
        chance += 1;
    } else {
        if (noDestCheck || freeNoDest) {
            if (percentDB[starforce][1] > 0) {
                starforce += 0; //강화실패, 등급유지
            } else {
                starforce += -1; //강화실패, 등급하락
                chance += 1;
            }
        } else {
            if (starforce > 11) { //아주 가끔 버그 
                alert("Destroyed");
                destroyed += 1;
                starforce = 12;
                chance = 0;
                //장비파괴
            }
        }
    }
    setInfo();
}
function applyBtn(){
    tryCount = 0;
    cost = 0;
    starforce = 0;
    totalUse = 0;
    levelApply();
    setInfo();
}
function getTotalDC() {
    var mvpSelect = document.getElementById("mvp");
    var isNoDestEvent = document.getElementById("freeNoDestEvent").checked;
    if (isNoDestEvent) {
        freeNoDest = true;
    } else {
        freeNoDest = false;
    }
    mvp = Number(mvpSelect.options[mvpSelect.selectedIndex].value);
    totalDC = 1 - ((mvp + pcCafeDC) / 100);
    if (dc30p) {
        totalDC = totalDC * 0.7;
    }
    setInfo();
}

function applyPCcafeDC() {
    var isPCcafe = document.getElementById('PCcafe');
    if (isPCcafe.checked) {
        pcCafeDC = 10;
    } else {
        pcCafeDC = 0;
    }
    getTotalDC();
}

function reset() {
    chance = 0;
    destroyed = 0;
    noDestCheck = 0;
    cost = 0;
    totalUse = 0;
    tryCount = 0;
    starforce = 0;
    getTotalDC();
}


var bonobono = 0;
function fuckbonobono() {
    if (level == 200) { //https://twitter.com/Kerble_S2/status/1213065969259515904?s=20 이분 요청
        animateCSS('#background', 'fadeOut', function() {
            document.getElementById("background").style.backgroundImage = "url('https://upload.wikimedia.org/wikipedia/commons/4/48/Gay_Pride_Flag.svg')"
            animateCSS('#background', 'fadeIn');
        });
    }
    //https://twitter.com/KNOPT30427/status/1213149526044770304?s=20 이분요청
    itemImg.style.backgroundImage = "url('https://i.pinimg.com/564x/fe/1c/9d/fe1c9db12c70749834c5875de91d7d59.jpg')"
    const element =  document.querySelector('#itemImg');
    element.classList.add('animated', 'pulse',);
}
function checkBono(){
    if ( document.getElementById("catchPercent").value == 141) {
        bonobono = 140;
    }
    if (bonobono == 140){
        bonobono = 0;
        fuckbonobono()
        return 0;
    }
    bonobono +=1;
}