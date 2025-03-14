const prizes = [
    "أمل فيلر ٥٥٠ ريال",
    "خصم ١٠٪؜ على البوتوكس",
    "خصم ١٠٪؜ على الفيلر",
    "تشقير حواجب ب ٤٥ ريال",
    "خصم ١٥٪؜ على تنظيف البشرة",
    "خصم ١٠٪؜ على التقشير البارد"
];

const colors = ["#FFD700", "#004C5C", "#8B5A2B", "#D32F2F", "#F5E3C3", "#002D3A"];
let canvas = document.getElementById("wheelCanvas");
let ctx = canvas.getContext("2d");
let spinBtn = document.getElementById("spinButton");
let currentRotation = 0;
let userEmail = "";
let spinSound = document.getElementById("spinSound");

const totalSlices = prizes.length;
const sectionAngle = 360 / totalSlices;

function drawWheel(rotationAngle = 0) {
    let sliceAngle = (2 * Math.PI) / totalSlices;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(200, 200);
    ctx.rotate(rotationAngle - Math.PI / 2); // ✅ Align prizes with the pointer

    for (let i = 0; i < totalSlices; i++) {
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, 200, i * sliceAngle, (i + 1) * sliceAngle);
        ctx.closePath();
        ctx.fillStyle = colors[i % colors.length];
        ctx.fill();
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.save();
        ctx.rotate(i * sliceAngle + sliceAngle / 2);
        ctx.translate(140, 0);
        ctx.rotate(Math.PI / 2);
        ctx.fillStyle = "black";
        ctx.font = "bold 14px Arial";
        ctx.textAlign = "center";
        ctx.fillText(prizes[i], 0, 0);
        ctx.restore();
    }

    ctx.restore();
}

drawWheel();

function startGame() {
    userEmail = document.getElementById("email").value.trim();
    if (!userEmail) {
        alert("يرجى إدخال بريدك الإلكتروني للعب");
        return;
    }

    let lastPlayedDate = localStorage.getItem(userEmail);
    let today = new Date().toISOString().split('T')[0];

    if (lastPlayedDate === today) {
        alert("لقد قمت باللعب اليوم بالفعل! حاول مرة أخرى غدًا.");
        return;
    }

    spinBtn.disabled = false;
}

function spinWheel() {
    let userEmail = document.getElementById("email").value.trim(); // ✅ Get email input

    // ✅ **Regular expression for email validation**
    let emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!userEmail) {
        showAlertPopup("❌ يرجى إدخال البريد الإلكتروني!");
        return;
    }

    if (!emailPattern.test(userEmail)) {
        showAlertPopup("⚠️ البريد الإلكتروني غير صحيح، يرجى إدخال بريد صالح!");
        return;
    }

    let lastPlayedDate = localStorage.getItem(userEmail);
    let today = new Date().toISOString().split('T')[0];

    if (lastPlayedDate === today) {
        showAlertPopup("⏳ لقد قمت باللعب اليوم بالفعل! حاول مرة أخرى غدًا.");
        return;
    }

    spinBtn.disabled = true; // ✅ Disable button during spin
    spinSound.currentTime = 0;
    spinSound.play();

    let randomDegrees = Math.floor(Math.random() * 360) + 1800; // ✅ Ensures multiple spins before stopping
    let finalRotation = currentRotation + randomDegrees;

    let start = performance.now();
    let duration = 3000; // ✅ Smooth spin over 3 seconds

    function animateSpin(time) {
        let progress = (time - start) / duration;
        if (progress < 1) {
            let easeOut = 1 - Math.pow(1 - progress, 3);
            let currentAngle = currentRotation + easeOut * randomDegrees;
            drawWheel((currentAngle * Math.PI) / 180);
            requestAnimationFrame(animateSpin);
        } else {
            spinSound.pause();
            spinSound.currentTime = 0;
            currentRotation = finalRotation % 360;

            // ✅ **Correct prize selection logic**
            let normalizedRotation = (360 - currentRotation) % 360;
            let selectedPrizeIndex = Math.floor(normalizedRotation / sectionAngle) % totalSlices;

            localStorage.setItem(userEmail, today);
            showPopup(prizes[selectedPrizeIndex]);

            setTimeout(() => {
                spinBtn.disabled = false; // ✅ Re-enable button after spin
            }, 1000);
        }
    }

    requestAnimationFrame(animateSpin);
}



function showPopup(prize) {
    let popup = document.getElementById("prizePopup");
    let prizeText = document.getElementById("prizeText");
    prizeText.innerText = `🎉 مبروك! لقد فزت بـ: ${prize} 🎁`;
    popup.style.display = "block";
}

function closePopup() {
    document.getElementById("prizePopup").style.display = "none";
}
// ✅ دالة لإظهار النافذة المنبثقة مع رسالة مخصصة
function showAlertPopup(message) {
    let popup = document.getElementById("alertPopup");
    let messageText = document.getElementById("alertMessage");
    messageText.innerText = message;
    popup.style.display = "block";
}

// ✅ دالة إغلاق النافذة المنبثقة
function closeAlertPopup() {
    document.getElementById("alertPopup").style.display = "none";
}
