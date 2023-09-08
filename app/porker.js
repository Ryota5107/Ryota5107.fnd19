'use strict'
// 1行目に記載している 'use strict' は削除しないでください

//テストコード-------------------------------------------------
function test(actual, expected) {
    if (JSON.stringify(actual) === JSON.stringify(expected)) {
        console.log("OK! Test PASSED.");
    } else {
        console.error("Test FAILED. Try again!");
        console.log("    actual: ", actual);
        console.log("  expected: ", expected);
        console.trace();
    }
}
//--------------------------------------------------------------

/** allTrumpを初期化する関数 
 * @param {} 
 * @returns {}
 *
 */

function Initialization() {
    initializationBoo = true
    //山札を初期化
    allTrump = [];
    myCards = [];
    for (const Mark of trumpMark) {
        for (let i = 1; i < 14; i++) {
            let result = {};
            result.mark = Mark;
            result.number = i;
            allTrump.push(result);
        }
    }
    let result = {};
    result.mark = "joker";
    result.number = 0
    allTrump.push(result);
    allTrump.push(result);

    //山札内をシャッフル
    const shuffleArr = []
    for (let i = 0; i < 54; i++) {
        const k = Math.floor(Math.random() * allTrump.length)
        shuffleArr.push(allTrump.splice(k, 1)[0])
    }
    allTrump = shuffleArr
}

/** 自分の手札（myHand）にランダムにシャッフルされた5枚を追加
 * ※初期化しないと動かない
 * @param {} 
 * @returns {}
 *
 */
function distribute() {
    for (let i = 0; i < 5; i++) {
        myCards.push(allTrump.shift())
    }
}

/** 文字列内の重複
 * 
 * @param {object}ary// 
 * @returns {boolean}turue or false
 *
 */
function existsSameValue(ary) {
    let s = new Set(ary);
    return s.size != ary.length;
}


/** 数字を昇順に並び替え
 * 
 * @param {object}ary// 
 * @returns {object}昇順に並び変えた後の配列
 *
 */


const ascending = (ary) => ary.sort((a,b) => (a < b ? -1 : 1));



/** 自分の手札（myCars）の任意のカードを選択し、交換する
 * 
 * @param {object}changeCardsIndexs //myCards配列の交換したいカードのインデックス番号
 * @returns {object}//任意のカードを交換した新しい5つのオブジェクト
 * 
 */
function swapCards(changeCardsIndexs) {
    for (const index of changeCardsIndexs) {
        myCards.splice(index, 1, allTrump.shift())

    }
}

/** 役を判定する
 * 
 * @param {object}myCards //myCards（自分の手札）
 * @returns {sturing}//そろっている役の文字列
 * 
 */

function judgeCards(myCards) {
    //カード情報の配列宣言(柄)
    const marks = [];
    //カード情報の配列宣言(数字)
    const numbers = [];

    //役判定

    let allmarks = false;
    let RoyalStraightFlush = true;
    let SequentialNumber = false;
    let sumDuplicate = 0;
    let count = {};
    let pair = [];

    //柄、数字をそれぞれ配列へ追加。
    for (const card of myCards) {

        if (card.mark !== "joker") {
            marks.push(card.mark);
        }
        numbers.push(card.number);
    }

    //数字を昇順に並び替え
    ascending(numbers);

    //柄が全て揃っているか(ジョーカー判定)============
    count = {};
    pair = []
    sumDuplicate = 0

    //重複している柄、それぞれの数を取得
    for (let i = 0; i < marks.length; i++) {
        let elm = marks[i];
        count[elm] = (count[elm] || 0) + 1;
    }
    for (const key in count) {
        if (count[key] !== 1) {
            pair.push(count[key]);
        } else if (key === 'joker') {
            pair.push(count[key]);
        }
    }
    if (JSON.stringify(pair) === JSON.stringify([marks.length])) {
        allmarks = true;
    }
    //==================================================
    //10・11・12・13・1・0(joker)で数字が揃っているか====
    for (const num of numbers) {
        if (!(num >= 10 && num <= 13 || num === 0 || num === 1)) {
            RoyalStraightFlush = false
        }
        const nums = [];
        if (num !== 0) {
            nums.push(num);
        }
        if (existsSameValue(nums) === true) {
            RoyalStraightFlush = false
        }
    }
    //==================================================

    //数字が連番であるか
    SequentialNumber = judgeSequentialNumber(numbers)
    //重複したnumberの数を配列に格納

    //ペア判定=======================================
    count = {};
    pair = [];
    //重複チェック
    if (numbers[0] === 0 && numbers[1] !== 0) {
        //joker1だったら
        for (let i = 0; i < numbers.length; i++) {
            let elm = numbers[i];
            count[elm] = (count[elm] || 0) + 1;
        }
        for (const key in count) {
            if (count[key] !== 1) {
                pair.push(count[key]);
            }
        }
        if (JSON.stringify(pair) === JSON.stringify([])) {
            pair[0] = 2
        } else {
            pair[0] += 1
        }

    } else if (numbers[1] === 0) {
        //joker2だったら
        const nums = Array.from(numbers);
        ascending(nums);
        nums.splice(0, 1);
        nums.splice(0, 1);

        for (let i = 0; i < nums.length; i++) {
            let elm = nums[i];
            count[elm] = (count[elm] || 0) + 1;
        }

        for (const key in count) {
            if (count[key] !== 1) {
                pair.push(count[key]);
            }
        }

        if (JSON.stringify(pair) === JSON.stringify([])) {
            pair[0] = 3
        } else {
            pair[0] += 2
        }

    } else {
        //joker無しだったら
        for (let i = 0; i < numbers.length; i++) {
            let elm = numbers[i];
            count[elm] = (count[elm] || 0) + 1;
        }
        for (const key in count) {
            if (count[key] !== 1) {
                pair.push(count[key]);
            }
        }

    }
    ascending(pair)
    //==================================================

    //ファイブカード判定
    if (JSON.stringify(pair) === JSON.stringify([5]) || JSON.stringify(pair) === JSON.stringify([6])) {
        return `Five Cards!!`
    }
    //ロイヤルストレートフラッシュ判定
    if (RoyalStraightFlush === true && allmarks === true) {
        return `Royal Straight Flush!!`
    }
    //ストレートフラッシュ判定
    if (SequentialNumber === true && allmarks === true) {
        return `Straight Flush!!`
    }
    //フォーカード判定
    if (JSON.stringify(pair) === JSON.stringify([4])) {
        return `Four Cards!!`
    }
    //フラッシュ判定
    if (allmarks === true) {
        return `Flush!!`
    }
    //ストレート判定
    if (SequentialNumber === true) {
        return `Straight!!`
    }
    //フルハウス判定
    if (JSON.stringify(pair) === JSON.stringify([2, 3])) {
        return `full house!!`
    }
    //スリーカード判定
    if (JSON.stringify(pair) === JSON.stringify([3])) {
        return `Three Cards!!`
    }
    //ツーペア判定
    if (JSON.stringify(pair) === JSON.stringify([2, 2])) {
        return `Two Pairs!!`
    }
    //ワンペア判定
    if (JSON.stringify(pair) === JSON.stringify([2])) {
        return `One Pairs!!`
    }

    return `nopear...`
}

/** 与えられた配列が連番か判定する（配列は昇順かつ5つのもの）
 * ※初期化しないと動かない
 * @param {object}ary //要素数が5つかつ昇順の配列
 * @returns {boolean}true or false
 *
 */
function judgeSequentialNumber(ary) {
    const clone = Array.from(ary);
    let pastNum = clone[0]
    let firstCount = 1
    let count = 0
    //重複チェック=============================================
    let tcount = {};
    let sumDuplicate = 0
    const tclone = Array.from(ary);
    if (tclone[1] === 0) {
        tclone.splice(0, 1)
        tclone.splice(0, 1)
    }
    for (let i = 0; i < tclone.length; i++) {
        let elm = tclone[i];
        tcount[elm] = (tcount[elm] || 0) + 1;
    }
    for (const key in tcount) {
        if (tcount[key] !== 1) {
            sumDuplicate += tcount[key];
        }
    }

    if (sumDuplicate !== 0) {
        return false

    }
    //===========================================================

    //連番だったらtrue(jorker1枚)================================
    count = 0
    if (clone[0] === 0) {
        //編集できるよう新しい配列を宣言
        const aryJoker1 = Array.from(ary);
        aryJoker1.splice(0, 1)
        //最値から期待される連番の配列を宣言
        const expectedPair = [aryJoker1[0]]
        for (let i = 1; i < 5; i++) {
            expectedPair.push(aryJoker1[0] + i)
        }
        for (const expected of expectedPair) {
            for (const joker of aryJoker1) {
                if (expected === joker) {
                    count++
                }
            }
        }
        if (count === 4) {
            return true
        }
    }
    //===========================================================
    //連番だったらtrue(jorker2枚)================================
    count = 0
    if (clone[1] === 0) {
        //編集できるよう新しい配列を宣言
        const aryJoker2 = Array.from(ary);
        aryJoker2.splice(0, 1)
        aryJoker2.splice(0, 1)
        //最値から期待される連番の配列を宣言
        const expectedPair = [aryJoker2[0]]
        for (let i = 1; i < 5; i++) {
            expectedPair.push(aryJoker2[0] + i)
        }
        for (const expected of expectedPair) {
            for (const joker of aryJoker2) {
                if (expected === joker) {
                    count++
                }
            }
        }
        if (count === 3) {
            return true
        }
    }
    //===========================================================
    //連番だったらtrue(joker無し)================================
    count = 0
    for (let i = firstCount; i < 5; i++) {
        if (pastNum + 1 !== clone[i]) {
            count = 100
        }
        pastNum = clone[i]
        count++;
    }
    if (count === 4) {
        return true
    }
    //===========================================================
    //13と1をまたいでも連番だったらtrue(jorker1)================================
    count = 0
    if (clone[0] === 0) {
        //編集できるよう新しい配列を宣言
        const aryJoker1 = Array.from(ary);
        aryJoker1.splice(0, 1)

        for (let i = 0; i < aryJoker1.length; i++) {
            if (aryJoker1[i] <= 4) {
                aryJoker1[i] += 13
            }
        }
        //昇順に並び替え
        ascending(aryJoker1);
        //最値から期待される連番の配列を宣言
        const expectedPair = [aryJoker1[0]]

        for (let i = 1; i < 5; i++) {
            expectedPair.push(aryJoker1[0] + i)
        }
        for (const expected of expectedPair) {
            for (const joker of aryJoker1) {
                if (expected === joker) {
                    count++
                }
            }
        }
        if (count === 4) {
            return true
        }
    }
    //===========================================================
    //13と1をまたいでも連番だったらtrue(jorker2)================================
    count = 0
    if (clone[1] === 0) {
        //編集できるよう新しい配列を宣言
        const aryJoker1 = Array.from(ary);
        aryJoker1.splice(0, 1)
        aryJoker1.splice(0, 1)

        for (let i = 0; i < aryJoker1.length; i++) {
            if (aryJoker1[i] <= 4) {
                aryJoker1[i] += 13
            }
        }
        //昇順に並び替え
        ascending(aryJoker1);
        //最値から期待される連番の配列を宣言
        const expectedPair = [aryJoker1[0]]

        for (let i = 1; i < 5; i++) {
            expectedPair.push(aryJoker1[0] + i)
        }
        for (const expected of expectedPair) {
            for (const joker of aryJoker1) {
                if (expected === joker) {
                    count++
                }
            }
        }
        if (count === 3) {
            return true
        }
    }
    //===========================================================
    //13と1をまたいでも連番だったらtrue
    pastNum = clone[0]
    count = 0
    if (!(clone[0] === 1 && clone[4] === 13)) {
        count = 100
    }
    let first = 2;
    let last = 12;
    clone.splice(0, 1)
    clone.splice(clone.length - 1, 1)

    for (let i = 1; i < 4; i++) {
        if (first === clone[0]) {
            clone.splice(0, 1)
            first++;
            count++;
        } else if (last === clone[clone.length - 1]) {
            clone.splice(clone.length - 1, 1);
            last -= 1;
            count++;

        } else {
            count = 100
        }
    }
    if (count === 3) {
        return true
    }
    //===========================================================
    return false
}

function gameStart1() {
    //山札初期化
    Initialization();
    //5枚を手札に追加
    distribute();
}
function gameStart2() {
    //任意のカードを入れ替える。
    swapCards()
    //役を判定
    console.log(judgeCards(myCards))
}

//山札にあるトランプの情報
let allTrump = [];
//トランプのマークの情報
const trumpMark = ["diamond", "heart", "spade", "clover"]
//自分の手札の情報
let myCards = []
let initializationBoo = false


// Initialization();
// distribute();

// console.log(JSON.parse(JSON.stringify(allTrump)))
// console.log(JSON.parse(JSON.stringify(myCards)))

// swapCards();
// console.log(JSON.parse(JSON.stringify(allTrump)))
// console.log(JSON.parse(JSON.stringify(myCards)))

// console.log(judgeCards(myCards))

// test(judgeCards(myCards),`Royal Straight Flush!!`)

// test(judgeSequentialNumber([1, 2, 3, 4, 5]), true)
// test(judgeSequentialNumber([5, 6, 7, 8, 9]), true)
// test(judgeSequentialNumber([9, 10, 11, 12, 13]), true)
// test(judgeSequentialNumber([1, 2, 2, 2, 5]), false)
// test(judgeSequentialNumber([1, 2, 12, 13, 13]), false)
// test(judgeSequentialNumber([1, 1, 1, 1, 1]), false)
// test(judgeSequentialNumber([1, 10, 11, 12, 13]), true)
// test(judgeSequentialNumber([1, 2, 3, 4, 13]), true)
// test(judgeSequentialNumber([1, 2, 11, 12, 13]), true)

let testCars = [
    {
        mark: "spade",
        number: 12
    },
    {
        mark: "joker",
        number: 0
    },
    {
        mark: "spade",
        number: 10
    },
    {
        mark: "spade",
        number: 8
    },
    {
        mark: "spade",
        number: 9
    }
]
// test(judgeCards(testCars), "Straight Flush!!");

testCars = [
    {
        mark: "spade",
        number: 1
    },
    {
        mark: "spade",
        number: 3
    },
    {
        mark: "spade",
        number: 9
    },
    {
        mark: "joker",
        number: 0
    },
    {
        mark: "joker",
        number: 0
    }
]
// test(judgeCards(testCars), "Flush!!");
testCars = [
    {
        mark: "clorver",
        number: 12
    },
    {
        mark: "joker",
        number: 0
    },
    {
        mark: "spade",
        number: 3
    },
    {
        mark: "spade",
        number: 2
    },
    {
        mark: "spade",
        number: 1
    }
]
// test(judgeCards(testCars), "Straight!!");

testCars = [
    {
        mark: "spade",
        number: 10
    },
    {
        mark: "spade",
        number: 11
    },
    {
        mark: "spade",
        number: 12
    },
    {
        mark: "spade",
        number: 13
    },
    {
        mark: "joker",
        number: 0
    }
]
// test(judgeCards(testCars), "Royal Straight Flush!!");

testCars = [
    {
        mark: "daiamond",
        number: 1
    },
    {
        mark: "spade",
        number: 1
    },
    {
        mark: "joker",
        number: 0
    },
    {
        mark: "joker",
        number: 0
    },
    {
        mark: "spade",
        number: 13
    }
]
// test(judgeCards(testCars), "Four Cards!!");

testCars = [
    {
        mark: "daiamond",
        number: 2
    },
    {
        mark: "spade",
        number: 1
    },
    {
        mark: "joker",
        number: 0
    },
    {
        mark: "joker",
        number: 0
    },
    {
        mark: "spade",
        number: 7
    }
]
// test(judgeCards(testCars), "Three Cards!!");

testCars = [
    {
        mark: "daiamond",
        number: 2
    },
    {
        mark: "spade",
        number: 1
    },
    {
        mark: "joker",
        number: 0
    },
    {
        mark: "joker",
        number: 0
    },
    {
        mark: "spade",
        number: 2
    }
]
// test(judgeCards(testCars), "full house!!");

testCars = [
    {
        mark: "daiamond",
        number: 2
    },
    {
        mark: "spade",
        number: 1
    },
    {
        mark: "spade",
        number: 7
    },
    {
        mark: "joker",
        number: 0
    },
    {
        mark: "joker",
        number: 0
    }
]
// test(judgeCards(testCars), "Two Pairs!!");

testCars = [
    {
        mark: "daiamond",
        number: 2
    },
    {
        mark: "spade",
        number: 1
    },
    {
        mark: "spade",
        number: 5
    },
    {
        mark: "joker",
        number: 0
    },
    {
        mark: "joker",
        number: 0
    }
]
// test(judgeCards(testCars), "One Pairs!!");

testCars = [
    {
        mark: "daiamond",
        number: 10
    },
    {
        mark: "daiamond",
        number: 7
    },
    {
        mark: "spade",
        number: 8
    },
    {
        mark: "spade",
        number: 1
    },
    {
        mark: "spade",
        number: 11
    }
]
// test(judgeCards(testCars), "nopear...");

// gameStart1();
// gameStart2();
// console.log(myCards[0]);
// console.log(myCards[1]);
// console.log(myCards[2]);
// console.log(myCards[3]);
// console.log(myCards[4]);

//=========================================================================
//=========================================================================
//=================================================================
//=================================================================================

/** 押されたらChangeを表示する
 * @param {object}doc //cardのid
 * @returns {boolean}true or false
 *
 */

// function pushChange(changeDoc){
//     const cardnum = changeDoc.id.slice(-1)
//     const cardBoo = document.getElementById(`card-boo${cardnum}`)
//     return cardBoo.addEventListener('click', function (e) {
//         console.log(12345)
//         // const cardnum = this.id.slice(-1)
//         // console.log(`card-boo${cardnum}`)
//         // const cardBoo = document.getElementById(`card-boo${cardnum}`)
//         if(cardBoo.innerText === ""){
//             cardBoo.innerText = "Change!!"
//             changeIndex.push(Number(cardnum))
//         }else{
//             cardBoo.innerText = ""
//             for(let i = 0;i<changeIndex.length;i++){
//                 if(changeIndex[i] === Number(cardnum)){
//                     changeIndex.splice(i,1);
//                 }
//             }
//             }
//         }
//     )
// }

// pushChange(card0);
// pushChange(card1);
// pushChange(card2);
// pushChange(card3);
// pushChange(card4);


const title = document.getElementById("title")
const startBtn = document.getElementById("start-btn");
const cards = document.getElementById("cards");
const card = document.getElementsByClassName("card");
const cardsBoo = document.getElementById("cards-boo");
const card0 = document.getElementById("card0");
const card1 = document.getElementById("card1");
const card2 = document.getElementById("card2");
const card3 = document.getElementById("card3");
const card4 = document.getElementById("card4");
const cardBoo0 = document.getElementById("card-boo0");
const cardBoo1 = document.getElementById("card-boo1");
const cardBoo2 = document.getElementById("card-boo2");
const cardBoo3 = document.getElementById("card-boo3");
const cardBoo4 = document.getElementById("card-boo4");
const cardAll = document.querySelectorAll(".card")
const cardsInfo = document.getElementById("cards-info");
const cardCangeBtn = document.getElementById("card-change-btn");
const head = document.getElementById("head");
let changeIndex = [];


//カード更新
function cardUpdate() {
    card0.src = `img/${myCards[0].mark}${myCards[0].number}.png`;
    card1.src = `img/${myCards[1].mark}${myCards[1].number}.png`;
    card2.src = `img/${myCards[2].mark}${myCards[2].number}.png`;
    card3.src = `img/${myCards[3].mark}${myCards[3].number}.png`;
    card4.src = `img/${myCards[4].mark}${myCards[4].number}.png`;
}

//changeを消す
function changeDelete(){
    cardBoo0.innerText = "";
    cardBoo1.innerText = "";
    cardBoo2.innerText = "";
    cardBoo3.innerText = "";
    cardBoo4.innerText = "";
}



startBtn.addEventListener("click", () => {
    //配列を初期化
    changeIndex = [];
    //スタートボタンを消す
    startBtn.style.display = "none"
    title.style.display = "none"
    //mycardsをhtmlに追加
    gameStart1();

    //初めのカード5枚を表示
    cardUpdate();
    //カードを表示
    cardsInfo.style.display = "block";
}
)


//チェンジを表示する処理============================================
card0.addEventListener('click', function (e) {
    if( cardCangeBtn.innerText !== "再プレイ"){

        if (cardBoo0.innerText === "" ) {
            cardBoo0.innerText = "Change!!"
            changeIndex.push(0)
        } else {
            cardBoo0.innerText = ""
            for (let i = 0; i < changeIndex.length; i++) {
                if (changeIndex[i] === 0) {
                    changeIndex.splice(i, 1);
                }
            }
        }
        if (changeIndex.length === 0) {
            cardCangeBtn.innerText = "交換しない"
        } else {
            cardCangeBtn.innerText = "交換する"
        }
    }
}
)

card1.addEventListener('click', function (e) {
    if( cardCangeBtn.innerText !== "再プレイ"){

        if (cardBoo1.innerText === "" ) {
            cardBoo1.innerText = "Change!!"
            changeIndex.push(1)
        } else {
            cardBoo1.innerText = ""
            for (let i = 0; i < changeIndex.length; i++) {
                if (changeIndex[i] === 1) {
                    changeIndex.splice(i, 1);
                }
            }
        }
        if (changeIndex.length === 0) {
            cardCangeBtn.innerText = "交換しない"
        } else {
            cardCangeBtn.innerText = "交換する"
        }
    }
}
)

card2.addEventListener('click', function (e) {
    if( cardCangeBtn.innerText !== "再プレイ"){

        if (cardBoo2.innerText === "" ) {
            cardBoo2.innerText = "Change!!"
            changeIndex.push(2)
        } else {
            cardBoo2.innerText = ""
            for (let i = 0; i < changeIndex.length; i++) {
                if (changeIndex[i] === 2) {
                    changeIndex.splice(i, 1);
                }
            }
        }
        if (changeIndex.length === 0) {
            cardCangeBtn.innerText = "交換しない"
        } else {
            cardCangeBtn.innerText = "交換する"
        }
    }
}
)

card3.addEventListener('click', function (e) {
    if( cardCangeBtn.innerText !== "再プレイ"){

        if (cardBoo3.innerText === "" ) {
            cardBoo3.innerText = "Change!!"
            changeIndex.push(3)
        } else {
            cardBoo3.innerText = ""
            for (let i = 0; i < changeIndex.length; i++) {
                if (changeIndex[i] === 3) {
                    changeIndex.splice(i, 1);
                }
            }
        }
        if (changeIndex.length === 0) {
            cardCangeBtn.innerText = "交換しない"
        } else {
            cardCangeBtn.innerText = "交換する"
        }
    }
}
)

card4.addEventListener('click', function (e) {
    if( cardCangeBtn.innerText !== "再プレイ"){

        if (cardBoo4.innerText === "" ) {
            cardBoo4.innerText = "Change!!"
            changeIndex.push(4)
        } else {
            cardBoo4.innerText = ""
            for (let i = 0; i < changeIndex.length; i++) {
                if (changeIndex[i] === 4) {
                    changeIndex.splice(i, 1);
                }
            }
        }
        if (changeIndex.length === 0) {
            cardCangeBtn.innerText = "交換しない"
        } else {
            cardCangeBtn.innerText = "交換する"
        }
        
    }
}
)

//=================================================================

cardCangeBtn.addEventListener('click', () => {
    if (cardCangeBtn.innerText === "交換する") {

        swapCards(changeIndex);
        cardUpdate();
        //結果を表示
        head.innerText = judgeCards(myCards)
        //チェンジを消す
        changeDelete();
        cardCangeBtn.innerText = "再プレイ"
    } else if (cardCangeBtn.innerText === "交換しない") {
        //結果を表示
        head.innerText = judgeCards(myCards)
        //チェンジを消す
        changeDelete();
        cardCangeBtn.innerText = "再プレイ"
    } else if (cardCangeBtn.innerText === "再プレイ") {
        changeIndex = [];
        //mycardsをhtmlに追加
        gameStart1();
        //初めのカード5枚を表示
        cardUpdate();
        
        cardCangeBtn.innerText = "交換しない"
        //結果を削除
        head.innerText = ""

    }


})













