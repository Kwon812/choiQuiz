'use client'


import {useEffect, useRef, useState} from "react";
import {deleteQuiz, getAllQuiz, postQuiz, putQuiz} from "@/service/quizService";

export default function EditPage(props) {

    const [form, setForm] = useState({
        title: '',
        problems: [''],
        answer: ''
    })
    const [isEdit, setIsEdit] = useState(null)
    const [cards, setCards] = useState([]);

    const titleRef=useRef(null)
    const addProblem = (e) => {
        e.preventDefault();
        setForm(s => {
            return {
                ...s,
                problems: [...s.problems, '']
            }
        })
    }

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
                    answer: ''
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
        setForm(s => {
            const {name, value} = e.target
            if (name==='problems') {
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
        const {title, problems, answer} = card
        setIsEdit(card.id)
        setForm({title, problems, answer})
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
        <div className={'h-screen grid grid-cols-[1fr_2fr]  bg-purple-200   '}>

            <div className={'h-full flex justify-center items-center p-10  border-r-2  border-gray-100'}>
                <div className={' p-5 rounded-2xl w-full justify-center  shadow-xl  bg-white flex flex-col gap-5'}>
                    <p className={'text-2xl font-bold text-center'}>문제 만들기 입력카드 </p>
                    <form onSubmit={submitFormHandler}>
                        <div className={'flex flex-col gap-3'}>
                            <InputForm titleRef={titleRef} value={form.title} onChange={onChangeInputHandler} name={'title'} title={'문제 제목'}
                                       placeholder={'제목입력'}/>
                            <InputForm value={form.problems} addProblems={addProblem} onChange={onChangeInputHandler}
                                       name={'problems'} title={'보기'} type={'add'} placeholder={'보기입력'}/>
                            <InputForm value={form.answer} onChange={onChangeInputHandler} name={'answer'} title={'정답'}
                                       placeholder={'정답입력 ex)1번일 경우 숫자 1만 입력'}/>
                            <button type={'submit'}
                                    className={'rounded-xl text-white w-fit mx-auto p-2 bg-purple-400 font-bold'}>{isEdit===null?'저장':'수정'}
                            </button>
                        </div>
                    </form>

                </div>
            </div>


            <div className={'  min-h-0  h-full flex gap-3 flex-wrap   items-start overflow-y-auto p-10'}>
                {
                    cards.length===0 ? <p className={'text-2xl font-bold'} >Loading...</p>:
                    cards.map((x, i) => {
                        const {title, problems, answer} = x
                        return (
                            <div key={i}
                                 className={'w-96  relative bg-white shadow-xl rounded-xl flex flex-col gap-3 justify-center items-center p-5'}>
                                <div className={'flex gap-2 absolute right-2 top-1'}>
                                    <button disabled={x.state === 'pending'} className={'cursor-pointer'}
                                            onClick={() => editCardHandler(x)}>edit
                                    </button>
                                    <button disabled={x.state === 'pending'} className={'cursor-pointer'}
                                            onClick={() => deleteCardHandler(x)}>delete
                                    </button>

                                </div>

                                <p className={'text-xl font-bold'}>{title}</p>
                                <div className={'flex flex-col gap-1 w-full'}>
                                    {
                                        problems.map((xx, ii) => {
                                            return <p className={` ${ii+1==x.answer? 'bg-purple-400 text-white': 'bg-purple-200'} text-center p-2 rounded-xl`}
                                                      key={ii}>{xx}</p>
                                        })
                                    }
                                </div>
                                <p className={'text-start w-full '}>정답:{answer}</p>
                            </div>
                        )
                    })
                }


            </div>
        </div>
    )
}

function InputForm({onChange, title, value, placeholder, addProblems, type = 'default', name,titleRef=undefined}) {

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
                                            <div className={'flex'}>
                                                <p className={'text-sm text-gray-600 leading-tight '}>{i + 1}번</p>
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
                        <button onClick={addProblems}
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