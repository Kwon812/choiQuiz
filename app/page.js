'use client'
import {useEffect, useMemo, useState} from "react";
import {getAllQuiz} from "@/service/quizService";

import StartView from "@/components/StartView";
import ResultView from "@/components/ResultView";
import QuizCardView from "@/components/QuizCardView";


export default function Home() {

    const [quizs, setQuizs] = useState([])
    const [start, setStart] = useState(false)
    const [isAnime, setIsAnime] = useState(false)
    const [currentIndex, setCurrentIndex] = useState(0)
    const [answers, setAnswers] = useState([])
    const [isFinished, setIsFinished] = useState(false)
    const startButtonHandler = async (selectedQuiz) => {
        if(selectedQuiz.length===0){
            return alert('단계를 선택해주세요')
        }
        try {
            const result = await getAllQuiz(selectedQuiz)
            setQuizs(result)
            setStart(true)
        }catch (e){
            console.log(e)
        }
    }

    const nextQuizButtonHandler = (userAnswer, time) => {

        console.log(time)
        const answer = quizs[currentIndex].answer
        setAnswers(s => [
            ...s,
            {
                userAnswer,
                answer,
                time,
                correct: userAnswer == answer
            }
        ])

        if (currentIndex < quizs.length - 1) {
            setCurrentIndex(s => s + 1)
        } else {
            setIsFinished(true)
        }

    }

    const currentQuiz = quizs[currentIndex]

    const score = answers.reduce((acc, x) => {
        return x.correct ? acc + 100 / quizs.length : acc
    }, 0)
    const time = answers.reduce((acc, x) => {
        return acc + x.time
    }, 0)

    return (
        <div className={'h-screen relative flex justify-center items-center w-full'}>

            {
                !isAnime &&
                <div onAnimationEnd={() => setIsAnime(true)} className={'w-full  h-full relative flex items-center  justify-center'}>
                    <StartView start={start} startButtonHandler={startButtonHandler}/>
                </div>
            }

            {
                isAnime && !isFinished &&
                <QuizCardView
                    key={currentIndex}
                    quiz={currentQuiz}
                    nextQuizButtonHandler={nextQuizButtonHandler}
                    currentIndex={currentIndex}
                    total={quizs.length}
                />
            }

            {
                isFinished &&
                <ResultView time={time} score={score}/>
            }

        </div>
    )
}


