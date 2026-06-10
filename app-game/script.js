window.addEventListener("DOMContentLoaded", () => {
  // 💡 ĐÃ SỬA LỖI: Bổ sung kho dữ liệu lên 16 icon (Tha hồ dùng cho mức Khó cần 12 cặp)
  const allEmojis = [
    "🦊",
    "🐱",
    "🐼",
    "🦁",
    "🐸",
    "🐵",
    "🦄",
    "🐝",
    "🐙",
    "🐷",
    "🐨",
    "🦉",
    "🐣",
    "🦖",
    "🐬",
    "🦋",
  ];

  const gameBoard = document.getElementById("gameBoard");
  const timerDisplay = document.getElementById("timer");
  const clicksDisplay = document.getElementById("clicks");
  const restartBtn = document.getElementById("restartBtn");
  const difficultySelect = document.getElementById("difficultySelect");

  let flippedCards = [];
  let matchedCount = 0;
  let clicks = 0;
  let timer = 0;
  let timerInterval = null;
  let isLocked = false;
  let currentEmojis = []; // Mảng chứa icon thực tế của ván đấu

  // 🔊 AUDIO ENGINE PHÁT ÂM THANH KỸ THUẬT SỐ (Giữ nguyên bản Level 3)
  function playAudio(type) {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    if (type === "flip") {
      osc.frequency.setValueAtTime(300, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(
        150,
        audioCtx.currentTime + 0.15,
      );
      gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.15);
    } else if (type === "match") {
      osc.frequency.setValueAtTime(523.25, audioCtx.currentTime);
      osc.frequency.setValueAtTime(659.25, audioCtx.currentTime + 0.1);
      gainNode.gain.setValueAtTime(0.4, audioCtx.currentTime);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.25);
    } else if (type === "win") {
      osc.type = "triangle";
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime);
      osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.15);
      gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.4);
    }
  }

  // Thuật toán xáo trộn vị trí ngẫu nhiên bài (Fisher-Yates)
  function shuffle(array) {
    let currentIndex = array.length,
      randomIndex;
    while (currentIndex != 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }
    return array;
  }

  function startTimer() {
    if (timerInterval) return;
    timerInterval = setInterval(() => {
      timer++;
      const mins = String(Math.floor(timer / 60)).padStart(2, "0");
      const secs = String(timer % 60).padStart(2, "0");
      timerDisplay.textContent = `${mins}:${secs}`;
    }, 1000);
  }

  // TỰ ĐỘNG PHÂN CHIA ICON VÀ GRID THEO CẤP ĐỘ KHÓ
  function setupDifficulty() {
    const mode = difficultySelect.value;
    let numPairs = 8;

    // Xóa sạch cấu hình Grid cũ để nạp class mới
    gameBoard.className =
      "grid gap-3 md:gap-4 mx-auto p-4 rounded-3xl border border-slate-200 shadow-inner";

    if (mode === "easy") {
      numPairs = 4; // Cần đúng 4 cặp (8 ô)
      gameBoard.classList.add("grid-cols-4", "max-w-md");
    } else if (mode === "normal") {
      numPairs = 8; // Cần đúng 8 cặp (16 ô)
      gameBoard.classList.add("grid-cols-4", "max-w-md");
    } else if (mode === "hard") {
      numPairs = 12; // Cần đúng 12 cặp (24 ô) -> Cắt đủ 12 icon từ mảng tổng
      gameBoard.classList.add("grid-cols-6", "max-w-2xl");
    }

    // Lấy chuẩn số lượng icon và nhân đôi tạo cặp đối xứng
    const selectedEmojis = allEmojis.slice(0, numPairs);
    currentEmojis = [...selectedEmojis, ...selectedEmojis];
  }

  // Khởi tạo bàn cờ sạch
  function initGame() {
    setupDifficulty();

    gameBoard.innerHTML = "";
    flippedCards = [];
    matchedCount = 0;
    clicks = 0;
    timer = 0;
    isLocked = false;
    clicksDisplay.textContent = "0";
    timerDisplay.textContent = "00:00";
    clearInterval(timerInterval);
    timerInterval = null;

    // Trộn bài và rải đều ra lưới
    shuffle([...currentEmojis]).forEach((emoji) => {
      const card = document.createElement("div");
      card.classList.add("card");
      card.innerHTML = `
                <div class="card-inner">
                    <div class="card-back">❓</div>
                    <div class="card-front">${emoji}</div>
                </div>
            `;
      card.addEventListener("click", () => flipCard(card));
      gameBoard.appendChild(card);
    });
  }

  function flipCard(card) {
    if (isLocked) return;
    if (
      card.classList.contains("flipped") ||
      card.classList.contains("matched")
    )
      return;

    playAudio("flip");
    startTimer();
    card.classList.add("flipped");
    flippedCards.push(card);
    clicks++;
    clicksDisplay.textContent = clicks;

    if (flippedCards.length === 2) {
      isLocked = true;
      checkMatch();
    }
  }

  function checkMatch() {
    const [card1, card2] = flippedCards;
    const e1 = card1.querySelector(".card-front").textContent;
    const e2 = card2.querySelector(".card-front").textContent;

    if (e1 === e2) {
      card1.classList.add("matched");
      card2.classList.add("matched");
      flippedCards = [];
      matchedCount += 2;
      isLocked = false;
      playAudio("match");

      if (matchedCount === currentEmojis.length) {
        clearInterval(timerInterval);
        playAudio("win");
        const modeText =
          difficultySelect.options[difficultySelect.selectedIndex].text.split(
            " ",
          )[0];
        setTimeout(
          () =>
            alert(
              `🎉 恭喜破關！您已成功征服 [${modeText}]！\n總點擊：${clicks} 次\n總耗時：${timer} 秒`,
            ),
          400,
        );
      }
    } else {
      setTimeout(() => {
        card1.classList.remove("flipped");
        card2.classList.remove("flipped");
        flippedCards = [];
        isLocked = false;
      }, 1000);
    }
  }

  difficultySelect.addEventListener("change", initGame);
  restartBtn.addEventListener("click", initGame);

  initGame();
});
