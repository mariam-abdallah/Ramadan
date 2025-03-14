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
let angle = 0;
let userEmail = "";

// دالة رسم العجلة
function drawWheel() {
    let totalSlices = prizes.length;
    let sliceAngle = (2 * Math.PI) / totalSlices;

    ctx.clearRect(0, 0, canvas.width, canvas.height); // تنظيف العجلة القديمة
    angle = 0; // إعادة تعيين الزاوية لضمان دقة الرسم

    for (let i = 0; i < totalSlices; i++) {
        // رسم كل خانة
        ctx.beginPath();
        ctx.moveTo(200, 200);
        ctx.arc(200, 200, 200, angle, angle + sliceAngle);
        ctx.closePath();
        ctx.fillStyle = colors[i % colors.length];
        ctx.fill();
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 2;
        ctx.stroke();

        // ضبط النص داخل كل خانة
        ctx.save();
        ctx.translate(200, 200); // نقل نقطة الرسم إلى مركز العجلة
        ctx.rotate(angle + sliceAngle / 2); // ضبط زاوية النص لتكون أفقية داخل الخانة

        ctx.fillStyle = "#fff";
        ctx.font = "bold 14px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle"; // جعل النص في المنتصف

        // تقسيم النص الطويل تلقائيًا إلى سطرين أو أكثر
        let words = prizes[i].split(" ");
        let line1 = words.slice(0, Math.ceil(words.length / 2)).join(" ");
        let line2 = words.slice(Math.ceil(words.length / 2)).join(" ");

        ctx.fillText(line1, 120, -10, 90); // السطر الأول
        ctx.fillText(line2, 120, 10, 90);  // السطر الثاني

        ctx.restore();
        angle += sliceAngle;
    }
}

// استدعاء الدالة لرسم العجلة عند تحميل الصفحة
drawWheel();

function startGame() {
    userEmail = document.getElementById("email").value.trim();
    
    if (!userEmail) {
        alert("يرجى إدخال بريدك الإلكتروني للعب");
        return;
    }
    
    let lastPlayedDate = localStorage.getItem(userEmail);
    let today = new Date().toISOString().split('T')[0]; // حفظ التاريخ بصيغة YYYY-MM-DD

    if (lastPlayedDate === today) {
        alert("لقد قمت باللعب اليوم بالفعل! حاول مرة أخرى غدًا.");
        return;
    }
    
    document.getElementById("spinButton").disabled = false; // السماح بالتدوير
}

function spinWheel() {
    if (!userEmail) {
        alert("يرجى إدخال البريد الإلكتروني أولا!");
        return;
    }

    let lastPlayedDate = localStorage.getItem(userEmail);
    let today = new Date().toISOString().split('T')[0];

    if (lastPlayedDate === today) {
        alert("لقد قمت باللعب اليوم بالفعل! حاول مرة أخرى غدًا.");
        return;
    }

    document.getElementById("spinSound").play();
    
    let rotation = Math.floor(Math.random() * 360) + 720;
    let sectionAngle = 360 / prizes.length;
    let selectedPrizeIndex = Math.floor(((rotation % 360) + sectionAngle / 2) / sectionAngle) % prizes.length;

    canvas.style.transition = "transform 3s ease-out";
    canvas.style.transform = `rotate(${rotation}deg)`;

    setTimeout(() => {
        localStorage.setItem(userEmail, today); // حفظ تاريخ اللعب
        showPopup(prizes[selectedPrizeIndex]);
        document.getElementById("spinButton").disabled = true; // تعطيل زر التدوير بعد اللعب
    }, 3000);
}

function showPopup(prize) {
    document.getElementById("prizeText").innerText = `مبروك! لقد فزت بـ: ${prize}`;
    document.getElementById("prizePopup").style.display = "block";
}

function closePopup() {
    document.getElementById("prizePopup").style.display = "none";
}