window.addEventListener("DOMContentLoaded", () => {
  // Lấy các thành phần giao diện của Canvas vẽ đồ họa
  const canvas = document.getElementById("paintCanvas");
  const ctx = canvas.getContext("2d");
  const colorPicker = document.getElementById("colorPicker");
  const lineWidthRange = document.getElementById("lineWidth");
  const clearBtn = document.getElementById("clearBtn");
  const downloadBtn = document.getElementById("downloadBtn");
  let painting = false;

  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  // Bắt đầu vẽ khi ấn chuột xuống hoặc chạm tay vào màn hình cảm ứng
  function startPosition(e) {
    painting = true;
    draw(e);
  }
  function finishedPosition() {
    painting = false;
    ctx.beginPath();
  }

  // Hàm dựng đường line vẽ theo tọa độ chuột thực tế
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

  // Lắng nghe sự kiện chuột trên PC và chạm cảm ứng trên Mobile phone
  canvas.addEventListener("mousedown", startPosition);
  canvas.addEventListener("mouseup", finishedPosition);
  canvas.addEventListener("mousemove", draw);
  canvas.addEventListener("touchstart", startPosition);
  canvas.addEventListener("touchend", finishedPosition);
  canvas.addEventListener("touchmove", draw);
  clearBtn.addEventListener("click", () =>
    ctx.clearRect(0, 0, canvas.width, canvas.height),
  );

  // Tải bức vẽ canvas về máy dưới dạng hình ảnh đồ họa PNG
  downloadBtn.addEventListener("click", () => {
    const link = document.createElement("a");
    link.download = "sketch.png";
    link.href = canvas.toDataURL();
    link.click();
  });

  // Logic tạo mã QR và trích xuất tải file ảnh QR độc lập
  const qrInput = document.getElementById("qrInput");
  const genQrBtn = document.getElementById("genQrBtn");
  const qrcodeContainer = document.getElementById("qrcode");
  const qrPlaceholder = document.getElementById("qrPlaceholder");
  const downloadQrBtn = document.getElementById("downloadQrBtn");

  // Khởi tạo thực thể mã QR kích thước chuẩn 180px
  const qrcode = new QRCode(qrcodeContainer, { width: 180, height: 180 });

  genQrBtn.addEventListener("click", () => {
    const text = qrInput.value.trim();
    if (!text) return alert("請先輸入內容！");
    qrcode.makeCode(text);
    qrcodeContainer.classList.remove("hidden");
    qrPlaceholder.classList.add("hidden");

    // Đợi 300ms cho thư viện xử lý xuất thẻ img hoàn chỉnh rồi mới hiện nút tải ảnh xuống
    setTimeout(() => {
      downloadQrBtn.classList.remove("hidden");
    }, 300);
  });

  // Hàm bóc tách dữ liệu thẻ img của thư viện QRCode để tải ảnh về máy máy tính
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
