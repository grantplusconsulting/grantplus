const questions = [
    {
        question: "Yoshingiz nechida?",
        options: [
            { text: "18 – 20", score: 25 },
            { text: "20 – 23", score: 20 },
            { text: "23 – 25", score: 15 },
            { text: "25+", score: 10 }
        ]
    },
    {
        question: "Qanday til sertifikatingiz bor?",
        options: [
            { text: "TOPIK 1-2", score: 20 },
            { text: "TOPIK 3-6", score: 25 },
            { text: "IELTS/SEJONG", score: 20 },
            { text: "Sertifikatim yo'q", score: 10 }
        ]
    },
    {
        question: "Qaysi dasturga topshirmoqchisiz?",
        options: [
            { text: "Til kursi", score: 20 },
            { text: "Bakalavr", score: 20 },
            { text: "Kasbiy ta'lim", score: 20 },
            { text: "Magistratura", score: 20 },
            { text: "Telex viza", score: 10 }
        ]
    },
    {
        question: "Ota-onangizning rasmiy ish joyi bormi?",
        options: [
            { text: "Ha bor", score: 15 },
            { text: "Rasmiy ish joyi yo'q", score: 10 }
        ]
    },
    {
        question: "Qaysi shaharga o'qishga bormoqchisiz?",
        options: [
            { text: "Seul", score: 10 },
            { text: "Busan", score: 20 },
            { text: "Incheon", score: 20 },
            { text: "Boshqa shahar", score: 15 }
        ]
    },
    {
        question: "Koreya elchixonasidan rad javobingiz bormi?",
        options: [
            { text: "Rad javobi yo'q", score: 15 },
            { text: "6-band bilan", score: 0 },
            { text: "7-band bilan", score: 5 },
            { text: "8-band bilan", score: 5 },
            { text: "11-band bilan", score: 5 }
        ]
    },
    {
        question: "Ota-onangiz nomida qanday mol-mulk hujjatlari bor?",
        options: [
            { text: "Yuridik uy hujjati", score: 15 },
            { text: "Avtomobil hujjati", score: 10 },
            { text: "Yuridik uy hujjat va avtomobil hujjati", score: 20 },
            { text: "Hech qanday mol-mulk hujjatlari yo'q", score: 5 }
        ]
    },
    {
        question: "Ota-onangiz nomida nechta avtomobil bor?",
        options: [
            { text: "Avtomobil yo'q", score: 5 },
            { text: "1 ta avotmobil bor", score: 10 },
            { text: "2 ta avtomobil bor", score: 15 },
            { text: "3+ avtomobil bor", score: 20 }
        ]
    }
];

const MAX_SCORE = 160;
let currentQuestionIndex = 0;
let userAnswers = new Array(questions.length).fill(null);

// Elements
const screens = {
    hero: document.getElementById('hero-section'),
    quiz: document.getElementById('quiz-section'),
    lead: document.getElementById('lead-section'),
    result: document.getElementById('result-section')
};

// Buttons
const startBtn = document.getElementById('start-btn');
const nextBtn = document.getElementById('next-btn');
const leadForm = document.getElementById('lead-form');

// Quiz Elements
const progressBar = document.getElementById('progress-bar');
const questionCounter = document.getElementById('question-counter');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');

// Result Elements
const resultPercentage = document.getElementById('result-percentage');
const scoreRing = document.getElementById('score-ring');
const resultHeading = document.getElementById('result-heading');
const resultDesc = document.getElementById('result-desc');
const resultMessageBox = document.getElementById('result-message');

// Utility to switch screens
function showScreen(screenKey) {
    Object.values(screens).forEach(screen => {
        screen.classList.remove('active-screen');
    });
    screens[screenKey].classList.add('active-screen');
}

// Initialize
function init() {
    const phoneInput = document.getElementById('phone-number');
    
    // Set initial value
    phoneInput.value = '998 ';
    
    // Format and restrict phone number input
    phoneInput.addEventListener('input', function(e) {
        let val = this.value;
        
        // Ensure +998 prefix exists and cannot be deleted
        if (!val.startsWith('998 ')) {
            val = '998 ' + val.replace(/^\998/, '').replace(/^ /, '');
        }
        
        // Remove any non-digit characters after the prefix
        const prefix = '998 ';
        let digits = val.substring(prefix.length).replace(/\D/g, '');
        
        // Limit to 9 digits after prefix
        if (digits.length > 9) {
            digits = digits.substring(0, 9);
        }
        
        this.value = prefix + digits;
    });

    // Prevent cursor from going before prefix
    phoneInput.addEventListener('keydown', function(e) {
        if (this.selectionStart < 5 && ['Backspace', 'ArrowLeft', 'Delete'].includes(e.key)) {
            e.preventDefault();
        }
    });

    startBtn.addEventListener('click', () => {
        currentQuestionIndex = 0;
        userAnswers.fill(null);
        renderQuestion();
        showScreen('quiz');
    });

    nextBtn.addEventListener('click', () => {
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            renderQuestion();
        } else {
            showScreen('lead');
        }
    });

    leadForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('full-name').value.trim();
        const phone = document.getElementById('phone-number').value.trim();

        if (name && phone) {
            const submitLeadBtn = document.getElementById('submit-lead-btn');
            const originalText = submitLeadBtn.textContent;
            submitLeadBtn.textContent = 'Submitting...';
            submitLeadBtn.disabled = true;

            const totalScore = userAnswers.reduce((sum, score) => sum + (score || 0), 0);
            const finalPercentage = Math.round((totalScore / MAX_SCORE) * 100);

            // Replace this with your Google Apps Script Web App URL
            const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbztQdp2AUgFdz_nvQ2U4JUBxw9sP6Pmzpw-M5V2R7jHLpUodjWCtDIzVoZvzZnYQNnj/exec';

            if (SCRIPT_URL) {
                const formData = new FormData();
                formData.append('name', name);
                formData.append('phone', phone);
                formData.append('score', finalPercentage + '%');
                formData.append('timestamp', new Date().toISOString());

                fetch(SCRIPT_URL, { method: 'POST', body: formData })
                    .then(response => {
                        submitLeadBtn.textContent = originalText;
                        submitLeadBtn.disabled = false;
                        calculateAndShowResult();
                    })
                    .catch(error => {
                        console.error('Error!', error);
                        submitLeadBtn.textContent = originalText;
                        submitLeadBtn.disabled = false;
                        calculateAndShowResult(); // Show result even if sending fails
                    });
            } else {
                // Fallback if URL is not set
                setTimeout(() => {
                    submitLeadBtn.textContent = originalText;
                    submitLeadBtn.disabled = false;
                    calculateAndShowResult();
                }, 300);
            }
        }
    });

}

function downloadCertificate() {
    const element = document.getElementById('certificate-template');
    const opt = {
        margin:       0,
        filename:     'Sertifikat.pdf',
        image:        { type: 'jpeg', quality: 1.0 },
        html2canvas:  { 
            scale: 3, 
            useCORS: true, 
            logging: false,
            backgroundColor: '#0f172a'
        },
        jsPDF:        { unit: 'px', format: [1400, 1000], orientation: 'landscape' }
    };
    
    html2pdf().set(opt).from(element).save();
}

function renderQuestion() {
    const q = questions[currentQuestionIndex];
    questionCounter.textContent = `Question ${currentQuestionIndex + 1} of ${questions.length}`;
    questionText.textContent = q.question;

    // Update progress bar
    const progress = ((currentQuestionIndex) / questions.length) * 100;
    progressBar.style.width = `${progress}%`;

    optionsContainer.innerHTML = '';

    q.options.forEach((opt, index) => {
        const optionEl = document.createElement('label');
        optionEl.className = 'option-label';

        const input = document.createElement('input');
        input.type = 'radio';
        input.name = `question-${currentQuestionIndex}`;
        input.value = opt.score;
        input.className = 'option-input';

        if (userAnswers[currentQuestionIndex] === opt.score) {
            input.checked = true;
            optionEl.classList.add('selected');
        }

        input.addEventListener('change', (e) => {
            document.querySelectorAll('.option-label').forEach(el => el.classList.remove('selected'));
            if (e.target.checked) {
                optionEl.classList.add('selected');
                userAnswers[currentQuestionIndex] = parseInt(e.target.value);
                nextBtn.disabled = false;
            }
        });

        const customRadio = document.createElement('div');
        customRadio.className = 'option-custom-radio';

        const textSpan = document.createElement('span');
        textSpan.className = 'option-text';
        textSpan.textContent = opt.text;

        optionEl.appendChild(input);
        optionEl.appendChild(customRadio);
        optionEl.appendChild(textSpan);

        optionsContainer.appendChild(optionEl);
    });

    nextBtn.disabled = userAnswers[currentQuestionIndex] === null;
}

function calculateAndShowResult() {
    const totalScore = userAnswers.reduce((sum, score) => sum + (score || 0), 0);
    const rawPercentage = (totalScore / MAX_SCORE) * 100;
    const finalPercentage = Math.round(rawPercentage);

    let headingText = "";
    let descText = "";
    let themeColor = "";
    let shadowColor = "";

    if (finalPercentage >= 80) {
        headingText = "Koreya davlatiga viza olish ehtimolingiz yuqori.";
        descText = "Lekin ko'pchilik shoshilib xatoga yo'l qo'yadi. Hoziroq biz bilan bog'laning va xatolarsiz vizangizni qo'lga kiriting";
        themeColor = "rgba(16, 185, 129, 0.2)"; // Emerald bg
        shadowColor = "#10b981";
    } else if (finalPercentage >= 60) {
        headingText = "Koreya davlatiga viza olish ehtimolingiz yaxshi.";
        descText = "Lekin ko'pchilik shoshilib xatoga yo'l qo'yadi. Hoziroq biz bilan bog'laning va xatolarsiz vizangizni qo'lga kiriting.";
        themeColor = "rgba(59, 130, 246, 0.2)"; // Blue bg
        shadowColor = "#3b82f6";
    } else if (finalPercentage >= 40) {
        headingText = "Koreya davlatiga viza olish ehtimolingiz o'rtacha";
        descText = "To‘g‘ri strategiya bilan siz ham yuqori natijaga chiqasiz. Bunda sizga GrantPlus Consulting yordam beradi.";
        themeColor = "rgba(245, 158, 11, 0.2)"; // Amber bg
        shadowColor = "#f59e0b";
    } else {
        headingText = "Hozircha sizning imkoniyatingiz past.";
        descText = "Biroq, to'g'ri strategiya bilan viza olish ehtimolingizni oshirish mumkin. Bunda sizga GrantPlus Consulting yordam beradi.";
        themeColor = "rgba(239, 68, 68, 0.2)"; // Red bg
        shadowColor = "#ef4444";
    }

    resultHeading.textContent = headingText;
    resultDesc.textContent = descText;
    resultPercentage.textContent = "0";

    // Optional: dynamic background color for result message based on score
    resultMessageBox.style.backgroundColor = themeColor;
    resultMessageBox.style.borderColor = shadowColor;
    resultHeading.style.color = shadowColor;

    // Populate Certificate Data
    const fullName = document.getElementById('full-name').value.trim();
    document.getElementById('cert-name').textContent = fullName;
    
    let certResultText = '';
    if (finalPercentage >= 80) certResultText = 'Yuqori';
    else if (finalPercentage >= 60) certResultText = 'Yaxshi';
    else if (finalPercentage >= 40) certResultText = "O'rtacha";
    else certResultText = 'Past';
    
    document.getElementById('cert-score-text').textContent = `${certResultText} (${finalPercentage}%)`;
    
    const today = new Date();
    const formattedDate = String(today.getDate()).padStart(2, '0') + '.' + String(today.getMonth() + 1).padStart(2, '0') + '.' + today.getFullYear();
    document.getElementById('cert-date').textContent = formattedDate;

    showScreen('result');
    animateResult(finalPercentage);

    // Automatically download certificate after a short delay
    // setTimeout(() => {
    //     downloadCertificate();
    // }, 1500);
}

function animateResult(targetPercentage) {
    let current = 0;
    const duration = 1500;
    const interval = 20;
    // ensure we don't divide by zero if targetPercentage is 0
    const step = targetPercentage === 0 ? 0 : targetPercentage / (duration / interval);

    // If score is 0, just set it and return (to avoid NaN or never-ending problems)
    if (targetPercentage === 0) {
        resultPercentage.textContent = "0";
        scoreRing.style.strokeDashoffset = 440;
        return;
    }

    const timer = setInterval(() => {
        current += step;
        if (current >= targetPercentage) {
            current = targetPercentage;
            clearInterval(timer);
        }
        resultPercentage.textContent = Math.round(current);
    }, interval);

    // SVG circle has radius 70. Circumference is approx 440.
    const circumference = 440;
    const offset = circumference - (targetPercentage / 100) * circumference;

    setTimeout(() => {
        scoreRing.style.strokeDashoffset = offset;
    }, 100);
}

document.addEventListener('DOMContentLoaded', init);
