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
        formattedQue["choice" + index + 1] = choice;
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

startQuiz = () => {
  // initializing question counter and score as 0
  questionCounter = 0;
  score = 0;
  availableQuizQuestions = [...questions];
  getNewQuestion();
  quiz.classList.remove("hidden");
  loader.classList.add("hidden");
};
