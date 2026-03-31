'use client'


import {useEffect, useMemo, useRef, useState} from "react";
import {deleteQuiz, getAllQuiz, postQuiz, putQuiz} from "@/service/quizService";
import Masonry from "react-masonry-css";


export default function EditPage(props) {

    const quizMapper = {
        'filial': '효 퀴즈',
        'media1': '미디어 1단계',
        'media2': '미디어 2단계',
        'media3': '미디어 3단계',
        'media4': '미디어 4단계'
    }

    const breakpointColumnsObj = {
        default: 3,
        1620: 2,
        1024: 1
    };

    const [form, setForm] = useState({
        title: '',
        problems: [''],
        answer: '',
        type: ''
    })
    const [isEdit, setIsEdit] = useState(null)
    const [cards, setCards] = useState([]);

    const titleRef = useRef(null)
    const problemHandler = (e,i=undefined) => {
        e.preventDefault();

        setForm(s => {
            if(!i) {
                return {
                    ...s,
                    problems: [...s.problems, '']
                }
            }
            const temp = [...s.problems]
            temp.splice(i,1)
            return {
                ...s,
                problems: temp
            }
        })
    }

    const quizTypes = useMemo(() => cards.reduce((a, c) => {
        // console.log(a,c)
        const type = c.type
        // console.log(type)
        return a.includes(type) ? [...a] : [...a, type]
    }, []), [cards])
    const selectedCards = useMemo(() => {
        if (form.type.length === 0) {
            return cards
        }
        return cards.filter(x => x.type === form.type)
    }, [form.type, cards])
    // console.log(form)
    const submitFormHandler = async (e) => {
        e.preventDefault()
        const prevCards = [...cards]
        const tempId = Date.now()
        const postOrUpdate = async () => {
            try {
                const result = await (isEdit === null ? postQuiz(form) : putQuiz(form, isEdit))
                if (result?.data) {
                    console.log(result.data)
                    setCards(s => {
                        return s.map(x => x.tempId === tempId ? {...result.data, state: 'done'} : x)
                    })
                }
                setIsEdit(null)
                setForm({
                    title: '',
                    problems: [''],
                    answer: '',
                    type: ''
                })
                titleRef.current.focus()
            } catch (e) {
                setCards(prevCards)
            }
        }

        if (isEdit !== null) {
            setCards(s => {
                const temp = [...s]
                const find = temp.findIndex(x => x.id === isEdit)
                temp[find] = {
                    ...temp[find],
                    ...form
                }

                return temp
            })
        } else {

            setCards(s => [...s, {
                ...form,
                tempId,
                state: 'pending'
            }
            ])
        }

        postOrUpdate()

    }

    const onChangeInputHandler = (e, i) => {
        e.preventDefault()
        setForm(s => {
            const {name, value} = e.target
            if (name === 'problems') {
                let temp = [...s.problems]
                temp[i] = value
                return {
                    ...s,
                    problems: temp
                }
            }
            // if(name==='answer'){
            //     value>s.problems.length+1 && alert('보기 갯수보다 정답이 니다')
            // }
            return {
                ...s,
                [name]: value
            }
        })
    }
    const editCardHandler = (card) => {
        const {title, problems, answer, type} = card
        setIsEdit(card.id)
        setForm({title, problems, answer, type})
    }
    const deleteCardHandler = (card) => {
        const {id} = card
        const prevCards = [...cards]
        const deleteCard = async () => {
            try {
                const result = await deleteQuiz(id)
            } catch (e) {
                console.log(e)
                setCards(prevCards)
            }
        }
        setCards(s => s.filter((x, ii) => x.id !== id))
        deleteCard()

    }

    useEffect(() => {
        const initData = async () => {
            try {

                const result = await getAllQuiz()
                // console.log(result)
                setCards(result)
            } catch (e) {
                console.log(e)
            }
        }
        initData()
    }, [])


    return (
        <div className={'h-screen grid grid-cols-[1fr_2fr]  bg-purple-200  '}>

            <div
                className={'h-full flex justify-center   items-center min-w-full p-10  border-r-2  border-gray-100  justify-items-center'}>


                <div
                    className={' p-5 h-fit rounded-2xl w-full justify-center   shadow-xl  bg-white flex flex-col gap-5'}>

                    <p className={'text-2xl font-bold text-center'}>문제 만들기 입력카드 </p>
                    <form onSubmit={submitFormHandler}>
                        <div className={'flex flex-col gap-3'}>
                            <div className={'flex  flex-wrap gap-2'}>
                                {
                                    quizTypes.map((x, i) => {
                                        return (
                                            <button name={'type'} value={x}
                                                    className={`p-1 px-3  bg-violet-200 rounded-xl duration-150 ${form['type'] === x && 'bg-violet-400 text-white'}`}
                                                    onClick={onChangeInputHandler} key={i}>
                                                {quizMapper[x]}
                                            </button>
                                        )
                                    })
                                }
                                <input onChange={onChangeInputHandler} value={form.type} name={'type'}
                                       className={'border border-violet-300 rounded-xl p-1 px-3'}/>
                            </div>
                            <InputForm titleRef={titleRef} value={form.title} onChange={onChangeInputHandler}
                                       name={'title'} title={'문제 제목'}
                                       placeholder={'제목입력'}/>
                            <InputForm value={form.problems} problemHandler={problemHandler} onChange={onChangeInputHandler}
                                       name={'problems'} title={'보기'} type={'add'} placeholder={'보기입력'}/>
                            <InputForm value={form.answer} onChange={onChangeInputHandler} name={'answer'} title={'정답'}
                                       placeholder={'정답입력 ex)1번일 경우 숫자 1만 입력'}/>
                            <button type={'submit'}
                                    className={'rounded-xl text-white w-fit mx-auto p-2 bg-purple-400 font-bold'}>{isEdit === null ? '저장' : '수정'}
                            </button>
                        </div>
                    </form>

                </div>
            </div>


            {/*<div*/}
            {/*    className={'  min-h-0  w-full h-full flex flex-wrap gap-4  items-end justify-center overflow-y-auto p-10'}>*/}
            <Masonry
                breakpointCols={breakpointColumnsObj}
                className="flex gap-6 h-full overflow-scroll p-10  "
                columnClassName="flex flex-col gap-6"
            >
                {
                    cards.length === 0 ? <p className={'text-2xl font-bold'}>Loading...</p> :
                        selectedCards.map((x, i) => {
                            const {title, problems, answer} = x
                            return (
                                <div key={i}
                                     className={'w-96 h-fit  relative bg-white shadow-xl rounded-xl flex flex-col gap-3 justify-center items-center p-5'}>
                                    <div className={'flex gap-3 absolute right-2 bottom-1 '}>
                                        <button disabled={x.state === 'pending'} className={'cursor-pointer  text-blue-600'}
                                                onClick={() => editCardHandler(x)}>수정
                                        </button>
                                        <button disabled={x.state === 'pending'} className={'cursor-pointer text-red-500 '}
                                                onClick={() => deleteCardHandler(x)}>삭제
                                        </button>

                                    </div>

                                    <p className={'text-xl font-bold'}>{title}</p>
                                    <div className={'flex flex-col gap-1 w-full'}>
                                        {
                                            problems.map((xx, ii) => {
                                                return <p
                                                    className={` ${ii + 1 == x.answer ? 'bg-purple-400 text-white' : 'bg-purple-200'} text-center p-2 rounded-xl`}
                                                    key={ii}>{xx}</p>
                                            })
                                        }
                                    </div>
                                    <p className={'text-start w-full '}>정답:{answer}</p>
                                </div>
                            )
                        })
                }


            </Masonry>
        </div>
    )
}

function InputForm({onChange, title, value, placeholder,problemHandler, type = 'default', name, titleRef = undefined}) {

    return (
        <>
            <div className={'flex flex-col gap-1 '}>
                <p className={'text-gray-800 text-sm font-bold'}>{title}</p>
                {type === 'add' ?
                    <div className={'flex flex-col gap-3 '}>
                        {/*{*/}
                        {/*    console.log("Ensjdn")*/}
                        {/*}*/}
                        <div className={'flex flex-wrap gap-2 '}>
                            {
                                value.map((x, i) => {
                                    return (
                                        <div className={'flex flex-col'} key={i}>
                                            <div className={'flex justify-between'}>
                                                <p className={'text-sm text-gray-600 leading-tight '}>{i + 1}번</p>
                                                {
                                                    i!==0 && <button onClick={(e)=>problemHandler(e,i)} className={'text-sm cursor-pointer text-red-500 mr-1'}>삭제</button>
                                                }

                                            </div>
                                                <input
                                                    value={x}
                                                    onChange={(e) => onChange(e, i)}
                                                    placeholder={placeholder}
                                                    name={name}
                                                    className={'p-2 border  w-60 rounded-lg  border-gray-200 '}/>

                                            </div>

                                    )
                                })
                            }
                        </div>
                        <button onClick={problemHandler}
                                className={'p-1 px-2 border font-bold  rounded-xl  w-fit mx-auto  border-gray-200 '}>추가
                        </button>

                    </div>
                    :
                    <input
                        {...{name, placeholder, value}}

                        ref={titleRef}
                        className={'p-2 border   rounded-lg  border-gray-200 w-full'}
                        onChange={onChange}
                    />
                }

            </div>
        </>
    )
}