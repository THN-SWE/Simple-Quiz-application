const question = document.getElementById("question");
const options = document.getElementById("options");
const option = document.getElementsByClassName("option");
let q_tracker = document.getElementById("q-done");
const pre_btn = document.getElementById("prv-btn");
const nxt_btn = document.getElementById("nxt-btn");
const options_order = shuffleArray([0, 1, 2, 3]);
let score = 0;
const quiz_length = 9; // actual -1
let curr_quiz = 0;
let quizData;
q_tracker.innerHTML = `${curr_quiz + 1}/${quiz_length + 1}`;

// preventing from refreshing(restarting) the page/quiz :)
// Prevent page reload
// Prevent page reload
window.onbeforeunload = function (event) {
  event.preventDefault();
  event.returnValue = "";
  return "Are you sure you want to reload the page? This will restart your quiz.";
};

// Prompt to restart quiz on page reload
window.addEventListener("unload", function () {
  if (
    confirm(
      "Are you sure you want to reload the page? This will restart your quiz."
    )
  ) {
    // Reload the page if the user confirms
    window.location.reload();
  }
});

getQuizData().then((data) => {
  quizData = data;
  console.log(data);
});

// returns quiz data - promise
function getQuizData() {
  return fetch(
    `https://opentdb.com/api.php?amount=${
      quiz_length + 1
    }&category=18&type=multiple`
  )
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      return data;
    })
    .catch((error) => console.error(error + " :error"));
}
//return shuffled array
function shuffleArray(array) {
  for (var i = array.length - 1; i > 0; i--) {
    // Generate random number
    var j = Math.floor(Math.random() * (i + 1));

    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }

  return array;
}

function returnQuestion(n) {
  return quizData.results[n].question;
}

// returns the answer
function returnAnswer(n) {
  return quizData.results[n].correct_answer;
}

// returns an array of options shuffled randomly.
function returnOptions(n) {
  let correct_answer = returnAnswer(n);
  let options = [...quizData.results[n].incorrect_answers, correct_answer];

  return options;
}

function renderQuestionCard() {
  if (curr_quiz === quiz_length + 1) {
    question.innerHTML = `Congradulations! <br> You have scored: <br> ${score} / ${
      quiz_length + 1
    }`;
    options.innerHTML = "";
  }
  question.innerHTML = returnQuestion(curr_quiz);
  // let optionsArray = Array.from(options); // Convert HTMLCollection to array
  for (let i = 0; i < 4; i++) {
    const option_place = options_order[i];

    const opt = document.createElement("p");
    opt.className = "option";
    opt.addEventListener("click", nextQuiz);
    opt.innerHTML = returnOptions(curr_quiz)[option_place];
    options.appendChild(opt);
  }
}

// renderQuestionCard();

function nextQuiz() {
  if (this.textContent === quizData.results[curr_quiz].correct_answer) {
    // console.log("booyah");
    score += 1;
    console.log(score);
  }

  curr_quiz += 1;
  console.log(curr_quiz);
  options.innerHTML = ""; // clearing previous options
  question.innerHTML = "One moment please!";

  q_tracker.innerHTML = curr_quiz + "/" + (quiz_length + 1);

  setTimeout(renderQuestionCard, 3000);
}

setTimeout(renderQuestionCard, 3000);

console.log("Page loaded after 2 seconds");
