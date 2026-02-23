// ----------------------------
// SETTINGS
// ----------------------------
const QUESTIONS_PER_ROW = 3;

// ----------------------------
// FULL QUESTION POOL — YKI Suomi (B1, some B2)
// Cases, verb forms, vowel harmony, passive, conditional,
// idioms, negation, partitive, possessives, vocabulary
// ----------------------------
const INLINE_TEST_QUESTIONS = [
  {
    q: "«Juon _____ joka aamu.» Mikä muoto on oikein?",
    a: [
      "kahvia",
      "kahvi",
      "kahvilla"
    ],
    correct: 0
  },
  {
    q: "«Eilen me _____ elokuvassa.» Valitse oikea muoto.",
    a: [
      "kävimme",
      "käymme",
      "kävisimme"
    ],
    correct: 0
  },
  {
    q: "«Jos minulla olisi enemmän aikaa, _____ enemmän.» Täydennä.",
    a: [
      "harjoittelisin",
      "harjoittelen",
      "harjoittelin"
    ],
    correct: 0
  },
  {
    q: "«Hän meni _____ .» Mikä sijamuoto sopii sanaan 'kauppa'?",
    a: [
      "kauppaan",
      "kaupassa",
      "kaupasta"
    ],
    correct: 0
  },
  {
    q: "Mitä tarkoittaa ilmaisu «ottaa lusikka kauniiseen käteen»?",
    a: [
      "Myöntää häviö ja tehdä kompromissi",
      "Ottaa lisää ruokaa",
      "Olla kohtelias vieraita kohtaan"
    ],
    correct: 0
  },
  {
    q: "«Minulla _____ autoa.» Valitse oikea kieltomuoto.",
    a: [
      "ei ole",
      "en ole",
      "ei on"
    ],
    correct: 0
  },
  {
    q: "«Hän asuu Helsingiss_____ .» Mikä vokaali kuuluu vokaalisointusääntöön?",
    a: [
      "ä",
      "a",
      "e"
    ],
    correct: 0
  },
  {
    q: "«En osta _____ tänään.» Valitse oikea partitiivi.",
    a: [
      "leipää",
      "leipä",
      "leivälle"
    ],
    correct: 0
  },
  {
    q: "«Kirje _____ eilen.» Valitse oikea passiivimuoto.",
    a: [
      "lähetettiin",
      "lähetti",
      "lähettää"
    ],
    correct: 0
  },
  {
    q: "«Tämä on _____ .» (minun kirja) Valitse oikea possessiivirakenne.",
    a: [
      "minun kirjani",
      "minun kirja",
      "kirja minun"
    ],
    correct: 0
  },
  {
    q: "«Luin _____ eilen loppuun.» (koko kirja) Valitse oikea akkusatiivi.",
    a: [
      "kirjan",
      "kirjaa",
      "kirjassa"
    ],
    correct: 0
  },
  {
    q: "«Olen tyytyväinen _____ .» Mikä sijamuoto on oikein?",
    a: [
      "työhöni",
      "työtäni",
      "työssäni"
    ],
    correct: 0
  },
  {
    q: "«Minulla on kolme _____ .» (lapsi) Valitse oikea partitiivi.",
    a: [
      "lasta",
      "lapsi",
      "lapsia"
    ],
    correct: 0
  },
  {
    q: "«Hän puhuu _____ koko ajan.» (työ) Mikä sijamuoto on oikein?",
    a: [
      "työstä",
      "työtä",
      "töissä"
    ],
    correct: 0
  },
  {
    q: "Mitä tarkoittaa «pitää pää kylmänä»?",
    a: [
      "Pysyä rauhallisena paineen alla",
      "Olla kylmässä paikassa",
      "Olla välinpitämätön"
    ],
    correct: 0
  },
  {
    q: "«Minä _____ kahvilassa eilen.» (istua) Valitse oikea imperfekti.",
    a: [
      "istuin",
      "istusin",
      "istunut"
    ],
    correct: 0
  },
  {
    q: "Mikä on kohteliain tapa pyytää apua suomeksi?",
    a: [
      "Voisitko auttaa minua?",
      "Auta minua!",
      "Sinun pitää auttaa minua."
    ],
    correct: 0
  },
  {
    q: "Mitä tarkoittaa «Ei se mitään»?",
    a: [
      "Se ei haittaa – ei ole tärkeää",
      "En tiedä yhtään mitään",
      "Se ei ole mitään erityistä"
    ],
    correct: 0
  },
  {
    q: "«Suomi on tunnettu _____ .» Mikä sijamuoto sopii sanaan 'sauna'?",
    a: [
      "saunoistaan",
      "saunassaan",
      "saunojaan"
    ],
    correct: 0
  },
  {
    q: "«Hän on kotoisin _____ .» (Turku) Mikä sijamuoto on oikein?",
    a: [
      "Turusta",
      "Turussa",
      "Turkuun"
    ],
    correct: 0
  }
];

// ----------------------------
// SHUFFLE — runs before DOM logic
// ----------------------------
function shuffleAnswers(question) {
  const combined = question.a.map((opt, index) => ({
    text: opt,
    isCorrect: index === question.correct
  }));
  for (let i = combined.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [combined[i], combined[j]] = [combined[j], combined[i]];
  }
  question.a = combined.map(item => item.text);
  question.correct = combined.findIndex(item => item.isCorrect);
}

INLINE_TEST_QUESTIONS.forEach(q => shuffleAnswers(q));

// ----------------------------
// BUILD ROWS (after shuffle so object references are stable)
// ----------------------------
const rows = [];
for (let i = 0; i < INLINE_TEST_QUESTIONS.length; i += QUESTIONS_PER_ROW) {
  rows.push(INLINE_TEST_QUESTIONS.slice(i, i + QUESTIONS_PER_ROW));
}

// ----------------------------
// ALL DOM LOGIC INSIDE DOMContentLoaded
// ----------------------------
document.addEventListener("DOMContentLoaded", function () {

  const totalQuestions    = INLINE_TEST_QUESTIONS.length;
  let correctCount        = 0;
  let wrongCount          = 0;
  let answeredCount       = 0;
  let currentRow          = 0;

  const rowAnsweredCounts = new Array(rows.length).fill(0);

  const container = document.getElementById("inline-test-questions");
  if (!container) {
    console.error("hometest-ykifinnish: #inline-test-questions not found in DOM.");
    return;
  }

  // ----------------------------
  // PROGRESS
  // ----------------------------
  function updateProgressDisplay() {
    const el = document.getElementById("inline-progress-text");
    if (el) el.textContent = "Edistyminen: " + answeredCount + " / " + totalQuestions + " kysymystä";
  }

  function updateProgressBar() {
    const bar = document.getElementById("inline-progressbar");
    if (bar) bar.style.width = ((answeredCount / totalQuestions) * 100) + "%";
  }

  // ----------------------------
  // END CARD
  // ----------------------------
  function createDonutChart() {
    const pct = Math.round((correctCount / totalQuestions) * 100);
    const C   = 2 * Math.PI * 40;
    return (
      '<div class="donut-wrapper">' +
        '<svg width="120" height="120" viewBox="0 0 100 100">' +
          '<circle cx="50" cy="50" r="40" stroke="#ebe6ff" stroke-width="12" fill="none"></circle>' +
          '<circle cx="50" cy="50" r="40" stroke="#6d4aff" stroke-width="12" fill="none"' +
            ' stroke-dasharray="' + ((pct / 100) * C) + ' ' + ((1 - pct / 100) * C) + '"' +
            ' transform="rotate(-90 50 50)" stroke-linecap="round"></circle>' +
        '</svg>' +
        '<div class="donut-center">' + pct + '%</div>' +
      '</div>'
    );
  }

  function createEndCard() {
    const pct  = Math.round((correctCount / totalQuestions) * 100);
    const card = document.createElement("div");
    card.className = "inline-question-card end-card";
    const title =
      pct >= 80 ? "Erinomainen suoritus!" :
      pct >= 50 ? "Hyvä suoritus!" :
      pct >= 25 ? "Hyvä alku!" :
      "Jatka harjoittelua!";
    card.innerHTML =
      "<h3>" + title + "</h3>" +
      createDonutChart() +
      "<p>Olet nyt kokeillut ilmaisia harjoituskysymyksiä. " +
      "Hanki pääsy <strong>kaikkiin simulaatioihin ja harjoituksiin</strong> yksityiskohtaisine selityksineen.</p>" +
      '<a href="https://civiclearn.com/ykifinnish/checkout" class="hero-primary-btn">Hanki täysi pääsy</a>';
    return card;
  }

  // ----------------------------
  // RENDER
  // ----------------------------
  function renderRow(rowIndex) {
    if (!rows[rowIndex]) return;
    rows[rowIndex].forEach(function (q, offset) {
      var absoluteIndex = rowIndex * QUESTIONS_PER_ROW + offset;
      container.appendChild(createQuestionCard(q, absoluteIndex, rowIndex));
    });
  }

  function createQuestionCard(questionObj, absoluteIndex, rowIndex) {
    var card = document.createElement("div");
    card.className = "inline-question-card";

    var title = document.createElement("h3");
    title.textContent = questionObj.q;
    card.appendChild(title);

    var feedback = document.createElement("div");
    feedback.className = "inline-feedback";

    questionObj.a.forEach(function (opt, i) {
      var btn = document.createElement("button");
      btn.className = "inline-option-btn";
      btn.textContent = opt;

      btn.onclick = function () {
        answeredCount++;
        rowAnsweredCounts[rowIndex]++;
        updateProgressDisplay();
        updateProgressBar();

        var allBtns = card.querySelectorAll("button");
        allBtns.forEach(function (b) { b.disabled = true; });

        if (i === questionObj.correct) {
          correctCount++;
          btn.style.background  = "rgba(24, 160, 110, 0.15)";
          btn.style.borderColor = "#18a06e";
          btn.style.color       = "#14805a";
          feedback.textContent  = "Oikein!";
          feedback.classList.add("inline-correct");
        } else {
          wrongCount++;
          btn.style.background  = "rgba(230, 57, 70, 0.12)";
          btn.style.borderColor = "#e63946";
          btn.style.color       = "#c5303b";
          allBtns[questionObj.correct].style.background  = "rgba(24, 160, 110, 0.15)";
          allBtns[questionObj.correct].style.borderColor = "#18a06e";
          allBtns[questionObj.correct].style.color       = "#14805a";
          feedback.textContent = "Oikea vastaus: " + questionObj.a[questionObj.correct];
          feedback.classList.add("inline-wrong");
        }

        card.appendChild(feedback);

        if (absoluteIndex === totalQuestions - 1) {
          setTimeout(function () { container.appendChild(createEndCard()); }, 300);
          return;
        }

        var rowSize = rows[rowIndex].length;
        if (rowAnsweredCounts[rowIndex] === rowSize) {
          currentRow++;
          setTimeout(function () { renderRow(currentRow); }, 150);
        }
      };

      card.appendChild(btn);
    });

    return card;
  }

  // ----------------------------
  // INIT
  // ----------------------------
  renderRow(0);
  updateProgressDisplay();
  updateProgressBar();

}); // end DOMContentLoaded
