'use client'
import {useEffect, useMemo, useState} from "react";
import {getAllQuiz} from "@/service/quizService";
import {FaArrowCircleRight} from "react-icons/fa";
import {msToTime} from "@/util/msToTime";
import {postRecord} from "@/service/rankingService";


export default function Home() {

    const [quizs, setQuizs] = useState([])
    const [start, setStart] = useState(false)
    const [isAnime, setIsAnime] = useState(false)
    const [currentIndex, setCurrentIndex] = useState(0)
    const [answers, setAnswers] = useState([])
    const [isFinished, setIsFinished] = useState(false)
    const startButtonHandler = async () => {
        const result = await getAllQuiz()
        setQuizs(result)
        setStart(true)
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
                <div onAnimationEnd={() => setIsAnime(true)} className={'w-full  h-full relative flex  justify-center'}>
                    <StartView start={start} startButtonHandler={startButtonHandler}/>
                </div>
            }

            {
                isAnime && !isFinished &&
                <ProblemCardView
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

function StartView({start, startButtonHandler}) {

    return (
        <>
            <button onClick={startButtonHandler} className={`z-50 ${start && 'button-big'} `}>
                <span
                    className="material-symbols-outlined   bg-white  hover:bg-purple-600  hover:shadow-xl hover:-translate-y-3 hover:text-white duration-200  cursor-pointer p-2 rounded-full text-purple-600"
                    style={{fontSize: 100}}>play_arrow</span>
            </button>
            <div className={`absolute inset-0  grid grid-rows-2 `}>
                <div className={`bg-purple-500 ${start && 'door-up'}   border-b-4 border-white duration-500`}>
                </div>
                <div className={`bg-purple-500 ${start && 'door-down'}  border-t-4 border-white duration-500`}>
                </div>

            </div>
        </>
    )
}

function ProblemCardView({quiz, nextQuizButtonHandler, currentIndex, total}) {

    const {title, problems} = quiz
    const [userAnswer, setUserAnswer] = useState(-1)

    const [timer, setTimer] = useState(0)
    useEffect(() => {
        const id = setInterval(() => {
            setTimer(s => s + 10)
        }, 10)
        return () => {
            clearInterval(id)
        }
    }, [])
     const time =msToTime(timer)
    return (

        <div className={'absolute flex flex-col w-full justify-center items-center gap-3 z-50'}>

            <div className={'w-1/3 bg-white rounded-xl flex flex-col gap-4 p-5'}>

                <div className={'flex justify-between'}>
                    <p>{time}</p>
                    <p>{currentIndex + 1}/{total}</p>
                </div>

                <div className={' bg-purple-100 rounded-full'}>
                    <div className={'bg-purple-600 rounded-full p-1 duration-150  z-50'}
                         style={{width: ((currentIndex + 1) / total) * 100 + "%"}}></div>
                </div>
                <p className={'text-3xl font-bold text-center'}>{title}</p>

                <div className={'flex flex-col gap-2'}>

                    {
                        problems.map((problem, i) => {

                            const selected = i === userAnswer - 1

                            return (
                                <button
                                    key={i}
                                    onClick={() => setUserAnswer(i + 1)}
                                    className={`py-3 rounded-xl
                    ${selected ? 'bg-purple-500 text-white' : 'bg-purple-200'}
                    hover:bg-purple-500 hover:text-white duration-150`}
                                >
                                    {problem}
                                </button>
                            )
                        })
                    }

                </div>

            </div>

            <button
                onClick={() => {
                    setUserAnswer(-1)
                    nextQuizButtonHandler(userAnswer, timer)
                }}
                className={`disabled:bg-gray-400 ${userAnswer === -1 ? 'opacity-0' : 'opacity-100'} disabled:cursor-not-allowed cursor-pointer p-1 bg-white rounded-lg  duration-150`}
            >
                <FaArrowCircleRight className={'text-3xl text-purple-500'}/>
            </button>


        </div>
    )
}

function ResultView({score:rawScore, time}) {


    const [name, setName] = useState('')
    const score=Math.round(rawScore )
    const t = msToTime(time)

    const onChangeNameHandler = (e)=>{
        setName(e.target.value)
    }
    const submitRecordHandler=()=>{
        const postData=async ()=>{
            const data={name,time,try:1,score}
            try {
                const result = await postRecord(data)
                console.log(result)
                alert('success')
            }catch(err){
                console.log(err)
                alert('error')
            }
        }
        postData()


    }
    return (
        <div className={' bg-white rounded-2xl p-10  font-bold flex flex-col justify-center items-center gap-5'}>
            <p className={'text-3xl'}>
                걸린 시간:{t}
            </p>
            <p className={'text-2xl'}>
                점수 : {score}
            </p>
            <div className={'flex flex-col gap-2'}>
            <input onChange={onChangeNameHandler} className={'border-2 border-purple-300 rounded-lg p-2 text-center  focus:outline-none'} placeholder={'이름입력 (학년-이름)'}/>
                <button onClick={submitRecordHandler} className={`${name.length===0? 'opacity-0' : 'opacity-100'} bg-purple-500 text-white p-2 rounded-lg w-fit mx-auto`}>저장</button>
            </div>
        </div>
    )
}