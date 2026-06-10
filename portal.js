window.addEventListener("DOMContentLoaded", () => {
  // [Giữ nguyên đoạn code Canvas cũ của bạn ở đây...]
  const canvas = document.getElementById("paintCanvas");
  const ctx = canvas.getContext("2d");
  const colorPicker = document.getElementById("colorPicker");
  const lineWidthRange = document.getElementById("lineWidth");
  const clearBtn = document.getElementById("clearBtn");
  const downloadBtn = document.getElementById("downloadBtn");
  let painting = false;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  function startPosition(e) {
    painting = true;
    draw(e);
  }
  function finishedPosition() {
    painting = false;
    ctx.beginPath();
  }
  function draw(e) {
    if (!painting) return;
    ctx.strokeStyle = colorPicker.value;
    ctx.lineWidth = lineWidthRange.value;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  }
  canvas.addEventListener("mousedown", startPosition);
  canvas.addEventListener("mouseup", finishedPosition);
  canvas.addEventListener("mousemove", draw);
  canvas.addEventListener("touchstart", startPosition);
  canvas.addEventListener("touchend", finishedPosition);
  canvas.addEventListener("touchmove", draw);
  clearBtn.addEventListener("click", () =>
    ctx.clearRect(0, 0, canvas.width, canvas.height),
  );
  downloadBtn.addEventListener("click", () => {
    const link = document.createElement("a");
    link.download = "sketch.png";
    link.href = canvas.toDataURL();
    link.click();
  });

  // 🚀 ENGINE XỬ LÝ QR CODE CÓ TẢI ẢNH
  const qrInput = document.getElementById("qrInput");
  const genQrBtn = document.getElementById("genQrBtn");
  const qrcodeContainer = document.getElementById("qrcode");
  const qrPlaceholder = document.getElementById("qrPlaceholder");
  const downloadQrBtn = document.getElementById("downloadQrBtn");

  const qrcode = new QRCode(qrcodeContainer, { width: 180, height: 180 });

  genQrBtn.addEventListener("click", () => {
    const text = qrInput.value.trim();
    if (!text) return alert("請先輸入內容！");
    qrcode.makeCode(text);
    qrcodeContainer.classList.remove("hidden");
    qrPlaceholder.classList.add("hidden");

    // Chờ thư viện render xong ảnh img rồi hiển thị nút tải
    setTimeout(() => {
      downloadQrBtn.classList.remove("hidden");
    }, 300);
  });

  downloadQrBtn.addEventListener("click", () => {
    const imgElement = qrcodeContainer.querySelector("img");
    if (imgElement) {
      const link = document.createElement("a");
      link.download = "my_qrcode.png";
      link.href = imgElement.src;
      link.click();
    } else {
      alert("圖檔生成中，請稍後再試！");
    }
  });
});
