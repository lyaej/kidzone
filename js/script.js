// ==================== Game State ====================
let studentName = '';
let answers = {};               // store answers keyed by activity-question
let score = 0;
let selectedColor = null;       // color name
let selectedColorHex = null;    // color hex for hue mapping

// ==================== Activity Data ====================
// (generic placeholder PNG paths; replace with your actual files)
const wordMatchingData = [
    { word: 'cat', correctIndex: 2, images: ['./assets/icon/sun.png', './assets/icon/moon.png', './assets/icon/cat.png'] },
    { word: 'den', correctIndex: 1, images: ['./assets/icon/book.png', './assets/icon/den.png', './assets/icon/duck.png'] },
    { word: 'pin', correctIndex: 0, images: ['./assets/icon/pin.png', './assets/icon/ant.png', './assets/icon/bed.png'] },
    { word: 'box', correctIndex: 0, images: ['./assets/icon/box.png', './assets/icon/rabbit.png', './assets/icon/window.png'] },
    { word: 'run', correctIndex: 1, images: ['./assets/icon/bike.png', './assets/icon/run.png', './assets/icon/car.png'] },
    { word: 'dot', correctIndex: 2, images: ['./assets/icon/treasure-chest.png', './assets/icon/color-wheel.png', './assets/icon/dot.png'] }
];

const colorMatchingData = [
    { color: 'blue', flower: './assets/color/blue.png', options: [{name: 'blue', image: './assets/color/blue.png'}, {name: 'black', image: './assets/color/black.png'}] },
    { color: 'red', flower: './assets/color/red.png', options: [{name: 'white', image: './assets/color/white.png'}, {name: 'red', image: './assets/color/red.png'}] },
    { color: 'yellow', flower: './assets/color/yellow.png', options: [{name: 'yellow', image: './assets/color/yellow.png'}, {name: 'purple', image: './assets/color/purple.png'}] },
    { color: 'purple', flower: './assets/color/purple.png', options: [{name: 'brown', image: './assets/color/brown.png'}, {name: 'purple', image: './assets/color/purple.png'}] },
    { color: 'pink', flower: './assets/color/pink.png', options: [{name: 'blue', image: './assets/color/blue.png'}, {name: 'pink', image: './assets/color/pink.png'}] }
];

const countingData = [
    { items: 'heart', count: 8, correctAnswer: 8 },
    { items: 'star', count: 7, correctAnswer: 7 },
    { items: 'pencil', count: 3, correctAnswer: 3 },
    { items: 'cap', count: 2, correctAnswer: 2 },
    { items: 'music', count: 3, correctAnswer: 3 },
    { items: 'water', count: 6, correctAnswer: 6 },
    { items: 'cupcake', count: 3, correctAnswer: 3 },
    { items: 'soccer', count: 1, correctAnswer: 1 }
];

const crayonColoringData = [
    { name: 'red', correctColor: 'red' },
    { name: 'purple', correctColor: 'purple' },
    { name: 'blue', correctColor: 'blue' },
    { name: 'pink', correctColor: 'pink' },
    { name: 'green', correctColor: 'green' },
    { name: 'black', correctColor: 'black' },
    { name: 'yellow', correctColor: 'yellow' },
    { name: 'brown', correctColor: 'brown' },
    { name: 'orange', correctColor: 'orange' },
    { name: 'white', correctColor: 'white' }
];

const availableColors = [
    { name: 'red', hex: '#ef4444' },
    { name: 'blue', hex: '#3b82f6' },
    { name: 'yellow', hex: '#fde047' },
    { name: 'green', hex: '#22c55e' },
    { name: 'purple', hex: '#a855f7' },
    { name: 'pink', hex: '#ec4899' },
    { name: 'orange', hex: '#f97316' },
    { name: 'brown', hex: '#92400e' },
    { name: 'black', hex: '#000000' },
    { name: 'white', hex: '#ffffff' }
];

const coloringData = crayonColoringData.map(item => ({
    name: item.name,
    image: `./assets/coloring/${item.name}.png`,
    correctColor: item.correctColor
}));

const redWorksheetData = [
    { name: "apple", correct: true, svg: "./assets/act5/apple.svg" },
    { name: "cow", correct: false, svg: "./assets/act5/cow.svg" },
    { name: "crab", correct: true, svg: "./assets/act5/crab.svg" },
    { name: "goose", correct: false, svg: "./assets/act5/goose.svg" },
    { name: "cherries", correct: true, svg: "./assets/act5/cherry.svg" },
    { name: "goat", correct: false, svg: "./assets/act5/goat.svg" },
    { name: "strawberry", correct: true, svg: "./assets/act5/strawberry.svg" },
    { name: "heart", correct: true, svg: "./assets/act5/heart.svg" }
];



// ==================== Init ====================
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    renderAllActivities();
    // show first page (welcome) by default
});

// ==================== Setup Event Listeners ====================
function setupEventListeners() {
    const nameInput = document.getElementById('studentName');
    const startButton = document.getElementById('startButton');
    const nextButton = document.getElementById('nextButton');
    const playAgainButton = document.getElementById('playAgainButton');

    if (nameInput) {
        nameInput.addEventListener('input', e => {
            const name = e.target.value.trim();
            if (name) startButton.classList.remove('hidden'), startButton.classList.add('pulse');
            else startButton.classList.add('hidden'), startButton.classList.remove('pulse');
        });

        nameInput.addEventListener('keypress', e => {
            if (e.key === 'Enter' && e.target.value.trim()) startLearning();
        });
    }

    if (startButton) startButton.addEventListener('click', startLearning);
    if (nextButton) nextButton.addEventListener('click', handleNextActivity);
    if (playAgainButton) playAgainButton.addEventListener('click', resetGame);
}

// ==================== Page functions ====================
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const el = document.getElementById(pageId);
    if (el) el.classList.add('active');
}

function startLearning() {
    const nameEl = document.getElementById('studentName');
    if (!nameEl) return;
    studentName = nameEl.value.trim();
    if (!studentName) return;
    const greeting = document.getElementById('studentGreeting');
    if (greeting) greeting.textContent = studentName;
    showPage('activitiesPage');

    // set activity counter to first visible activity
    updateActivityCounterToFirst();
}

// find first .activity and make it active
function updateActivityCounterToFirst() {
    const activities = Array.from(document.querySelectorAll('.activity'));
    activities.forEach(a => a.classList.remove('active-activity'));
    if (activities.length === 0) return;
    activities[0].classList.add('active-activity');
    updateActivityNumberDisplay();
}

// get index of current active activity (0-based)
function getActiveActivityIndex() {
    const activities = Array.from(document.querySelectorAll('.activity'));
    return activities.findIndex(a => a.classList.contains('active-activity'));
}

function updateActivityNumberDisplay() {
    const idx = getActiveActivityIndex();
    const total = document.querySelectorAll('.activity').length;
    const display = document.getElementById('currentActivityNum');
    if (display) display.textContent = total === 0 ? '0' : (idx + 1).toString();
}

// ==================== Render all activities ====================
function renderAllActivities() {
    renderWordMatching();
    renderColorMatching();
    renderCounting();
    renderColoring();
    renderRedWorksheet();
}

// ---------------- Word Matching ----------------
function renderWordMatching() {
    const container = document.getElementById('wordMatchingContainer');
    if (!container) return;
    container.innerHTML = '';

    wordMatchingData.forEach((item, qIdx) => {
        const row = document.createElement('div');
        row.className = 'word-row';

        const wordLabel = document.createElement('div');
        wordLabel.className = 'word-label';
        wordLabel.textContent = item.word;
        row.appendChild(wordLabel);

        const optionsDiv = document.createElement('div');
        optionsDiv.className = 'image-options';

        item.images.forEach((imgPath, i) => {
            const btn = document.createElement('button');
            btn.className = 'image-button';
            btn.dataset.questionId = qIdx;
            btn.dataset.imageIdx = i;

            const img = document.createElement('img');
            img.src = imgPath;
            img.alt = item.word;
            img.className = 'option-image';
            btn.appendChild(img);

            btn.addEventListener('click', () => checkWordAnswer(qIdx, i));
            optionsDiv.appendChild(btn);
        });

        row.appendChild(optionsDiv);
        container.appendChild(row);
    });
}

function checkWordAnswer(questionIdx, selectedIdx) {
    const key = `word-${questionIdx}`;
    if (answers[key]) return; // already answered
    const correctIdx = wordMatchingData[questionIdx].correctIndex;
    const isCorrect = selectedIdx === correctIdx;
    answers[key] = { answer: selectedIdx, isCorrect };
    if (isCorrect) score++;

    const buttons = document.querySelectorAll(`[data-question-id="${questionIdx}"]`);
    buttons.forEach((btn, i) => {
        btn.disabled = true;
        if (i === selectedIdx) btn.classList.add(isCorrect ? 'correct' : 'incorrect');
        else if (i === correctIdx) btn.classList.add('show-correct');
    });
}

// ---------------- Color Matching ----------------
function renderColorMatching() {
    const container = document.getElementById('colorMatchingContainer');
    if (!container) return;
    container.innerHTML = '';

    colorMatchingData.forEach((item, qIdx) => {
        const row = document.createElement('div');
        row.className = 'color-row';

        const flowerImg = document.createElement('img');
        flowerImg.src = item.flower;
        flowerImg.alt = item.color;
        flowerImg.className = 'flower-icon';
        row.appendChild(flowerImg);

        const optionsDiv = document.createElement('div');
        optionsDiv.className = 'color-options';

        item.options.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'color-button';
            btn.textContent = opt.name;
            btn.dataset.colorQuestionId = qIdx;
            btn.dataset.colorOption = opt.name;
            btn.addEventListener('click', () => checkColorAnswer(qIdx, opt.name));
            optionsDiv.appendChild(btn);
        });

        row.appendChild(optionsDiv);
        container.appendChild(row);
    });
}

function checkColorAnswer(questionIdx, selectedOption) {
    const key = `color-${questionIdx}`;
    if (answers[key]) return;
    const correct = colorMatchingData[questionIdx].color;
    const isCorrect = selectedOption === correct;
    answers[key] = { answer: selectedOption, isCorrect };
    if (isCorrect) score++;

    const buttons = document.querySelectorAll(`[data-color-question-id="${questionIdx}"]`);
    buttons.forEach(btn => {
        btn.disabled = true;
        const option = btn.dataset.colorOption;
        if (option === selectedOption) btn.classList.add(isCorrect ? 'correct' : 'incorrect');
        else if (option === correct) btn.classList.add('show-correct');
    });
}

// ---------------- Counting ----------------
function renderCounting() {
    const container = document.getElementById('countingContainer');
    if (!container) return;
    container.innerHTML = '';

    const grid = document.createElement('div');
    grid.className = 'counting-grid';

    countingData.forEach((item, qIdx) => {
        const card = document.createElement('div');
        card.className = 'counting-card';

        const itemsDiv = document.createElement('div');
        itemsDiv.className = 'counting-items';

        for (let i = 0; i < item.count; i++) {
            const img = document.createElement('img');
            img.src = `./assets/count/${item.items}.png`;
            img.alt = item.items;
            img.className = 'counting-item-image';
            itemsDiv.appendChild(img);
        }

        const inputSection = document.createElement('div');
        inputSection.className = 'counting-input-section';

        const input = document.createElement('input');
        input.type = 'number';
        input.min = 0;
        input.max = 99;
        input.className = 'counting-input';
        input.dataset.countingQuestionId = qIdx;
        input.addEventListener('change', e => checkCountingAnswer(qIdx, parseInt(e.target.value, 10)));

        const resultIcon = document.createElement('span');
        resultIcon.className = 'result-icon';
        resultIcon.dataset.resultIcon = qIdx;

        inputSection.appendChild(input);
        inputSection.appendChild(resultIcon);

        card.appendChild(itemsDiv);
        card.appendChild(inputSection);
        grid.appendChild(card);
    });

    container.appendChild(grid);
}

function checkCountingAnswer(qIdx, value) {
    const key = `count-${qIdx}`;
    if (answers[key]) return;
    const correct = countingData[qIdx].correctAnswer;
    const isCorrect = value === correct;
    answers[key] = { answer: value, isCorrect };
    if (isCorrect) score++;

    const input = document.querySelector(`[data-counting-question-id="${qIdx}"]`);
    const icon = document.querySelector(`[data-result-icon="${qIdx}"]`);
    if (input) input.disabled = true;
    if (input) input.classList.add(isCorrect ? 'correct' : 'incorrect');
    if (icon) icon.textContent = isCorrect ? '✅' : '❌';
}

// ---------------- Coloring ----------------
function renderColoring() {
    const container = document.getElementById('coloringContainer');
    if (!container) return;
    container.innerHTML = '';

    // palette
    const palette = document.createElement('div');
    palette.className = 'color-palette';
    const paletteTitle = document.createElement('div');
    paletteTitle.className = 'palette-title';
    paletteTitle.textContent = 'Choose a color:';
    palette.appendChild(paletteTitle);

    const colorsDiv = document.createElement('div');
    colorsDiv.className = 'color-swatches';
    availableColors.forEach(color => {
        const swatch = document.createElement('button');
        swatch.className = 'color-swatch';
        swatch.style.backgroundColor = color.hex;
        swatch.dataset.colorName = color.name;
        swatch.dataset.colorHex = color.hex;
        swatch.title = color.name;
        swatch.addEventListener('click', () => selectColor(color.name, color.hex));
        colorsDiv.appendChild(swatch);
    });
    palette.appendChild(colorsDiv);
    container.appendChild(palette);

    // grid of crayon SVGs
    const grid = document.createElement('div');
    grid.className = 'crayons-grid';

    coloringData.forEach((item, qIdx) => {
        const card = document.createElement('div');
        card.className = 'crayon-card';

        // wrapper (clickable)
        const svgWrapper = document.createElement('div');
        svgWrapper.className = 'crayon-svg-wrapper';
        svgWrapper.dataset.coloringIdx = qIdx;

        // Inline SVG (outline) — this is the uncolored crayon template
        svgWrapper.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 80" class="crayon-svg" role="img" aria-label="${item.name}">
                        <rect class="crayon-body" x="30" y="20" width="140" height="40" fill="#ffffff" stroke="#000" stroke-width="3"/>
            <polygon class="crayon-body" points="30,20 10,40 30,60" fill="#ffffff" stroke="#000" stroke-width="3"/>
            <rect x="170" y="25" width="15" height="30" fill="#ffffff" stroke="#000" stroke-width="3"/>
            <line x1="50" y1="25" x2="50" y2="55" stroke="#000" stroke-width="3"/>
            <line x1="150" y1="25" x2="150" y2="55" stroke="#000" stroke-width="3"/>
            <ellipse class="crayon-body" cx="100" cy="40" rx="35" ry="14" fill="#ffffff" stroke="#000" stroke-width="3"/>
        </svg>
        `;

        // clicking wrapper colors the SVG
        svgWrapper.addEventListener('click', () => colorPicture(qIdx));

        // result label
        const label = document.createElement('div');
        label.className = 'crayon-result';
        label.dataset.coloringResult = qIdx;
        label.textContent = item.name;

        card.appendChild(svgWrapper);
        card.appendChild(label);
        grid.appendChild(card);
    });

    container.appendChild(grid);
}

function selectColor(name, hex) {
    selectedColor = name;
    selectedColorHex = hex;
    document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('selected-color'));
    const el = document.querySelector(`[data-color-name="${name}"]`);
    if (el) el.classList.add('selected-color');
}

function colorPicture(qIdx) {
    if (!selectedColor || !selectedColorHex) {
        window.alert('Please select a color first!');
        return;
    }

    const key = `coloring-${qIdx}`;
    if (answers[key]) return; // already answered

    const correct = coloringData[qIdx].correctColor;
    const isCorrect = selectedColor === correct;
    answers[key] = { answer: selectedColor, isCorrect };
    if (isCorrect) score++;

    // find wrapper svg
    const wrapper = document.querySelector(`[data-coloring-idx="${qIdx}"]`);
    const label = document.querySelector(`[data-coloring-result="${qIdx}"]`);

    if (wrapper) {
        const svg = wrapper.querySelector('svg');
        if (svg) {
            // directly set fill on all parts we want colored
            const parts = svg.querySelectorAll('.crayon-body');
            parts.forEach(el => {
                // set fill to hex (exact color)
                el.setAttribute('fill', selectedColorHex);
            });

            // optionally keep stroke black for outline clarity
            const outlines = svg.querySelectorAll('[stroke]');
            outlines.forEach(o => o.setAttribute('stroke', '#000000'));
        
            // Disable further clicks on this wrapper
            wrapper.style.pointerEvents = 'none';
        }
    }

    if (label) {
        label.textContent = isCorrect ? '✅ Correct!' : `❌ Try ${correct}`;
        label.className = `crayon-result ${isCorrect ? 'correct-crayon' : 'incorrect-crayon'}`;
    }
}


// helper maps color hex to a hue-rotate angle for visual effect
function getHueRotation(hex) {
    const map = {
        '#ef4444': 0,    // red
        '#3b82f6': 220,  // blue
        '#fde047': 60,   // yellow
        '#22c55e': 120,  // green
        '#a855f7': 280,  // purple
        '#ec4899': 330,  // pink
        '#f97316': 30,   // orange
        '#92400e': 25,   // brown
        '#000000': 0,    // black (no hue)
        '#ffffff': 0     // white (no hue)
    };
    return map[hex] ?? 0;
}

// ----------------- Red Color -----------------------
function renderRedWorksheet() {
    const container = document.getElementById("redWorksheetContainer");
    container.innerHTML = "";

        // palette
    const palette = document.createElement('div');
    palette.className = 'color-palette';
    const paletteTitle = document.createElement('div');
    paletteTitle.className = 'palette-title';
    paletteTitle.textContent = 'Choose a color:';
    palette.appendChild(paletteTitle);

    const colorsDiv = document.createElement('div');
    colorsDiv.className = 'color-swatches';
    availableColors.forEach(color => {
        const swatch = document.createElement('button');
        swatch.className = 'color-swatch';
        swatch.style.backgroundColor = color.hex;
        swatch.dataset.colorName = color.name;
        swatch.dataset.colorHex = color.hex;
        swatch.title = color.name;
        swatch.addEventListener('click', () => selectColor(color.name, color.hex));
        colorsDiv.appendChild(swatch);
    });

    palette.appendChild(colorsDiv);
    container.appendChild(palette);

    const grid = document.createElement("div");
    grid.style.display = "grid";
    grid.style.gridTemplateColumns = "repeat(auto-fit, minmax(160px, 1fr))";
    grid.style.gap = "1.5rem";

    redWorksheetData.forEach((item, i) => {
        const card = document.createElement("div");
        card.style.textAlign = "center";

        const img = document.createElement("img");
        img.src = item.svg;
        img.dataset.redIndex = i;
        img.style.width = "120px";
        img.style.cursor = "pointer";
        img.style.transition = "0.3s";

        img.addEventListener("click", () => clickRedObject(i));

        const label = document.createElement("div");
        label.textContent = item.name;

        card.appendChild(img);
        card.appendChild(label);
        grid.appendChild(card);
    });

    container.appendChild(grid);
}

function clickRedObject(index) {
    const key = `red-${index}`;
    if (answers[key]) return; // already answered

    if (!selectedColor) {
        alert("Please select a color!");
        return;
    }

    const obj = redWorksheetData[index];
    const img = document.querySelector(`[data-red-index="${index}"]`);
    const isCorrectColorSelected = selectedColor === "red";

    // Only score/attempt to color if the selected color is 'red'
    if (isCorrectColorSelected) {
        // A correct answer means: the object is meant to be red AND the user selected red.
        const isCorrect = obj.correct;
        
        // Store the answer, including the "false" case for incorrect clicks with 'red'
        answers[key] = { answer: selectedColor, isCorrect };
        if (isCorrect) score++;

        // Apply visual feedback and 'coloring'
        img.style.background = "#f70000ff"; // Set a red background
        img.style.borderRadius = "49%";
        
        // Visual confirmation: green for correct, red shadow for incorrect
        img.style.filter = isCorrect
            ? "drop-shadow(0 0 15px limegreen)"
            : "drop-shadow(0 0 15px red)";

        // Disable future clicks on this image once scored
        img.style.pointerEvents = 'none';

    } else {
        // User didn't select red. Inform them.
        alert("The instruction is to color the objects that should be RED. Please select the 'red' crayon.");
    }
}


// ==================== Navigation ====================
// advance to next visible activity in DOM order
function handleNextActivity() {
    const activities = Array.from(document.querySelectorAll('.activity'));
    if (!activities.length) return;

    const currentIndex = getActiveActivityIndex();
    
    // If already on the last activity and user clicked, show results
    if (currentIndex === activities.length - 1) {
        showResults();
        return;
    }

    // hide current
    if (currentIndex >= 0) activities[currentIndex].classList.remove('active-activity');

    const nextIndex = Math.min(currentIndex + 1, activities.length - 1);
    activities[nextIndex].classList.add('active-activity');

    // update counter display (1-based)
    const counter = document.getElementById('currentActivityNum');
    if (counter) counter.textContent = (nextIndex + 1).toString();

    // change button text if new index is the last
    const btn = document.getElementById('nextButton');
    if (btn) {
        if (nextIndex === activities.length - 1) btn.textContent = 'See Score';
        else btn.textContent = '➡️ Next Activity';
    }
}

// ==================== Results ====================
function showResults() {
    // compute total questions (sum of all items that expect answers)
const total = wordMatchingData.length +
              colorMatchingData.length +
              countingData.length +
              coloringData.length +
              redWorksheetData.length;
    const percent = total === 0 ? 0 : Math.round((score / total) * 100);

    const finalScoreEl = document.getElementById('finalScore');
    const totalQuestionsEl = document.getElementById('totalQuestions');
    const encouragementEl = document.getElementById('encouragementMessage');
    const nameEl = document.getElementById('studentResultName');

    if (finalScoreEl) finalScoreEl.textContent = score;
    if (totalQuestionsEl) totalQuestionsEl.textContent = total;
    if (nameEl) nameEl.textContent = studentName;
    if (encouragementEl) {
        let msg = 'Keep trying! You can do it!';
        if (percent >= 90) msg = '🏆 Outstanding! You are a superstar!';
        else if (percent >= 70) msg = '⭐ Great job! Keep up the good work!';
        else if (percent >= 50) msg = '👍 Good effort! Practice makes perfect!';
        encouragementEl.textContent = msg;
    }

    showPage('resultsPage');
}

// ==================== Reset ====================
function resetGame() {
    studentName = '';
    answers = {};
    score = 0;
    selectedColor = null;
    selectedColorHex = null;

    const nameInput = document.getElementById('studentName');
    if (nameInput) nameInput.value = '';
    const startBtn = document.getElementById('startButton');
    if (startBtn) startBtn.classList.add('hidden');

    // reset activity UI: first activity active
    updateActivityCounterToFirst();
    renderAllActivities();
    showPage('welcomePage');

    // reset next button text
    const btn = document.getElementById('nextButton');
    if (btn) btn.textContent = '➡️ Next Activity';
}
