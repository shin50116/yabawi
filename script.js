let currentLevel = 1;
let maxLevelReached = 1;
let baseSpeed = 665; // 700ms의 5% 느린 속도
let ballPosition = 0;
let isShuffling = false;

const startButton = document.getElementById("start-game");
const cupsContainer = document.getElementById("cups-container");
const gameTitle = document.getElementById("game-title");
const statusText = document.getElementById("status-text");

startButton.addEventListener("click", () => {
  gameTitle.classList.add("hidden");
  startButton.classList.add("hidden");
  statusText.textContent = `Level ${currentLevel}: 섞는 중입니다...`;
  statusText.classList.remove("hidden");
  startGame(currentLevel);
});

function startGame(level) {
  statusText.textContent = `Level ${level}: 섞는 중입니다...`;
  const cupCount = getCupCount(level);
  const shuffleSpeed = getShuffleSpeed(level);

  generateCups(cupCount);
  ballPosition = Math.floor(Math.random() * cupCount);
  showBall(ballPosition);

  setTimeout(() => {
    hideBall();
    startShuffling(cupCount, shuffleSpeed, level);
  }, 2000);
}

function getCupCount(level) {
  if (level <= 3) return 3;
  if (level <= 5) return 4;
  return 5;
}

function getShuffleSpeed(level) {
  return baseSpeed * 0.9 ** (level - 1);
}

function generateCups(count) {
  cupsContainer.innerHTML = "";
  const offset = -((count - 1) * 60);
  for (let i = 0; i < count; i++) {
    const cup = document.createElement("div");
    cup.classList.add("cup");
    cup.dataset.index = i;

    cup.style.transform = `translateX(${offset + i * 120}px) translateY(0)`;

    const ball = document.createElement("div");
    ball.classList.add("ball");
    cup.appendChild(ball);

    cup.addEventListener("click", () => checkCup(i));
    cupsContainer.appendChild(cup);
  }
}

function showBall(position) {
  const cups = document.querySelectorAll(".cup");
  cups[position].querySelector(".ball").style.display = "block";
}

function hideBall() {
  const balls = document.querySelectorAll(".ball");
  balls.forEach(ball => (ball.style.display = "none"));
}

function startShuffling(count, speed, level) {
  isShuffling = true;
  
  let minShuffleTime = 5000;
  let maxShuffleTime = 10000;
  let shuffleDuration = minShuffleTime + (Math.random() * (maxShuffleTime - minShuffleTime) * (level / 20));

  const shuffleInterval = setInterval(() => {
    shuffleCups(count);
  }, speed);

  setTimeout(() => {
    clearInterval(shuffleInterval);
    isShuffling = false;
    arrangeCupsForFinding(count); // 겹치지 않게 배열
    statusText.textContent = `Level ${level}: 이제 찾으세요!`;
  }, shuffleDuration);
}

function shuffleCups(count) {
  const cups = document.querySelectorAll(".cup");

  const index1 = Math.floor(Math.random() * count);
  const index2 = Math.floor(Math.random() * count);
  if (index1 !== index2) {
    const cup1 = cups[index1];
    const cup2 = cups[index2];

    const tempTransform = getComputedStyle(cup1).transform;
    const offsetY1 = Math.random() > 0.5 ? 50 : -50;
    const offsetY2 = Math.random() > 0.5 ? 50 : -50;

    cup1.style.transform = `${getComputedStyle(cup2).transform} translateY(${offsetY1}px)`;
    cup2.style.transform = `${tempTransform} translateY(${offsetY2}px)`;
  }
}

function arrangeCupsForFinding(count) {
  // 컵을 겹치지 않게 중앙에 정렬하여 간격을 두고 배치
  const offset = -((count - 1) * 80); // 간격을 두고 배치하도록 설정
  const cups = document.querySelectorAll(".cup");
  cups.forEach((cup, i) => {
    cup.style.transform = `translateX(${offset + i * 160}px) translateY(0)`; // 컵 간 간격을 넓힘
  });
}

function checkCup(index) {
  if (isShuffling) {
    alert("섞는 중입니다. 잠시만 기다려 주세요!");
    return;
  }

  if (index === ballPosition) {
    alert("정답입니다! 다음 레벨로 이동합니다.");
    maxLevelReached = Math.max(maxLevelReached, currentLevel);
    currentLevel++;
    if (currentLevel > 20) {
      alert("축하합니다! 모든 레벨을 클리어했습니다!");
      resetGame();
      return;
    }
    startGame(currentLevel);
  } else {
    alert(`게임 오버! 최고 레벨: Level ${maxLevelReached}`);
    resetGame();
  }
}

function resetGame() {
  isShuffling = false;
  currentLevel = 1;
  maxLevelReached = 1;
  gameTitle.classList.remove("hidden");
  startButton.classList.remove("hidden");
  statusText.classList.add("hidden");
}
