import axios from "axios";


export async function postQuiz(quiz){

    // console.log(quiz)
    const res=await axios.post('/api/quiz', quiz)

    return res.data
}
export async function getAllQuiz(){

    const res=await axios.get('/api/quiz')

    return res.data
}
export async function putQuiz(quiz,id){

    delete quiz.id
    delete quiz.state
    const res=await axios.put('/api/quiz', {
        id,quiz
    })
    return res.data
}
export async function deleteQuiz(id){

    console.log(id)
    const res=await axios.delete('/api/quiz',{
        params: {
            id
        }
    })
    return res.data
}