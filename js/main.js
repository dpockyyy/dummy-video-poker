/*----- constants -----*/
const suits = ['s', 'c', 'd', 'h'];
const ranks = ['02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14'];

// Build an 'original' deck of 'card' objects used to create shuffled decks
const originalDeck = buildOriginalDeck();
renderDeckInContainer(originalDeck, document.getElementById('original-deck-container'));


/*----- app's state (variables) -----*/
let shuffledDeck;

/*----- cached element references -----*/
const shuffledContainer = document.getElementById('shuffled-deck-container');

/*----- event listeners -----*/
document.querySelector('button').addEventListener('click', renderNewShuffledDeck);

/*----- functions -----*/
function getNewShuffledDeck() {
  // Create a copy of the originalDeck (leave originalDeck untouched!)
  const tempDeck = [...originalDeck];
  const newShuffledDeck = [];
  while (tempDeck.length) {
    // Get a random index for a card still in the tempDeck
    const rndIdx = Math.floor(Math.random() * tempDeck.length);
    // Note the [0] after splice - this is because splice always returns an array and we just want the card object in that array
    newShuffledDeck.push(tempDeck.splice(rndIdx, 1)[0]);
  }
  return newShuffledDeck;
}

function renderNewShuffledDeck() {
  // Create a copy of the originalDeck (leave originalDeck untouched!)
  shuffledDeck = getNewShuffledDeck();
  renderDeckInContainer(shuffledDeck, shuffledContainer);
}

function renderDeckInContainer(deck, container) {
  container.innerHTML = '';
  // Let's build the cards as a string of HTML
  let cardsHtml = '';
  deck.forEach(function(card) {
    cardsHtml += `<div class="card ${card.face}"></div>`;
  });
  // Or, use reduce to 'reduce' the array into a single thing - in this case a string of HTML markup 
  // const cardsHtml = deck.reduce(function(html, card) {
  //   return html + `<div class="card ${card.face}"></div>`;
  // }, '');
  container.innerHTML = cardsHtml;
}

function buildOriginalDeck() {
  const deck = [];
  // Use nested forEach to generate card objects
  suits.forEach(function(suit) {
    ranks.forEach(function(rank) {
      deck.push({
        // The 'face' property maps to the library's CSS classes for cards
        face: `${suit}${rank}`,
        // Setting the 'value' property for game of blackjack, not war
        value: Number(rank) || (rank === 'A' ? 11 : 10)
      });
    });
  });
  return deck;
}

renderNewShuffledDeck();

const card1 = document.getElementById('card-1')
const card2 = document.getElementById('card-2')
const card3 = document.getElementById('card-3')
const card4 = document.getElementById('card-4')
const card5 = document.getElementById('card-5')
const communityCards = document.querySelectorAll('.community-cards')
const holdWindow = document.querySelectorAll('.hold-window')

const resultsMessage = document.querySelector('.results-message')
const betAmountDisplay = document.querySelector('.bet-amount')
const creditBalanceDisplay = document.querySelector('.credits-balance')
const payOutDisplay = document.querySelector('.pay-out-display')
const gameOverMessage = document.querySelector('.game-over-message')
const playAgainBtn = document.querySelector('.play-again')

const minBetBtn = document.querySelector('.min-bet-btn')
const card1Btn = document.querySelector('.card1-hold')
const card2Btn = document.querySelector('.card2-hold')
const card3Btn = document.querySelector('.card3-hold')
const card4Btn = document.querySelector('.card4-hold')
const card5Btn = document.querySelector('.card5-hold')
const maxBetBtn = document.querySelector('.max-bet-btn')
const dealBtn = document.querySelector('.deal-btn')
const holdBtns = document.querySelectorAll('.hold-btn')

const payOutPanels = document.querySelectorAll('.pay-out-list')

dealBtn.addEventListener('click', dealCards)
playAgainBtn.addEventListener('click', handlePlayAgain)

let indexOfDeck = 0
let creditBalance = 100
let betAmount = 0
let boardDealt = false
let gameOverStatus = false

function dealCard(deck, container) {
  container.innerHTML = '';
  let cardsHtml = '';
  cardsHtml += `<div class="card ${deck[indexOfDeck].face}"></div>`;
  container.innerHTML = cardsHtml;
  indexOfDeck++
}

function dealFacedownCard(container) {
  container.innerHTML = '';
  let cardsHtml = '';
  cardsHtml += `<div class="card back-red"></div>`;
  container.innerHTML = cardsHtml;
}

function dealCards() {
  resultsMessage.textContent = ' '
  payOutDisplay.textContent = ' '
  gameOverMessage.style.display = 'none'
  boardDealtAudio()
  if (boardDealt === true) {
    dealFaceDownWithHold()
    resetGame()
    for (let btn of holdBtns) {
      btn.disabled = true
    }
    for (let i = 0; i < 8; i++) {
      delayDeal2(i, indexOfDeck)
    }
  } else {
    removeHoldText()
    for (let btn of holdBtns) {
      btn.disabled = false
    }
    minBetBtn.disabled = true
    maxBetBtn.disabled = true
    if (betAmount === 0 || betAmount === 5) {
      betAmount = 5
      betAmountDisplay.textContent = betAmount
      creditBalance -= betAmount
      creditBalanceDisplay.textContent = creditBalance
      maxBetBtn.disabled = true
      minBetBtn.disabled = true
      for (let i = 0; i < 5; i++) {
        delayPanel(i)
      }
    }
    else if (betAmount < 5) {
      if (gameOverStatus === true) {
        creditBalance -= betAmount
        creditBalanceDisplay.textContent = creditBalance
      }
    }
    dealFaceDown()
    for (let i = 0; i < 6; i++) {
      delayDeal(i)
    }
    clearHandRank()
    boardDealt = true
  }

}

function delayDeal(i) {
  if (i === 5) {
    setTimeout(function() {previewHand()}, 90*i)
  } else if (i < 5) {
    setTimeout(function() {dealCard(shuffledDeck, communityCards[i])}, 90*i)
  }
}

function delayDeal2(i) {
  if (i === 5) {
    setTimeout(function() {checkResult()}, 70*i)
  } else if (i === 6) {
    setTimeout(function() {removeHoldClass()}, 70*i)
  } else if (i === 7) {
    setTimeout(function() {
      renderNewShuffledDeck()
      indexOfDeck = 0
    }, 90*i)
  } else if (i < 5) {
    if (!communityCards[i].classList.contains('hold')) {
      setTimeout(function() {dealCard(shuffledDeck, communityCards[i])}, 70*i)
    }
  }
}

function removeHoldClass() {
  for (let card of communityCards) {
    card.classList.remove('hold')
  }
}

function removeHoldText() {
  for (let window of holdWindow) {
    window.style.color = 'blue'
  }
}

function dealFaceDown() {
  for (let card of communityCards) {
    dealFacedownCard(card)
  }
}

function dealFaceDownWithHold() {
  for (let card of communityCards) {
    if (!card.classList.contains('hold')) {
      dealFacedownCard(card)
    }
  }
}

function setUpGame() {
  dealFaceDown()
  for (let btn of holdBtns) {
    btn.disabled = true
  }
  betAmount = 0
  betAmountDisplay.textContent = betAmount
}

setUpGame()

card1.addEventListener('click', handleCard1)
card2.addEventListener('click', handleCard2)
card3.addEventListener('click', handleCard3)
card4.addEventListener('click', handleCard4)
card5.addEventListener('click', handleCard5)

card1Btn.addEventListener('click', handleCard1)
card2Btn.addEventListener('click', handleCard2)
card3Btn.addEventListener('click', handleCard3)
card4Btn.addEventListener('click', handleCard4)
card5Btn.addEventListener('click', handleCard5)

minBetBtn.addEventListener('click', handleMinBet)
maxBetBtn.addEventListener('click', handleMaxBet)

function handleCard1() {
  if (boardDealt === false) {
    handleMaxBet()
  } else if (card1.classList.contains('hold')) {
    card1.classList.remove('hold')
    holdWindow[0].style.color = 'blue'
    cardDefaultAudio()
  } else {
    card1.classList.add('hold')
    holdWindow[0].style.color = 'white'
    cardDefaultAudio()
  }
}
function handleCard2() {
  cardDefaultAudio()
  if (boardDealt === false) {
    handleMaxBet()
  } else if (card2.classList.contains('hold')) {
    card2.classList.remove('hold')
    holdWindow[1].style.color = 'blue'
  } else {
    card2.classList.add('hold')
    holdWindow[1].style.color = 'white'
  }
}
function handleCard3() {
  if (boardDealt === false) {
    handleMaxBet()
  } else if (card3.classList.contains('hold')) {
    card3.classList.remove('hold')
    holdWindow[2].style.color = 'blue'
    cardDefaultAudio()
  } else {
    card3.classList.add('hold')
    holdWindow[2].style.color = 'white'
    cardDefaultAudio()
  }
}
function handleCard4() {
  if (boardDealt === false) {
    handleMaxBet()
  } else if (card4.classList.contains('hold')) {
    card4.classList.remove('hold')
    holdWindow[3].style.color = 'blue'
    cardDefaultAudio()
  } else {
    card4.classList.add('hold')
    holdWindow[3].style.color = 'white'
    cardDefaultAudio()
  }
}
function handleCard5() {
  if (boardDealt === false) {
    handleMaxBet()
  } else if (card5.classList.contains('hold')) {
    card5.classList.remove('hold')
    holdWindow[4].style.color = 'blue'
    cardDefaultAudio()
  } else {
    card5.classList.add('hold')
    holdWindow[4].style.color = 'white'
    cardDefaultAudio()
  }
}

function previewHand() {
  let previewResult = rankHand()
  resultsMessage.textContent = previewResult.msg
}

function handleMinBet() {
  incrementBetAudio()
  clearHandRank()
  if (gameOverStatus === true) {
    dealFaceDown()
    gameOverMessage.style.display = 'none'
    gameOverStatus = false
    betAmount = 0
  }
  betAmount++
  selectPanel()
  betAmountDisplay.textContent = betAmount
  creditBalance--
  creditBalanceDisplay.textContent = creditBalance
  if (betAmount === 5) {
    minBetBtn.disabled = true
    maxBetBtn.disabled = true
  }
}

function handleMaxBet() {
  if (betAmount !== 5) {
    if (gameOverStatus === true) {
      betAmount = 5
    } else {
      creditBalance += betAmount
      betAmount = 5
    }
  }
  dealCards()
  maxBetBtn.disabled = true
  minBetBtn.disabled = true
}

function checkResult() {
  let result = rankHand()
  if (result.multi != 0) {
    payOutDisplay.textContent = `WIN 2 x ${betAmount*result.multi}`
    creditBalance += betAmount * result.multi * 2
    creditBalanceDisplay.textContent = creditBalance
    resultsMessage.textContent = result.msg
    if (result.multi >= 6) {
      winAudio3()
    } else if (result.multi >= 3) {
      winAudio2()
    } else {
      winAudio()
    }
    showWinningHand(result)
  }
  gameOver()
}

function resetGame() {
  if (creditBalance < 5) {
    maxBetBtn.disabled = true
  } else {
    maxBetBtn.disabled = false
  }
  minBetBtn.disabled = false
  boardDealt = false
  if (creditBalance <= 0) {
    playAgainBtn.style.display = 'block'
  }
}

function gameOver() {
  gameOverMessage.style.display = 'block'
  gameOverStatus = true
}

function createValueArr() {
  let arrV = []
  let v1 = card1.querySelector('div').className.slice(5).slice(1)
  let v2 = card2.querySelector('div').className.slice(5).slice(1)
  let v3 = card3.querySelector('div').className.slice(5).slice(1)
  let v4 = card4.querySelector('div').className.slice(5).slice(1)
  let v5 = card5.querySelector('div').className.slice(5).slice(1)
  
  arrV.push(v1)
  arrV.push(v2)
  arrV.push(v3)
  arrV.push(v4)
  arrV.push(v5)

  return arrV
}

function createSuitArr() {
  let arrS = []
  let s1 = card1.querySelector('div').className.slice(5).slice(0,1)
  let s2 = card2.querySelector('div').className.slice(5).slice(0,1)
  let s3 = card3.querySelector('div').className.slice(5).slice(0,1)
  let s4 = card4.querySelector('div').className.slice(5).slice(0,1)
  let s5 = card5.querySelector('div').className.slice(5).slice(0,1)
  
  arrS.push(s1)
  arrS.push(s2)
  arrS.push(s3)
  arrS.push(s4)
  arrS.push(s5)

  return arrS
}

function rankHand() {
  let suits = createSuitArr()
  let values = createValueArr()
  if (checkRoyal(suits, values)) {
    let result = {msg: "ROYAL FLUSH", multi: 250, index: 0}
    return result
  } else if (checkStraightFlush(suits, values)) {
    let result = {msg: "STRAIGHT FLUSH", multi: 50, index: 1}
    return result
  } else if (checkFourKind(values)) {
    let result = {msg: "FOUR OF A KIND", multi: 25, index: 2}
    return result
  } else if (checkFullHouse(values)) {
    let result = {msg: "FULL HOUSE", multi: 9, index: 3}
    return result
  } else if (checkFlush(suits)) {
    let result = {msg: "FLUSH", multi: 6, index: 4}
    return result
  } else if (checkStraight(values)) {
    let result = {msg: "STRAIGHT", multi: 4, index: 5}
    return result
  } else if (checkTrips(values)) {
    let result = {msg: "THREE OF A KIND", multi: 3, index: 6}
    return result
  } else if (checkTwoPair(values)) {
    let result = {msg: "TWO PAIR", multi: 2, index: 7}
    return result
  } else if(checkPair(values)) {
    let result = {msg: "JACKS OR BETTER", multi: 1, index: 8}
    return result
  }
   else {
    let result = {msg: '', multi: 0}
    return result
  }
}

function checkRoyal(suitArr, valueArr) {
  for (let suit of suitArr) {
    if (suit !== 's') {
      return false
    }
  }
  for (let value of valueArr) {
    if (value === '10' || value === '11' || value === '12' || value === '13' || value === '14') {
      continue
    }
    else {
      return false
    }
  }
  return true
}

function checkStraightFlush(suitArr, valueArr) {
  if (checkFlush(suitArr) && checkStraight(valueArr)) {
    return true
  }
  return false
}

function checkFourKind(valueArr) {
  if (checkCount(valueArr)[0] === 4) {
    return true
  }
  return false
}

function checkFullHouse(valueArr) {
  let checkArr = checkCount(valueArr)
  if (checkArr[0] === 3 && checkArr[1] === 2) {
    return true
  }
  return false
}

function checkFlush(suitArr) {
  let firstSuit = suitArr[0]
  for (let suit of suitArr) {
    if (suit !== firstSuit) {
      return false
    }
  }
  return true
}

function checkStraight (valueArr) {
  let arrSorted = valueArr.sort()

  if (arrSorted[0] === '02' && arrSorted[1] === '03' && arrSorted[2] === '04' && arrSorted[3] === '05' && arrSorted[4] === '14') {
    return true
  } else if ((arrSorted[4] - arrSorted[0] === 4) && checkDupes(valueArr) === false) {
    return true
  }
  return false
}

function checkTrips(valueArr) {
  let checkArr = checkCount(valueArr)
  if (checkArr[0] === 3) {
    return true
  }
  return false
}

function checkTwoPair(valueArr) {
  let checkArr = checkCount(valueArr)
  if (checkArr[0] === 2 && checkArr[1] === 2) {
    return true
  }
  return false
}

function checkPair(valueArr) {
  let jacksPlusArr = []
  let index = 0;
  for (let card of valueArr) {
    if (card >= 11) {
      jacksPlusArr[index] = card
      index++
    }
  }
  let checkArr = checkCount(jacksPlusArr)
  sortedArr = valueArr.sort().reverse()
  if (checkArr[0] === 2) {
    return true
  }
  return false

}

function checkCount(valueArr) {
  let sortedArr = valueArr.sort()
  let count = 0
  let index = 0
  let countArr = []
  let streakCount = sortedArr[0]

  for (let i = 0; i < sortedArr.length; i++) {
    if (sortedArr[i] === streakCount) {
      count++
      if (i === sortedArr.length - 1) {
        countArr[index] = count
      }
    }
    else {
      streakCount = sortedArr[i]
      countArr[index] = count
      count = 1
      index++
      if (i === sortedArr.length - 1) {
        countArr[index] = 1
      }
    }
  }
  countArr = countArr.sort().reverse()
  return countArr
}

function checkDupes(valueArr) {
  let arr = checkCount(valueArr)
  for (let a of arr) {
    if (a !== 1) {
      return true
    }
  }
  return false
}

function handlePlayAgain() {
  playAgainBtn.style.display = 'none'
  creditBalance = 100
  creditBalanceDisplay.textContent = creditBalance
  setUpGame()
  resetGame()
  clearPanels()
  gameOverStatus = false
  gameOverMessage.style.display = 'none'
}

const incrementBetSound = new Audio('sounds/incrementBetSound.mp3')
const cardDefaultSound = new Audio('sounds/cardDealtSound2.mp3')
const boardDealtSound = new Audio('sounds/boardDealtSound.mp3')
const winSound = new Audio('sounds/winSound.mp3')
const winSound2 = new Audio('sounds/winSound2.mp3')
const winSound3 = new Audio('sounds/winSound3.mp3')

function incrementBetAudio() {
  incrementBetSound.play()
}

function cardDefaultAudio() {
  cardDefaultSound.play()
}

function boardDealtAudio() {
  boardDealtSound.play()
}

function winAudio() {
  winSound.play()
}

function winAudio2() {
  winSound2.play()
}

function winAudio3() {
  winSound3.play()
}

function selectPanel() {
  clearPanels()
  payOutPanels[betAmount-1].style.backgroundColor = 'rgba(216,18,45,255)'
}

function selectPanelInput(panelNumber) {
  clearPanels()
  payOutPanels[panelNumber].style.backgroundColor = 'rgba(216,18,45,255)'
}

function clearPanels() {
  for (let panel of payOutPanels) {
    panel.style.backgroundColor = 'rgba(50,50,50,255)'
  }
}

function delayPanel(i) {
  setTimeout(function() {selectPanelInput(i)}, 100*i)
}

const handRanks = document.querySelectorAll('li')

function showWinningHand(resultObj) {
  clearHandRank()
  let result = resultObj
  handRanks[result.index].style.color = 'white'
  handRanks[result.index + 9 * betAmount].style.color = 'white'
}

function clearHandRank() {
  for (let hand of handRanks) {
    hand.style.color = 'rgba(250,255,16,255)'
  }
}