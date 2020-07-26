var itemState = {
    chanceTime : 0,
    currentStar : 0,
    itemLevelIndex : 6 //기본값 160제
}
var forceValue = {
    currentCost : 0,
    totalUseCost : 0,
    destroyCount : 0,
    isPreventDestroy : false,
    tryCount : 0,
    starcatchPercentage : 5.0, //단위 1%
    starcatchMultiple : true
}
var discount = {
    isPcCafe : false,
    mvp : 0, // 0 : 없음, 1 : 실버(3%), 2: 골드(5%), 3 : 다이아(10%)
    event : 0, // 0 ; 이벤트 없음, 1 : 1+1, 2 : 30% 할인, 3 : 5,10,15성 100% 성공
    freePreventDestroy : false,
    totalDiscount : 1.00
}

function reset() {
    //console.log("reset");
    itemState.chanceTime = 0;
    itemState.currentStar = 0;
    forceValue.totalUseCost = 0;
    forceValue.destroyCount = 0;
    forceValue.tryCount = 0;
}

function addComma(num) {    //숫자 3자리씩 끈어 컴마 넣어줌
    return Number(num).toLocaleString('en');
}

window.onload = function () {
    levelApply();
    setValue();
}

function levelApply(){  //레벨 설정을 가져오고 필요하면 배경을 바꾼 후 인덱스값 반환 
    preLevel = itemState.itemLevelIndex
    const levelSelect = document.getElementById("level");
    level = levelSelect.options[levelSelect.selectedIndex].value;
    levelIndex = level / 10 == 20 ? 7 : level / 10 - 10; //200제 장비 때문에 한짓
    maxStar = maxStarArr[levelIndex];
    if (preLevel != levelIndex) {
        reset();
        animateCSS('#background', 'fadeOut', function() {
            document.getElementById("background").style.backgroundImage = "url('./img/background/" + level + ".jpg')"
            animateCSS('#background', 'fadeIn');
        });
        itemState.itemLevelIndex = levelIndex;
    }
    return levelIndex;
}

function setDiscount() {
    var sumDiscount = 1.0;
    if (discount.isPcCafe) {
        sumDiscount -= 0.05;
    }
    sumDiscount -= MVP_SALE[discount.mvp] * 0.01;
    if (discount.event == 2) {
        sumDiscount = (sumDiscount * 0.7).toFixed(3);
    }
    discount.totalDiscount = Number(sumDiscount);
    if (discount.event == 3 && itemState.currentStar == 15) {
        //console.log("15성 100% 이벤트로 인한 파괴방지 미적용") 
        document.getElementById("preventDestroy").disabled = true;
        return;
    }
    if (12 <= itemState.currentStar && itemState.currentStar < 17 &&  forceValue.isPreventDestroy) {
        if(discount.freePreventDestroy && itemState.currentStar < 15) {
            //console.log("15성 이하 무료 파방으로 인한 파괴방지 미적용");
            return;
        }
        discount.totalDiscount += 1.0;
    }
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
    var starString = "";
    for (var i = 0; i < maxStarArr[itemState.itemLevelIndex]; i++) {
        if (i%5 == 0){
            starString += " ";
            if (maxStarArr[itemState.itemLevelIndex] > 15 && i == 15) {
                starString += "<br>";
            }
        }
        if (i < itemState.currentStar) {
            starString += "<span onclick='itemState.currentStar = " + (i + 1) +";setValue();'>★</span>";
        } else {
            starString += "<span onclick='itemState.currentStar = " + (i + 1) +";setValue();'>☆</span>";
        }
    }
    currentStar.innerHTML = starString;

    //notice 내용 표시
    if (itemState.chanceTime == 2) {
        notice.innerHTML = "찬스타임!";
    } else if (itemState.currentStar <= 10){
        notice.innerHTML = "메소를 사용하여 장비를 강화합니다";
    } else {
        notice.innerHTML = "실패시 장비가 파괴되서나 강화 단계가 하락할 수 있습니다";
        if (itemState.currentStar == 11) {
            notice.innerHTML = "실패시 강화 단계가 하락할 수 있습니다";
        } else if (itemState.currentStar == 15 || itemState.currentStar == 20){
            notice.innerHTML = "실패시 장비가 파괴될 수 있습니다";
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
    //총 사용 금액
    totalUsedMeso.innerHTML = addComma(forceValue.totalUseCost);

    //시행횟수 & 파괴 횟수
    destroyCount.innerHTML = forceValue.destroyCount;
    tryCountNotice.innerHTML = forceValue.tryCount;

    //확률 정보 표시 
    var infoText = "";
    infoText = "<div>" + itemState.currentStar + "성 > " + (itemState.currentStar + 1) + "성</div>";
    if (discount.event == 1 && itemState.currentStar < 11) {
        infoText = "<div>" + itemState.currentStar + "성 > " + (itemState.currentStar + 2) + "성</div>";
    }
    if (itemState.chanceTime == 2) {
        infoText += "<div>성공확률 100%</div>"
    } else {
        infoText += "<div>성공확률 : " + (percentDB[itemState.currentStar][0] * 0.1).toFixed(1) + "%</div>";
        if (itemState.currentStar < 11 || itemState.currentStar == 15 || itemState.currentStar == 20){
            infoText += "<div>실패(유지)확률 : " +((discount.freePreventDestroy?percentDB[itemState.currentStar][1]+percentDB[itemState.currentStar][3]:percentDB[itemState.currentStar][1]) * 0.1).toFixed(1) + "%</div>";
        } else {
            infoText += "<div>실패(하락)확률 : " + ((discount.freePreventDestroy?percentDB[itemState.currentStar][2]+percentDB[itemState.currentStar][3]:percentDB[itemState.currentStar][2]) * 0.1).toFixed(1) + "%</div>";
        }
        if (itemState.currentStar > 11 && !discount.freePreventDestroy) {
            infoText += "<div>파괴확률 : " + (percentDB[itemState.currentStar][3] * 0.1).toFixed(1) + "%</div>";
        }
        if (discount.event == 3 && itemState.currentStar < 16 && itemState.currentStar % 5 == 0) {
            infoText = "<div>" + itemState.currentStar + "성 > " + (itemState.currentStar + 1) + "성</div><div>성공확률 100%</div>";
        }
    }
    
    if (itemState.currentStar == maxStarArr[itemState.itemLevelIndex]) {
        infoText = "<div>" + itemState.currentStar + "성</div><div>최대치까지 강화되었습니다<div>";
    }
    info.innerHTML = infoText;
}

function setValue() {   //설정을 읽어 수치를 조정하고 showInfo()를 실행
    levelApply()
    //파괴방지 설정
    document.getElementById("preventDestroy").disabled = true;
    var isPreventDestroyActive = false;
    discount.freePreventDestroy = false;
    if (12 <= itemState.currentStar && itemState.currentStar < 17) {
        document.getElementById("preventDestroy").disabled = false;
        isPreventDestroyActive = document.getElementById("preventDestroy").checked;
        if (itemState.currentStar < 15) {
            discount.freePreventDestroy = document.getElementById("freePreventDestroyEvent").checked;
            if (discount.freePreventDestroy) {
                forceValue.isPreventDestroy = discount.freePreventDestroy;
            }
        }
    }
    forceValue.isPreventDestroy = isPreventDestroyActive;
    
    //MVP 값 가져옴
    discount.mvp = document.getElementById("mvp").selectedIndex;
    //PC방인가?
    discount.isPcCafe = document.getElementById('PCcafe').checked;
    //이벤트 
    var eventSelect = document.getElementsByName("event");
    if (eventSelect) {
        for (var i = 0; i < eventSelect.length; i++) {
            if (eventSelect[i].checked){
               discount.event = i;
            }
        }
    }

    //할인 설정
    setDiscount();

    //스타캐치 설정
    forceValue.starcatchMultiple = document.getElementsByName("starcatch")[0].checked;
    forceValue.starcatchPercentage = Number(document.getElementById("starcatchPercent").value);

    forceValue.currentCost = costDB[itemState.itemLevelIndex][itemState.currentStar];
    forceValue.currentCost = forceValue.currentCost * discount.totalDiscount;

    if (!statis.modeOn) {
        showInfo();
    }
}
function checkMaxStr() {    //최대 강화수치에 도달했으면 참을 반환
    if (itemState.currentStar == maxStarArr[itemState.itemLevelIndex]) {
        return true;
    } 
    return false;
}
function force() {  //강화
    setValue();
    if (checkMaxStr()) {
        alert('최대치까지 강화되었습니다');
        return 0;
    }

    var successCase = percentDB[itemState.currentStar][0];
    if (forceValue.starcatchMultiple) {    //스타캐치 곱적용
        successCase = successCase * (forceValue.starcatchPercentage * 0.01 + 1.00);
    } else {    //스타캐치 합적용
        successCase = successCase + (forceValue.starcatchPercentage * 10);
    }
    var destroyCase = 1000 - percentDB[itemState.currentStar][3]
    var luck = Math.floor(Math.random() * 1000);
    var otherSuccessReason = false;

    if (itemState.chanceTime == 2) {
        //console.log("찬스타임으로 인한 강화 성공 확률 100% 적용");
        otherSuccessReason = true;
    } else if (discount.event == 3 && (itemState.currentStar == 5 || itemState.currentStar == 10 || itemState.currentStar == 15)) {
        //console.log("5, 10, 15성 100% 이벤트에 의한 강화 성공 확률 100% 적용");
        otherSuccessReason = true;
    }
    if (luck < successCase || otherSuccessReason) {   //성공
        //console.log(itemState.currentStar + "성 -> " + (itemState.currentStar + 1) + "성 강화 성공 (파방 적용 : " + forceValue.isPreventDestroy + ")");
        itemState.currentStar += 1;
        itemState.chanceTime = 0;
    } else if (destroyCase < luck && !forceValue.isPreventDestroy) {    //파괴
        //console.log(itemState.currentStar + "성 -> " + (itemState.currentStar + 1) + "성 강화 실패 & 장비 파괴 (파방 적용 : " + forceValue.isPreventDestroy + ")");
        itemState.currentStar = 12;
        forceValue.destroyCount += 1;
        if(!statis.modeOn) {
            alert("Destroyed");
        }
    } else {    //실패 or 하락
        if (itemState.currentStar < 10 || itemState.currentStar % 5 == 0) {  //10성 이하 & 15, 20성
            //console.log(itemState.currentStar + "성 -> " + (itemState.currentStar + 1) + "성 강화 실패 (파방 적용 : " + forceValue.isPreventDestroy + ")");
            //그러나 아무 일도 일어나지 않았다.
        } else {    //하락
            //console.log(itemState.currentStar + "성 -> " + (itemState.currentStar + 1) + "성 강화 실패 & 강화 단계 하락 (파방 적용 : " + forceValue.isPreventDestroy + ")");
            itemState.currentStar -= 1;
            itemState.chanceTime += 1;
        }
    }
    forceValue.tryCount += 1;
    forceValue.totalUseCost += forceValue.currentCost;
    if(!statis.modeOn) {
        setValue();
    }
}