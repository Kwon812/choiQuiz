import {supabase} from "@/lib/supabase";

export default function handler(req, res) {


    const method = {
        PUT: async () => {
            const {name} = req.body
            console.log(req.body)
            const {data: exist} = await supabase.from('records').select('*').eq('name', name).single()
            // const {data: exist, error} = await supabase.from('records').upsert({
            //     ...req.body,
            //     try:
            // }).eq('name',name)
            if (exist) {
                const { name,try:t} = exist
                const {data, error} = await supabase.from('records').update({...req.body,try:t+1}).eq('name',name)
                return res.status(200).json(data)
            }
            const {data,error}=await supabase.from('records').insert(req.body)
            console.log(data)
            console.log(error)
            return res.status(200).json(data)
        },

        GET: async () => {

            const { data, error } = await supabase
                .from('records')
                .select('*')
                .order('score', { ascending: false })
                .order('try', { ascending: true })
                .order('time', { ascending: true })
            if(error) throw error
            return res.status(200).send(data)

        },
    }

    if (method[req.method]) {
        try {
            return method[req.method]()
        } catch (e) {
            return res.status(400).send(e)
        }
    }
    return res.status(405).send('wrong method')

}