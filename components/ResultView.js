import {useState} from "react";
import {msToTime} from "@/util/msToTime";
import {useRouter} from "next/navigation";
import {postRecord} from "@/service/rankingService";


export default function ResultView({score: rawScore, time}) {


    const [name, setName] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const score = Math.round(rawScore)
    const t = msToTime(time)
    const router = useRouter()

    const onChangeNameHandler = (e) => {
        setName(e.target.value)
    }
    const submitRecordHandler = async () => {
        const data = {name, time, try: 1, score}

        setIsLoading(true)
        try {
            const result = await postRecord(data)
            router.push('/ranking')
            // alert('success')
        } catch (err) {
            console.log(err)
            alert('error')
        } finally {
            setIsLoading(false)
        }


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
                <input onChange={onChangeNameHandler}
                       value={name}
                       className={'border-2 border-purple-300 rounded-lg p-2 text-center  focus:outline-none'}
                       placeholder={'이름입력 (학교-이름)'}/>
                <button disabled={isLoading} onClick={submitRecordHandler}
                        className={`${name.length === 0 ? 'opacity-0' : 'opacity-100'} bg-purple-500 text-white cursor-pointer p-2 rounded-lg w-fit mx-auto disabled:cursor-not-allowed`}>{isLoading ? '저장중' : '저장하기'}</button>
            </div>
        </div>
    )
}