window.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('paintCanvas');
    const ctx = canvas.getContext('2d');
    const colorPicker = document.getElementById('colorPicker');
    const lineWidthRange = document.getElementById('lineWidth');
    const clearBtn = document.getElementById('clearBtn');
    const downloadBtn = document.getElementById('downloadBtn');

    let painting = false;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

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

    canvas.addEventListener('mousedown', startPosition);
    canvas.addEventListener('mouseup', finishedPosition);
    canvas.addEventListener('mousemove', draw);

    canvas.addEventListener('touchstart', startPosition);
    canvas.addEventListener('touchend', finishedPosition);
    canvas.addEventListener('touchmove', draw);

    clearBtn.addEventListener('click', () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    });

    downloadBtn.addEventListener('click', () => {
        const link = document.createElement('a');
        link.download = 'my-canvas-artwork.png';
        link.href = canvas.toDataURL();
        link.click();
    });

    // QR Code
    const qrInput = document.getElementById('qrInput');
    const genQrBtn = document.getElementById('genQrBtn');
    const qrcodeContainer = document.getElementById('qrcode');
    const qrPlaceholder = document.getElementById('qrPlaceholder');

    const qrcode = new QRCode(qrcodeContainer, {
        width: 160,
        height: 160,
        colorDark : "#000000",
        colorLight : "#ffffff",
        correctLevel : QRCode.CorrectLevel.H
    });

    genQrBtn.addEventListener('click', () => {
        const text = qrInput.value.trim();
        if (text === '') {
            alert('請輸入網址或文字！');
            return;
        }
        qrcode.makeCode(text);
        qrcodeContainer.classList.remove('hidden');
        qrPlaceholder.classList.add('hidden');
    });
});