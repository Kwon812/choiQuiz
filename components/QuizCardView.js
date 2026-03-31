import {useEffect, useState} from "react";
import {msToTime} from "@/util/msToTime";
import {FaArrowCircleRight} from "react-icons/fa";

export default function QuizCardView({quiz, nextQuizButtonHandler, currentIndex, total}) {

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
    const time = msToTime(timer)
    return (

        <div className={'absolute flex flex-col w-full justify-center items-center gap-3 z-50'}>

            <div className={'w-1/3  min-w-125  bg-white rounded-xl flex flex-col gap-4 p-5'}>

                <div className={'flex justify-between'}>
                    <p>{time}</p>
                    <p>{currentIndex + 1}/{total}</p>
                </div>

                <div className={' bg-purple-100 rounded-full'}>
                    <div className={'bg-purple-600 rounded-full p-1 duration-150  z-50'}
                         style={{width: ((currentIndex + 1) / total) * 100 + "%"}}></div>
                </div>
                <p className={'text-3xl font-bold text-center break-keep'}>{title}</p>

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

            {
                userAnswer!==-1 &&  <button
                    onClick={() => {
                        setUserAnswer(-1)
                        nextQuizButtonHandler(userAnswer, timer)
                    }}
                    className={`  cursor-pointer p-1 bg-white rounded-lg  duration-150`}
                >
                    <FaArrowCircleRight className={'text-3xl text-purple-500'}/>
                </button>
            }



        </div>
    )
}
