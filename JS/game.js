//getting id for dom manipulation

const question = document.getElementById("question");
const choices = Array.from(document.getElementsByClassName("choice-text"));
const progressText = document.getElementById("progressText");
const scoreText = document.getElementById("score");
const progressStatus = document.getElementById("progressStatus");
const quiz = document.getElementById("quiz");

let questions = [];
// creating a empty array for storing copy of all the questions coming from api
let availableQuizQuestions = [];
// current questions object
let currentQuizQuestion = {};
// for delaying when someone answers a question before answering 2nd ques.
let acceptingAnswers = false;
// async await for fetching the questions data from opentdb api
async function getData() {
  try {
    const response = await fetch(
      "https://opentdb.com/api.php?amount=10&category=18&difficulty=medium&type=multiple"
    );
    const responseData = await response.json();
    // console.log(responseData);
    //loading the questions
    questions = responseData.results.map((responsedQue) => {
      //   console.log(responsedQue);
      const formattedQue = {
        question: responsedQue.question,
      };
      const answerChoices = [...responsedQue.incorrect_answers];
      // for displaying the answer in a random postion in anwer choices array in UI
      formattedQue.answer = Math.floor(Math.random() * 4) + 1;
      answerChoices.splice(
        formattedQue.answer - 1,
        0,
        responsedQue.correct_answer
      );
      answerChoices.forEach((choice, index) => {
        formattedQue["choice" + (index + 1)] = choice;
      });
      return formattedQue;
    });
    //for starting quiz
    startQuiz();
    // console.log(typeof questions);
  } catch (err) {
    console.log(err);
  }
}
getData();
// constants for total questions and points on each question
const pointOnCorrectAnswer = 10;
const totalQuestions = 10;

startQuiz = () => {
  // initializing question counter and score as 0
  questionCounter = 0;
  score = 0;
  // copying all the question that are coming from api using spread
  availableQuizQuestions = [...questions];
  // console.log(availableQuizQuestions);
  // to get a new question
  getNewQuestion();
  quiz.classList.remove("hidden");
  loader.classList.add("hidden");
};
// console.log(questions);
getNewQuestion = () => {
  // if all the questions are used
  if (
    availableQuizQuestions.length === 0 ||
    questionCounter >= totalQuestions
  ) {
    // save the most recent score to score variable
    localStorage.setItem("mostRecentScore", score);
    // redirects to the end page
    return window.location.assign("./end.html");
  }
  questionCounter++;
  // update the question counter text
  progressText.innerText = `Question ${questionCounter}/${totalQuestions}`;
  //Update the progress bar
  progressStatus.style.width = `${(questionCounter / totalQuestions) * 100}%`;
  // to display a random question
  const questionIndex = Math.floor(
    Math.random() * availableQuizQuestions.length
  );
  // console.log(availableQuizQuestions);
  currentQuizQuestion = availableQuizQuestions[questionIndex];
  // console.log(currentQuizQuestion);
  question.innerHTML = currentQuizQuestion.question;
  // console.log(choices[0]);
  choices.forEach((choice) => {
    // getiing the number form Data-number
    const number = choice.dataset["number"];
    console.log(choice);
    // console.log(number);
    // to get the choice
    // console.log(currentQuizQuestion);
    choice.innerHTML = currentQuizQuestion["choice" + number];
  });
  // It will take the question from available questions that we have used..
  // So that when we call getNewQuestion() function we should get a new question
  availableQuizQuestions.splice(questionIndex, 1);
  // console.log(availableQuizQuestions);
  acceptingAnswers = true;
};
// grabbing each choices
choices.forEach((choice) => {
  choice.addEventListener("click", (e) => {
    const selectChoice = e.target;
    // console.log(selectChoice);
    if (!acceptingAnswers) return;
    acceptingAnswers = false;
    const selectAnswer = selectChoice.dataset["number"];
    // console.log(selectAnswer);
    console.log(currentQuizQuestion);
    // if answer is correct, then add the correct class, else add the incorrect css class
    const classToApply =
      selectAnswer == currentQuizQuestion.answer ? "correct" : "incorrect";
    // if the answer is correct then increment the score
    if (classToApply === "correct") {
      incrementScore(pointOnCorrectAnswer);
    }

    // console.log(selectChoice.parentElement);
    selectChoice.parentElement.classList.add(classToApply);
    // for removing the the class after a question is answered
    setTimeout(() => {
      selectChoice.parentElement.classList.remove(classToApply);
      // get a new question
      getNewQuestion();
    }, 1000);
  });
});

// increment the score
incrementScore = (num) => {
  score += num;
  scoreText.innerText = score;
};
