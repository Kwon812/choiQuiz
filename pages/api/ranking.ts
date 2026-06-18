import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/lib/supabase";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    const method: Record<string, () => Promise<void>> = {
        PUT: async () => {
            const { name } = req.body;
            const { data: exist } = await supabase.from("records").select("*").eq("name", name).single();
            if (exist) {
                const { name: existName, try: t } = exist;
                const { data, error } = await supabase
                    .from("records")
                    .update({ ...req.body, try: t + 1 })
                    .eq("name", existName);
                return res.status(200).json(data);
            }
            const { data, error } = await supabase.from("records").insert(req.body);
            return res.status(200).json(data);
        },
        GET: async () => {
            const { data, error } = await supabase
                .from("records")
                .select("*")
                .order("score", { ascending: false })
                .order("try", { ascending: true })
                .order("time", { ascending: true });
            if (error) throw error;
            return res.status(200).send(data);
        },
    };

    if (method[req.method!]) {
        try {
            return method[req.method!]();
        } catch (e) {
            return res.status(400).send(e);
        }
    }
    return res.status(405).send("wrong method");
}
