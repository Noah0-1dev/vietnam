window.addEventListener("DOMContentLoaded", () => {
  // Thư viện văn bản mẫu dạng Tiếng Trung Phồn thể và code lập trình
  const textsDatabase = {
    code: `const array = [1, 2, 3, 4, 5];\nconst mapped = array.map(el => el * 2);\nconsole.log(mapped);`,
    english: `The quick brown fox jumps over the lazy dog. Programming is not about what you know; it is about what you can figure out.`,
    asia: `歡迎使用全新的智慧打字系統。Chào mừng bạn đến với hệ thống luyện gõ phím thông minh thế hệ mới.`,
  };

  const textExample = document.getElementById("textExample");
  const textInput = document.getElementById("textInput");
  const timeLeftDisplay = document.getElementById("timeLeft");
  const wpmDisplay = document.getElementById("wpm");
  const accuracyDisplay = document.getElementById("accuracy");
  const startTestBtn = document.getElementById("startTestBtn");
  const langSelector = document.getElementById("langSelector");
  const customTextInput = document.getElementById("customTextInput");
  const applyCustomBtn = document.getElementById("applyCustomBtn");

  let currentText = textsDatabase.code;
  let maxTime = 30;
  let timeLeft = maxTime;
  let timerInterval = null;
  let isPlaying = false;
  let mistakes = 0;

  // 🔊 AUDIO HARDWARE GENERATOR: Giả lập tiếng Click bàn phím cơ và tiếng Beep trầm khi gõ sai chữ
  function playTypeSound(isCorrect) {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    if (isCorrect) {
      osc.type = "sine";
      osc.frequency.setValueAtTime(1600, audioCtx.currentTime);
      gainNode.gain.setValueAtTime(0.08, audioCtx.currentTime);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.03);
    } else {
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(150, audioCtx.currentTime);
      gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.12);
    }
  }

  // Tách văn bản thành từng ký tự dạng thẻ <span> để theo dõi đổi màu
  function loadText() {
    textExample.innerHTML = "";
    currentText.split("").forEach((char) => {
      const span = document.createElement("span");
      span.textContent = char;
      textExample.appendChild(span);
    });
    if (textExample.children.length > 0)
      textExample.children[0].classList.add("char-current");
  }

  function resetStatus() {
    clearInterval(timerInterval);
    timerInterval = null;
    isPlaying = false;
    timeLeft = maxTime;
    mistakes = 0;
    textInput.disabled = true;
    textInput.value = "";
    wpmDisplay.textContent = "0";
    accuracyDisplay.textContent = "100";
    timeLeftDisplay.textContent = maxTime;
    loadText();
  }

  // Sự kiện lắng nghe hoán đổi lựa chọn bài văn mẫu
  langSelector.addEventListener("change", (e) => {
    currentText = textsDatabase[e.target.value];
    resetStatus();
  });

  // Nút kích hoạt chèn văn bản tự chọn của người dùng vào hệ thống làm đề bài
  applyCustomBtn.addEventListener("click", () => {
    const userText = customTextInput.value.trim();
    if (!userText) return alert("請先輸入文字！");
    currentText = userText;
    alert("自訂文本套用成功！");
    resetStatus();
  });

  function startTest() {
    isPlaying = true;
    timeLeft = maxTime;
    mistakes = 0;
    textInput.disabled = false;
    textInput.value = "";
    wpmDisplay.textContent = "0";
    accuracyDisplay.textContent = "100";
    timeLeftDisplay.textContent = timeLeft;
    loadText();
    textInput.focus();
    clearInterval(timerInterval);
    timerInterval = setInterval(updateTimer, 1000);
  }

  // Đồng hồ tính toán tốc độ gõ từ WPM theo thời gian thực (real-time)
  function updateTimer() {
    if (timeLeft > 0) {
      timeLeft--;
      timeLeftDisplay.textContent = timeLeft;
      let charactersTyped = textInput.value.length - mistakes;
      if (charactersTyped < 0) charactersTyped = 0;
      let timeElapsed = (maxTime - timeLeft) / 60;
      let wpm = Math.round(charactersTyped / 5 / timeElapsed);
      wpmDisplay.textContent = isFinite(wpm) && wpm > 0 ? wpm : 0;
    } else {
      endTest();
    }
  }

  // Kiểm tra ký tự nhập vào xem đúng hay lỗi
  textInput.addEventListener("input", (e) => {
    const spans = textExample.querySelectorAll("span");
    const inputChars = textInput.value.split("");

    const lastIndex = inputChars.length - 1;
    if (lastIndex >= 0 && lastIndex < spans.length) {
      const isCorrect = inputChars[lastIndex] === spans[lastIndex].textContent;
      playTypeSound(isCorrect);
    }

    mistakes = 0;
    spans.forEach((span, index) => {
      const inputChar = inputChars[index];
      span.classList.remove("char-correct", "char-incorrect", "char-current");
      if (inputChar == null) {
        if (index === inputChars.length) span.classList.add("char-current");
      } else if (inputChar === span.textContent) {
        span.classList.add("char-correct");
      } else {
        span.classList.add("char-incorrect");
        mistakes++;
      }
    });

    let totalTyped = inputChars.length;
    let accuracy =
      totalTyped > 0
        ? Math.round(((totalTyped - mistakes) / totalTyped) * 100)
        : 100;
    accuracyDisplay.textContent = accuracy;

    if (totalTyped >= spans.length) endTest();
  });

  // Kết thúc vòng đo gõ phím và lưu kỷ lục vào bảng vàng
  function endTest() {
    clearInterval(timerInterval);
    textInput.disabled = true;
    isPlaying = false;
    const finalWpm = parseInt(wpmDisplay.textContent) || 0;

    // 🏆 SO SÁNH VÀ LƯU KỶ LỤC TỐC ĐỘ CAO NHẤT (WPM) VÀO LOCAL STORAGE
    const historyWpm = parseInt(localStorage.getItem("best_wpm")) || 0;
    if (finalWpm > historyWpm) {
      localStorage.setItem("best_wpm", finalWpm);
    }

    alert(
      `🎉 測試完成！打字速度為: ${finalWpm} WPM，精確度為: ${accuracyDisplay.textContent}%，最高紀錄已同步保存！`,
    );
  }

  startTestBtn.addEventListener("click", startTest);
  loadText();
});
