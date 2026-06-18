'use client'
import { useState } from "react";
import { getAllQuiz, Quiz } from "@/service/quizService";

import StartView from "@/components/StartView";
import ResultView from "@/components/ResultView";
import QuizCardView from "@/components/QuizCardView";

interface Answer {
    userAnswer: number;
    answer: string;
    time: number;
    correct: boolean;
}

export default function Home() {
    const [quizs, setQuizs] = useState<Quiz[]>([]);
    const [start, setStart] = useState(false);
    const [isAnime, setIsAnime] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<Answer[]>([]);
    const [isFinished, setIsFinished] = useState(false);
    const [hp, setHp] = useState(3);
    const [combo, setCombo] = useState(0);
    const [isGameOver, setIsGameOver] = useState(false);

    const startButtonHandler = async (selectedQuiz: string) => {
        if (selectedQuiz.length === 0) {
            return alert("단계를 선택해주세요");
        }
        try {
            const result = await getAllQuiz(selectedQuiz);
            setQuizs(result);
            setStart(true);
        } catch (e) {
            console.log(e);
        }
    };

    const nextQuizButtonHandler = (userAnswer: number | null, time: number) => {
        const answer = quizs[currentIndex].answer;
        const correct = userAnswer !== null && userAnswer == (answer as unknown as number);

        const newHp = correct ? hp : hp - 1;
        const newCombo = correct ? combo + 1 : 0;

        setHp(newHp);
        setCombo(newCombo);
        setAnswers((s) => [
            ...s,
            { userAnswer: userAnswer ?? 0, answer, time, correct },
        ]);

        if (newHp <= 0) {
            setIsGameOver(true);
            setIsFinished(true);
        } else if (currentIndex >= quizs.length - 1) {
            setIsFinished(true);
        } else {
            setCurrentIndex((s) => s + 1);
        }
    };

    const currentQuiz = quizs[currentIndex];

    const score = answers.reduce((acc, x) => (x.correct ? acc + 100 / quizs.length : acc), 0);
    const time = answers.reduce((acc, x) => acc + x.time, 0);

    return (
        <div className="h-screen relative flex justify-center items-center w-full">
            {!isAnime && (
                <div
                    onAnimationEnd={() => setIsAnime(true)}
                    className="w-full h-full relative flex items-center justify-center"
                >
                    <StartView start={start} startButtonHandler={startButtonHandler} />
                </div>
            )}

            {isAnime && !isFinished && (
                <QuizCardView
                    key={currentIndex}
                    quiz={currentQuiz}
                    nextQuizButtonHandler={nextQuizButtonHandler}
                    currentIndex={currentIndex}
                    total={quizs.length}
                    hp={hp}
                    combo={combo}
                />
            )}

            {isFinished && (
                <ResultView time={time} score={score} hp={hp} isGameOver={isGameOver} />
            )}
        </div>
    );
}
