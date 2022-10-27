import { useState } from "react";
import database from "services/database.json";
import { correctAnswer, incorrectAnswer } from "services/Web3Client";

export interface Database {
  questions: Question[];
}

export interface Question {
  id: number;
  question: string;
  answers: Answer[];
}

export interface Answer {
  answer: string;
  correct: boolean;
}

type GameProps = {
  onEndGame: (score: number, totalQuestions: number) => void;
  updateGameBalance: () => void;
};

const Game = ({ onEndGame, updateGameBalance }: GameProps) => {
  const [questionsData, setQuestionsData] = useState<Database>(database);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number>();
  const [score, setScore] = useState(0);

  const handleConfirm = () => {
    if (selectedAnswer !== undefined) {
      const isCorrect =
        questionsData.questions[currentQuestion].answers[selectedAnswer]
          .correct;

      if (isCorrect) {
        correctAnswer().then(() => {
          updateGameBalance();
          setScore(score + 1);

          if (currentQuestion + 1 < questionsData.questions.length) {
            setSelectedAnswer(undefined);
            setCurrentQuestion(currentQuestion + 1);
          } else {
            onEndGame(score + 1, questionsData.questions.length);
          }
        });
      } else {
        incorrectAnswer().then(() => {
          updateGameBalance();
          if (currentQuestion + 1 < questionsData.questions.length) {
            setSelectedAnswer(undefined);
            setCurrentQuestion(currentQuestion + 1);
          } else {
            onEndGame(score, questionsData.questions.length);
          }
        });
      }
    }
  };

  return (
    <div className="container flex flex-col justify-center items-center mx-auto mb-3">
      <h1 className="title text-center text-2xl font-bold mb-6">
        {questionsData.questions[currentQuestion].question}
      </h1>
      <div className="btn-group btn-group-vertical w-1/2">
        {questionsData.questions[currentQuestion].answers.map(
          (answer: Answer, i) => {
            const handleSelectAnswer = () => {
              setSelectedAnswer(i);
            };

            return (
              <input
                key={answer.answer}
                type="radio"
                id="option0"
                name="answer"
                data-title={answer.answer}
                className="btn mt-3"
                onClick={handleSelectAnswer}
              />
            );
          }
        )}
      </div>
      <button
        className="btn btn-info mt-5 w-1/2 hover:bg-sky-600"
        onClick={handleConfirm}
        disabled={selectedAnswer === undefined}
      >
        Confirm answer
      </button>
    </div>
  );
};

export default Game;
