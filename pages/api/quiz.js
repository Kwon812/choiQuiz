import {supabase} from "@/lib/supabase";


export default function Handler(req,res){



    const method={

        POST:async()=>{
            const {data,error}=await supabase.from('quizs').insert(req.body).select().single()
            if(error){
                return res.status(400).json({error:error})
            }
            return res.status(200).send({data})
        },
        GET:async()=>{
            const { data, error } = await supabase.rpc('get_random_quiz')
            if(error){
                return res.status(400).json({error:error})
            }
            return res.status(200).send(data)
        },
        PUT:async()=>{
            console.log(req.body)
            const {data,error}=await supabase.from('quizs').update(req.body.quiz).eq('id',req.body.id)

            if(error){
                console.log(error)
                return res.status(400).json({error:error})
            }
            return res.status(200).json('success')
        },

        DELETE:async()=>{
            // console.log('id',req.query.id)
            const {data,error}=await supabase.from('quizs').delete().eq('id',req.query.id)
            // console.log(error)
            if(error){
                return res.status(400).json({error:error})
            }
            return res.status(200).json('success')
        },

    }

    if(method[req.method]){
        try{
            return method[req.method]()
        }catch (e){
            return res.status(400).send({message:"Unexpected method"})
        }
    }


}