'use client'
import {useEffect, useMemo, useState} from "react";
import {getRecords} from "@/service/rankingService";
import {msToTime} from "@/util/msToTime";


export default function RankingPage() {

    const [records, setRecords] = useState([])
    const [top,left]=useMemo(()=>{

        return [records.slice(0,3),records.slice(3)]
    },[records])
    useEffect(() => {
        const fetchData = async () => {
            try {

                const records = await getRecords()
                setRecords(records)
            } catch (e) {
                console.log(e)
            }
        }
        fetchData()

    }, []);


    if(records.length<=0){
        return <>LOADING</>
    }
    return (
        <div className={'flex h-screen justify-center  items-center p-10 w-full '}>
            <div className={'w-2/3 min-w-[900px]  rounded-lg  min-h-full p-10 flex flex-col gap-3'}>
                {
                    console.log(top)
                }
                <div className={'grid grid-cols-3 gap-3 '}>
                    {
                        top.map((record,i)=>{
                            return (
                                <RankingCard key={i} def={true} ranking={i+1} record={record}/>
                            )
                        })
                    }
                </div>
                <div className={'flex flex-col gap-2'}>
                    {
                        left.map((record,i)=>{
                            return <RankingCard  key={i} ranking={i+4} record={record} def={false}/>
                        })
                    }

                </div>
            </div>
        </div>
    )
}

export function RankingCard({def = false,record,ranking}) {

    const {name,try:t,score,time}=record
    const [stu,school]=name.split('-')
    const strTime=msToTime(time)

    const rankingStyle={
        1:'bg-gradient-to-r from-yellow-300 via-yellow-500 to-yellow-600 bg-clip-text text-transparent',
        2:'bg-gradient-to-r from-gray-300 via-gray-400 to-gray-600 bg-clip-text text-transparent',
        3:'bg-gradient-to-r from-orange-500 via-orange-700 to-orange-600 bg-clip-text text-transparent'
    }
    if (def) {

        return (
            <div className={'grid grid-cols-[1.5fr_2fr] gap-2 p-4  bg-white rounded-xl '}>

                <p className={'  text-2xl font-bold my-auto  '}><span className={`text-5xl mx-1 ${rankingStyle[ranking]}`}>#{ranking}</span>/{score}점</p>
                <div className={'flex flex-col items-end    place-items-end '} >
                    <p className={'text-[15px] font-bold text-gray-600'}>{school}</p>
                    <p className={'text-2xl my-1 font-bold'}>{stu}</p>

                    <p className={'text-sm text-gray-600 '}>걸린시간 : {strTime}</p>
                    <p className={'text-sm text-gray-600'}>시도횟수: {t}</p>


                </div>
            </div>

        )
    }
    return (
        <div className={'flex  justify-between  items-baseline p-4  bg-white rounded-xl w-full'}>
            <p className={'text-xl font-bold my-auto '}><span className={'text-3xl mx-1'}>#{ranking}</span>/{score}점</p>
            <div className={'flex flex-col text-center'}>

            <p className={'text-2xl font-bold'}>{stu}</p>
            <p className={'text-[15px] font-bold text-gray-600'}>{school}</p>

            </div>

            <div className={'flex flex-col'}>

                <p className={'text-sm text-gray-600 '}>걸린시간 : {strTime}</p>
                <p className={'text-sm text-gray-600'}>시도횟수: {t}</p>
            </div>

        </div>
    )
}