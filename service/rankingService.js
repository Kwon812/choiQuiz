import axios from "axios";


export const postRecord =async (data)=>{

    const result=await axios.put('/api/ranking',data)

    return result
}

export const getRecords=async()=>{

    const {data}=await axios.get('/api/ranking')
    return data
}