import axios from "axios";

export interface Quiz {
    id?: number;
    title: string;
    problems: string[];
    answer: string;
    type: string;
    tempId?: number;
    state?: "pending" | "done";
}

export async function postQuiz(quiz: Quiz) {
    const res = await axios.post("/api/quiz", quiz);
    return res.data;
}

export async function getAllQuiz(selected?: string): Promise<Quiz[]> {
    const res = await axios.get("/api/quiz", {
        params: { selected },
    });
    return res.data;
}

export async function putQuiz(quiz: Quiz, id: number) {
    const body = { ...quiz };
    delete body.id;
    delete body.state;
    const res = await axios.put("/api/quiz", { id, quiz: body });
    return res.data;
}

export async function deleteQuiz(id: number) {
    const res = await axios.delete("/api/quiz", {
        params: { id },
    });
    return res.data;
}
