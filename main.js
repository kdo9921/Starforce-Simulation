var itemState = {
    chanceTime : 0,
    currentStar : 0,
    max_star : 25,
    itemLevelIndex : 6 //기본값 160제
}
var forceValue = {
    currentCost : 0,
    totalUseCost : 0,
    destroyCount : 0,
    isPreventDestroy : false,
    tryCount : 0,
}
var discount = {
    isPcCafeDC : false,
    mvp : 0, // 없음 : 0, 실버 : 3%, 골드 : 5%, 다이아 : 10%
    event : 0, // 0 ; 이벤트 없음, 1 : 1+1, 2 : 30% 할인, 3 : 5,10,15성 100% 성공
    totalDiscount : 1.00
}

function addComma(num) {    //숫자 3자리씩 끈어 컴마 넣어줌
    return Number(num).toLocaleString('en');
}

window.onload = function () {
    levelApply();
    setInfo();
}

function levelApply(){  //레벨 설정을 가져오고 필요하면 배경을 바꾼 후 인덱스값 반환 
    const levelSelect = document.getElementById("level");
    level = levelSelect.options[levelSelect.selectedIndex].value;
    levelIndex = level / 10 == 20 ? 7 : level / 10 - 10; //200제 장비 때문에 한짓
    maxStar = maxStarArr[levelIndex];
    if (levelSelect.options[itemState.itemLevelIndex].value != level) {
        animateCSS('#background', 'fadeOut', function() {
            document.getElementById("background").style.backgroundImage = "url('./img/background/" + level + ".jpg')"
            animateCSS('#background', 'fadeIn');
        });
        itemState.itemLevelIndex = levelIndex;
    }
    return levelIndex;
}
function showInfo() {   //문서에 값을 넣음
    var currentStar = document.getElementById("star");
    var notice = document.getElementById("notice");
    var price = document.getElementById("price");
    var totalUsedMeso = document.getElementById("totalUse");
    var info = document.getElementById("info");
    var destroyCount = document.getElementById("destroyCount");
    var tryCountNotice = document.getElementById("tryCount");

    //스타포스 수치 표시
    var starString = ""
    for (var i = 0; i < itemState.max_star; i++) {
        if (i%5 == 0){
            starString += " ";
            if (itemState.max_star > 15 && i == 15) {
                starString += "<br>";
            }
        }
        if (i < itemState.currentStar) {
            starString += "<span onclick='starforce = " + (i + 1) +";setInfo();'>★</span>";
        } else {
            starString += "<span onclick='starforce = " + (i + 1) +";setInfo();'>☆</span>";
        }
    }
    currentStar.innerHTML = starString;

    //notice 내용 표시
    if (itemState.chanceTime == 2) {
        notice.innerHTML = "찬스타임!"
        infoTextValue += "성공확률 100%"
    } else if (itemState.currentStar <= 10){
        notice.innerHTML = "메소를 사용하여 장비를 강화합니다"
    } else {
        notice.innerHTML = "실패시 장비가 파괴되서나 강화 단계가 하락할 수 있습니다"
        if (itemState.currentStar == 11) {
            notice.innerHTML = "실패시 강화 단계가 하락할 수 있습니다"
        } else if (itemState.currentStar == 15 || itemState.currentStar == 20){
            notice.innerHTML = "실패시 장비가 파괴될 수 있습니다"
        }
    }

    //래벨에 맞는 아이템 이미지 표시
    document.getElementById("itemImg").style.backgroundImage = "url('./img/" + itemImgDB[itemState.itemLevelIndex] + ".png')"

    //강화비용 표시
    if (forceValue.currentCost < costDB[itemState.itemLevelIndex][itemState.currentStar]) {
        price.innerHTML = "<span style='color:#999999;'><s>" + addComma(costDB[itemState.itemLevelIndex][itemState.currentStar]) + "</s></span>&nbsp;&nbsp;" + addComma(forceValue.currentCost);
    } else {
        price.innerHTML = addComma(forceValue.currentCost);
    }


}

function setDiscount() {
    var sumDiscount = 1.0;
    if (discount.isPcCafeDC) {
        sumDiscount -= 0.05;
    }
    sumDiscount -= MVP_SALE[discount.mvp]
    if (discount.event == 2) {
        sumDiscount = (sumDiscount * 0.7).toFixed(3);
    }
    discount.totalDiscount = Number(sumDiscount);
}

function setInfo() {    //설정을 읽어 수치를 조정하고 showInfo()를 실행
    document.getElementById("preventDestroy").disabled = true;
    var isPreventDestroyActive = false;
    if (12 <= itemState.currentStar && itemState.currentStar < 17) {
        document.getElementById("preventDestroy").disabled = false;
        isPreventDestroyActive = document.getElementById("preventDestroy").checked;
        forceValue.isPreventDestroy = isPreventDestroyActive;
    }
    document.getElementById("mvp").options[mvpSelect.selectedIndex].value;

    setDiscount();
    forceValue.currentCost = costDB[itemState.itemLevelIndex][itemState.currentStar];
    forceValue.currentCost = forceValue.currentCost * discount.totalDiscount;
    showInfo();
}
function checkMaxStr() {    //최대 강화수치에 도달했으면 참을 반환
    if (currentState.currentStar == maxStarArr[itemState.max_star]) {
        return true;
    } 
    return false;
}
function force() {  //강화
    applySetting();
    showInfo();
    if (checkMaxStr()) {
        alert('최대치까지 강화되었습니다');
        return 0;
    }
}