const maxStarArr = [8,10,15,20,25,25,25,25];
var chance = 0;
var destroyed = 0;
var noDestCheck = 0;
var cost = 0;
var totalUse = 0;
var starCatch = 45;
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
const costDB = [
    [41000, 81000, 121000, 161000, 201000, 241000, 281000, 321000, 0],//100
    [54200, 107500, 160700, 214000, 267200, 320400, 373700, 426900, 480200, 533400, 0],//110
    [70100, 139200, 208400, 277500, 346600, 415700, 484800, 554000, 623100, 692200, 2801600, 3543200, 4397700, 5371700, 6471400, 0],//120
    [88900, 176800, 264600, 352500, 440400, 528300, 616200, 704000, 791900, 879800, 3561700, 4504600, 5591100, 6829300, 8227500, 19586000, 23069100, 26918600, 31149300, 35776100, 0],//130
    [110800, 220500, 330300, 440000, 549800, 569600, 769300, 879100, 988800, 1098600, 4448200, 5625900, 6982900, 8529400, 10275700, 24462200, 28812500, 33620400, 38904500, 44683300, 50974700, 57796700, 65166700, 73102200, 81620200, 0],//140
    [136000, 271000, 406000, 541000, 676000, 811000, 946000, 1081000, 1216000, 1351000, 5470800, 6919400, 8588400, 10490600, 12638500, 30087200, 35437900, 41351400, 47850600, 54958200, 62696400, 71087200, 80152000, 89912300, 100389000, 0], //150
    [164800, 328700, 492500, 656400, 820200, 984000, 1147900, 1311700, 1475600, 1639400, 6639400, 8397300, 10422900, 12731500, 15338200, 36514500, 43008300, 50185100, 58072700, 66698700, 76090000, 86273300, 97274600, 109120000, 121834900, 0], //160
    [321000, 641000, 1281000, 1601000, 1921000, 2241000, 2561000, 2881000, 3201000, 12966500, 16400100, 20356300, 24865300, 29956500, 71316500, 83999600, 98016700, 113422300, 130270000, 148612400, 168501500, 189988600, 213124000, 237957700, 0] //200
];

const itemImgDB = ["100", "110", "120", "130", "140", "150", "160", "200"]

const percentDB = [   //[성공, 실패, 하락, 파괴]
    [950, 50, 0, 0], //0->1
    [900, 100, 0, 0],
    [850, 150, 0, 0],
    [850, 150, 0, 0],
    [800, 200, 0, 0], //4->5
    [750, 250, 0, 0],
    [700, 300, 0, 0],
    [650, 350, 0, 0],
    [600, 400, 0, 0],
    [550, 450, 0, 0],//->10
    [500, 500, 0, 0],
    [450, 0, 550, 0],//->12
    [400, 0, 594, 6],
    [350, 0, 637, 13],
    [300, 0, 686, 14],//->15
    [300, 679, 0, 21],
    [300, 0, 679, 21],
    [300, 0, 679, 21],
    [300, 0, 672, 28],
    [300, 0, 672, 28],//->20
    [300, 630, 0, 70],
    [300, 0, 630, 70],//->22
    [30, 0, 776, 194],
    [20, 0, 686, 294],
    [10, 0, 594, 396], //과연 여기 갈때까지 돌리는 흑우가 있을까?
    [0, 0, 0, 0]
];

function addComma(num) {
    return Number(num).toLocaleString('en');
}

function levelApply(){
    var levelSelect = document.getElementById("level");
    level = levelSelect.options[levelSelect.selectedIndex].value;
    levelIndex = level / 10 - 10 == 10 ? 7 : level / 10 - 10; //200제 장비 때문에 한짓
    maxStar = maxStarArr[levelIndex];
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
    starCatch = 10 * document.getElementById("catchPercent").value;
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
            starHTML += "★";
        } else {
            starHTML += "☆";
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
    if ((luck < starCatch + percentDB[starforce][0]) || chance == 2) {
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