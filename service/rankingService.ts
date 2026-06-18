import axios from "axios";

export interface RankingRecord {
    id?: number;
    name: string;
    try: number;
    score: number;
    time: number;
}

export const postRecord = async (data: RankingRecord) => {
    const result = await axios.put("/api/ranking", data);
    return result;
};

export const getRecords = async (): Promise<RankingRecord[]> => {
    const { data } = await axios.get("/api/ranking");
    return data;
};
