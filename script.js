let vocabList = [];
let currentIndex = 0;
let showingFront = true;
let correctAnswer = ""; // Biến để lưu đáp án đúng

document.getElementById('loadButton').addEventListener('click', loadExcelFile);
document.getElementById('flashcard').addEventListener('click', flipCard);
document.getElementById('nextButton').addEventListener('click', nextCard);
document.getElementById('checkButton').addEventListener('click', checkAnswer);

function loadExcelFile() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    
    if (!file) {
        alert('Vui lòng chọn một file để tải dữ liệu.');
        return;
    }
    
    const reader = new FileReader();

    reader.onload = function(e) {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        vocabList = XLSX.utils.sheet_to_json(worksheet, { header: 1 }).slice(1);
        if (vocabList.length > 0) {
            showCard();
        } else {
            alert('File không chứa dữ liệu.');
        }
    };

    reader.readAsArrayBuffer(file);
}

function showCard() {
    if (vocabList.length === 0) return;

    const [stt, hanzi, pinyin, hanViet, viet] = vocabList[currentIndex];

    document.getElementById('stt').textContent = `STT: ${stt}`;
    document.getElementById('hanzi').textContent = hanzi;
    document.getElementById('pinyin').textContent = pinyin;
    document.getElementById('hanViet').textContent = hanViet;
    document.getElementById('viet').textContent = viet;

    correctAnswer = hanViet; // Lưu đáp án đúng
    document.getElementById('answerInput').value = ''; // Xóa ô nhập đáp án
    document.getElementById('resultMessage').textContent = ''; // Xóa thông báo kết quả

    showingFront = true;
    document.querySelector('.card-front').classList.add('active');
    document.querySelector('.card-back').classList.remove('active');
}

function flipCard() {
    showingFront = !showingFront;

    if (showingFront) {
        document.querySelector('.card-front').classList.add('active');
        document.querySelector('.card-back').classList.remove('active');
    } else {
        document.querySelector('.card-front').classList.remove('active');
        document.querySelector('.card-back').classList.add('active');
    }
}

function nextCard() {
    currentIndex = (currentIndex + 1) % vocabList.length;
    showCard();
}

function checkAnswer() {
    const userAnswer = document.getElementById('answerInput').value.trim().toLowerCase();
    const correctAnswerTrimmed = correctAnswer.trim().toLowerCase();

    if (userAnswer === correctAnswerTrimmed) {
        document.getElementById('resultMessage').textContent = 'Đáp án chính xác!';
        document.getElementById('resultMessage').style.color = '#5bc0de'; // Màu xanh cho thông báo đúng
    } else {
        document.getElementById('resultMessage').textContent = 'Đáp án sai';
        document.getElementById('resultMessage').style.color = '#d9534f'; // Màu đỏ cho thông báo sai
    }
}
