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

const minBetBtn = document.querySelector('.min-bet-btn')
const card1Btn = document.querySelector('.card1-hold')
const card2Btn = document.querySelector('.card2-hold')
const card3Btn = document.querySelector('.card3-hold')
const card4Btn = document.querySelector('.card4-hold')
const card5Btn = document.querySelector('.card5-hold')
const maxBetBtn = document.querySelector('.max-bet-btn')
const dealBtn = document.querySelector('.deal-btn')

dealBtn.addEventListener('click', dealCards)

let indexOfDeck = 0
function dealCard(deck, container) {
  container.innerHTML = '';
  let cardsHtml = '';
  cardsHtml += `<div class="card ${deck[indexOfDeck].face}"></div>`;
  
  container.innerHTML = cardsHtml;
  indexOfDeck++
}

function dealCards() {
  for (let card of communityCards) {
    if (!card.classList.contains('hold')) {
      dealCard(shuffledDeck, card)
    }
  }
}
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

function handleCard1() {
  if (card1.classList.contains('hold')) {
    card1.classList.remove('hold')
    holdWindow[0].style.color = 'white'
  } else {
    card1.classList.add('hold')
    holdWindow[0].style.color = 'black'

  }
}

function handleCard2() {
  if (card2.classList.contains('hold')) {
    card2.classList.remove('hold')
    holdWindow[1].style.color = 'white'
  } else {
    card2.classList.add('hold')
    holdWindow[1].style.color = 'black'
  }
}

function handleCard3() {
  if (card3.classList.contains('hold')) {
    card3.classList.remove('hold')
    holdWindow[2].style.color = 'white'
  } else {
    card3.classList.add('hold')
    holdWindow[2].style.color = 'black'
  }
}

function handleCard4() {
  if (card4.classList.contains('hold')) {
    card4.classList.remove('hold')
    holdWindow[3].style.color = 'white'
  } else {
    card4.classList.add('hold')
    holdWindow[3].style.color = 'black'
  }
}

function handleCard5() {
  if (card5.classList.contains('hold')) {
    card5.classList.remove('hold')
    holdWindow[4].style.color = 'white'
  } else {
    card5.classList.add('hold')
    holdWindow[4].style.color = 'black'
  }
}


// dealCard(shuffledDeck, card1);
// dealCard(shuffledDeck, card2);
// dealCard(shuffledDeck, card3);
// dealCard(shuffledDeck, card4);
// dealCard(shuffledDeck, card5);

dealCard1(originalDeck, card1);
dealCard2(originalDeck, card2);
dealCard3(originalDeck, card3);
dealCard4(originalDeck, card4);
dealCard5(originalDeck, card5);


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
    return 'royal flush'
  } else if (checkStraightFlush(suits, values)) {
    return 'straight flush'
  } else if (checkFourKind(values)) {
    return 'four of a kind'
  } else if (checkFullHouse(values)) {
    return 'full house'
  } else if (checkFlush(suits)) {
    return 'flush'
  } else if (checkStraight(values)) {
    return 'straight'
  } else if (checkTrips(values)) {
    return 'three of a kind'
  } else if (checkTwoPair(values)) {
    return 'two pair'
  } else if(checkPair(values)) {
    return 'pair'
  }
   else {
    return 'sadge'
  }
}

function checkRoyal(suitArr, valueArr) {
  for (let suit of suitArr) {
    if (suit !== 's') {
      return false
    }
  }
  for (let value of valueArr) {
    if (value === '10' || value === '11' || value === '12' || value === '13' || value === '01') {
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


function dealCard1(deck, container) {
  container.innerHTML = '';
  let cardsHtml = '';
  cardsHtml += `<div class="card ${deck[9].face}"></div>`;

  container.innerHTML = cardsHtml;
}

function dealCard2(deck, container) {
  container.innerHTML = '';
  let cardsHtml = '';
  cardsHtml += `<div class="card ${deck[8].face}"></div>`;

  container.innerHTML = cardsHtml;
}

function dealCard3(deck, container) {
  container.innerHTML = '';
  let cardsHtml = '';
  cardsHtml += `<div class="card ${deck[10].face}"></div>`;

  container.innerHTML = cardsHtml;
}

function dealCard4(deck, container) {
  container.innerHTML = '';
  let cardsHtml = '';
  cardsHtml += `<div class="card ${deck[11].face}"></div>`;

  container.innerHTML = cardsHtml;
}

function dealCard5(deck, container) {
  container.innerHTML = '';
  let cardsHtml = '';
  cardsHtml += `<div class="card ${deck[25].face}"></div>`;

  container.innerHTML = cardsHtml;
}
