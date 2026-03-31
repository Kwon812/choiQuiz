import {useState} from "react";

export default function StartView({start, startButtonHandler}) {

    const [selectedQuiz, setSelectedQuiz] = useState('');
    return (
        <>
            <button onClick={()=>startButtonHandler(selectedQuiz)} className={`z-50  h-fit  ${start && 'button-big'} `}>
                <span
                    className="material-symbols-outlined   bg-white   hover:bg-purple-600  hover:shadow-xl hover:-translate-y-3 hover:text-white duration-200  cursor-pointer p-2 rounded-full text-purple-600"
                    style={{fontSize: 100}}>play_arrow</span>
            </button>
            <div className={`absolute inset-0  grid grid-rows-2 `}>
                <div
                    className={`bg-purple-500 ${start && 'door-up'}  items-center flex justify-between border-b-4 border-white duration-500  p-20`}>
                    <div className={'border-white  border-l-2 border-r-2  w-fit  h-fit px-10  p-3 '}>
                        <p className={'text-xl  text-white font-bold mb-5 '}>TODAY'S <span
                            className={'text-yellow-200 text-3xl'}>상품</span></p>
                        <div className={' font-medium  flex flex-col text-lg text-white gap-3'}>
                            <p className={'text-2xl'}>1등 - 문화상품권 5000원</p>
                            <p className={'text-xl'}>2등 - 문화상품권 5000원</p>
                            <p>3등 - 문화상품권 5000원</p>
                        </div>
                    </div>
                    <div className={'bg-white min-w-96 rounded-xl w-1/3  text-center flex flex-col gap-5'}>
                        {/*<p className={'text-xl font-bold '}>퀴즈설정</p>*/}
                        <div className={'grid grid-cols-2 '}>

                            <div className={'flex flex-col gap-5 p-8 border-purple-500 border-r-2'}>
                                <p className={'text-2xl font-bold '}>미디어 탐험대</p>
                                <div className={'grid grid-cols-2 gap-3  '}>
                                    <button className={'cursor-pointer'} onClick={()=>setSelectedQuiz('media1')}>
                                    <p className={`bg-violet-100 leading-tight p-2 ${selectedQuiz==='media1' &&'text-white bg-violet-400' }  text-violet-600 duration-150 rounded-xl`}>1단계 <span className={'block font-bold  '}>안전의정글</span></p>
                                    </button>

                                    <button className={'cursor-pointer'} onClick={()=>setSelectedQuiz('media2')}>
                                    <p className={`bg-violet-100 p-2   leading-tight  ${selectedQuiz==='media2' &&'text-white bg-violet-400' }  text-violet-600 duration-150 rounded-xl`}>2단계 <span className={'block font-bold'}>맹독의늪</span></p>
                                    </button>
                                    <button className={'cursor-pointer'} onClick={()=>setSelectedQuiz('media3')}>
                                    <p className={`bg-violet-100 p-2  leading-tight   ${selectedQuiz==='media3' &&'text-white bg-violet-400' }  text-violet-600 duration-150 rounded-xl`}>3단계 <span className={'block font-bold'}>진실의정글</span></p>
                                    </button>
                                    <button className={'cursor-pointer'} onClick={()=>setSelectedQuiz('media4')}>
                                    <p className={`bg-violet-100 p-2   leading-tight  ${selectedQuiz==='media4' &&'text-white bg-violet-400' } text-violet-600 duration-150  rounded-xl`}>4단계 <span className={'block font-bold'}>규칙의정글</span></p>
                                    </button>
                                </div>
                            </div>
                            <div className={'flex flex-col gap-5 p-8 border-l-2 border-purple-500 '}>
                                <p className={'text-2xl font-bold '}>효문화 탐험대</p>
                                <div className={'grid grid-cols-2 gap-3  '}>
                                    <button className={'cursor-pointer'} onClick={()=>setSelectedQuiz('filial')}>
                                        <p className={`bg-violet-100  text-violet-600 p-2  duration-150 rounded-xl  leading-tight   ${selectedQuiz==='filial' &&'text-white bg-violet-400' } `}>1단계 <span className={'block font-bold  '}>효문화 퀴즈</span></p>
                                    </button>


                                </div>
                            </div>
                        </div>

                    </div>

                </div>
                <div className={`bg-purple-500 ${start && 'door-down'}  border-t-4 border-white duration-500`}>
                </div>

            </div>
        </>
    )
}