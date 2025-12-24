const beatGrid = document.getElementById("beatGrid");
const beatStatus = document.getElementById("beatStatus");
const beatRemaining = document.getElementById("beatRemaining");
const beatRestart = document.getElementById("beatRestart");

if (beatGrid && beatStatus && beatRemaining && beatRestart) {
  const RANKS = [
    { label: "2", value: 2 },
    { label: "3", value: 3 },
    { label: "4", value: 4 },
    { label: "5", value: 5 },
    { label: "6", value: 6 },
    { label: "7", value: 7 },
    { label: "8", value: 8 },
    { label: "9", value: 9 },
    { label: "10", value: 10 },
    { label: "J", value: 11 },
    { label: "Q", value: 12 },
    { label: "K", value: 13 },
    { label: "A", value: 14 },
  ];
  const SUITS = [
    { label: "♠", code: "S", color: "black" },
    { label: "♥", code: "H", color: "red" },
    { label: "♦", code: "D", color: "red" },
    { label: "♣", code: "C", color: "black" },
  ];
  const PIP_LAYOUTS = {
    2: [[1], [1]],
    3: [[1], [1], [1]],
    4: [[1, 1], [1, 1]],
    5: [[1, 1], [1], [1, 1]],
    6: [[1, 1], [1, 1], [1, 1]],
    7: [[1, 1], [1], [1, 1], [1, 1]],
    8: [[1, 1], [1, 1], [1, 1], [1, 1]],
    9: [[1, 1], [1, 1], [1], [1, 1], [1, 1]],
    10: [[1, 1], [1, 1], [1, 1], [1, 1], [1, 1]],
  };
  let deck = [];
  let piles = [];
  let gameOver = false;
  let revealTimeout = null;

  function buildDeck() {
    const cards = [];
    for (const suit of SUITS) {
      for (const rank of RANKS) {
        cards.push({
          rank: rank.label,
          suit,
          value: rank.value,
        });
      }
    }
    return cards;
  }

  function shuffle(cards) {
    for (let i = cards.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [cards[i], cards[j]] = [cards[j], cards[i]];
    }
    return cards;
  }

  function setStatus(message) {
    beatStatus.textContent = message;
  }

  function updateRemaining() {
    beatRemaining.textContent = `Deck: ${deck.length}`;
  }

  function createPileElement(index) {
    const pile = document.createElement("div");
    pile.className = "beat-pile";
    pile.dataset.index = String(index);

    const card = document.createElement("div");
    card.className = "beat-card";
    card.textContent = "--";
    pile.appendChild(card);

    const actions = document.createElement("div");
    actions.className = "beat-actions";

    const higherBtn = document.createElement("button");
    higherBtn.type = "button";
    higherBtn.textContent = "Higher";
    higherBtn.dataset.guess = "higher";

    const lowerBtn = document.createElement("button");
    lowerBtn.type = "button";
    lowerBtn.textContent = "Lower";
    lowerBtn.dataset.guess = "lower";

    actions.appendChild(higherBtn);
    actions.appendChild(lowerBtn);
    pile.appendChild(actions);

    return pile;
  }

  function renderPiles() {
    beatGrid.innerHTML = "";
    piles.forEach((pile, index) => {
      const pileEl = createPileElement(index);
      const cardEl = pileEl.querySelector(".beat-card");
      if (pile.revealingLoss) {
        renderCardFace(cardEl, pile.card);
        renderLossOverlay(cardEl);
      } else if (!pile.active) {
        pileEl.classList.add("inactive");
        cardEl.classList.add("face-down");
        cardEl.classList.remove("red");
        renderFaceDown(cardEl, pile.lastCard);
      } else {
        cardEl.classList.remove("face-down");
        renderCardFace(cardEl, pile.card);
      }
      beatGrid.appendChild(pileEl);
    });
  }

  function renderCardFace(cardEl, card) {
    cardEl.classList.toggle("red", card.suit.color === "red");
    cardEl.innerHTML = "";

    const topLeft = document.createElement("div");
    topLeft.className = "corner top-left";
    topLeft.innerHTML = `<span>${card.rank}</span><span>${card.suit.label}</span>`;

    const bottomRight = document.createElement("div");
    bottomRight.className = "corner bottom-right";
    bottomRight.innerHTML = `<span>${card.rank}</span><span>${card.suit.label}</span>`;

    const pips = document.createElement("div");
    pips.className = "pips";

    if (card.value >= 2 && card.value <= 10) {
      const layout = PIP_LAYOUTS[card.value];
      layout.forEach((row) => {
        const rowEl = document.createElement("div");
        rowEl.className = "pip-row";
        row.forEach(() => {
          const pip = document.createElement("span");
          pip.className = "pip";
          pip.textContent = card.suit.label;
          rowEl.appendChild(pip);
        });
        pips.appendChild(rowEl);
      });
    } else {
      const face = document.createElement("div");
      face.className = "pip-row";
      const faceText = document.createElement("span");
      faceText.className = "pip";
      faceText.style.fontSize = "26px";
      faceText.textContent = `${card.rank}${card.suit.label}`;
      face.appendChild(faceText);
      pips.appendChild(face);
    }

    cardEl.appendChild(topLeft);
    cardEl.appendChild(pips);
    cardEl.appendChild(bottomRight);
  }

  function renderLossOverlay(cardEl) {
    const overlay = document.createElement("div");
    overlay.className = "beat-loss-overlay";
    overlay.textContent = "X";
    cardEl.appendChild(overlay);
  }

  function renderFaceDown(cardEl, card) {
    cardEl.innerHTML = "";
    if (card) {
      const topLeft = document.createElement("div");
      topLeft.className = "corner top-left";
      topLeft.innerHTML = `<span>${card.rank}</span><span>${card.suit.label}</span>`;
      cardEl.appendChild(topLeft);
      cardEl.classList.toggle("red", card.suit.color === "red");
      return;
    }
    cardEl.textContent = "X";
    cardEl.classList.remove("red");
  }

  function dealInitial() {
    deck = shuffle(buildDeck());
    piles = Array.from({ length: 9 }, () => ({
      card: deck.shift(),
      active: true,
      lastCard: null,
      revealingLoss: false,
    }));
    gameOver = false;
    setStatus("Hover a pile and choose higher or lower.");
    updateRemaining();
    renderPiles();
  }

  function checkEndState() {
    const activeCount = piles.filter((pile) => pile.active).length;
    if (activeCount === 0) {
      gameOver = true;
      setStatus("All piles are down. You lose.");
      showModal({
        title: "You lost",
        message: "All piles are down. Try again?",
      });
      return;
    }
    if (deck.length === 0) {
      gameOver = true;
      setStatus("Congratulations, you beat the deck!");
      showModal({
        title: "You won",
        message: "You made it through the deck. Nice job!",
      });
    }
  }

  function drawNextCard() {
    return deck.shift();
  }

  function handleGuess(index, guess) {
    if (gameOver) return;
    const pile = piles[index];
    if (!pile || !pile.active) return;
    if (revealTimeout) return;
    const nextCard = drawNextCard();
    if (!nextCard) {
      checkEndState();
      return;
    }
    const currentValue = pile.card.value;
    const nextValue = nextCard.value;
    let correct = false;
    if (guess === "higher") {
      correct = nextValue > currentValue;
    } else if (guess === "lower") {
      correct = nextValue < currentValue;
    }

    if (correct) {
      pile.card = nextCard;
      setStatus("Correct! Keep going.");
      updateRemaining();
      renderPiles();
      checkEndState();
      return;
    } else {
      setStatus("Wrong! That pile is going down.");
      pile.card = nextCard;
      pile.revealingLoss = true;
      updateRemaining();
      renderPiles();
      revealTimeout = window.setTimeout(() => {
        pile.active = false;
        pile.lastCard = nextCard;
        pile.revealingLoss = false;
        renderPiles();
        checkEndState();
        revealTimeout = null;
      }, 1500);
      return;
    }
  }

  beatGrid.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const guess = target.dataset.guess;
    if (!guess) return;
    const pileEl = target.closest(".beat-pile");
    if (!pileEl) return;
    const index = Number(pileEl.dataset.index);
    if (Number.isNaN(index)) return;
    handleGuess(index, guess);
  });

  beatRestart.addEventListener("click", () => {
    if (revealTimeout) {
      window.clearTimeout(revealTimeout);
      revealTimeout = null;
    }
    dealInitial();
  });

  dealInitial();
}
