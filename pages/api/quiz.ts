import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/lib/supabase";

export default function Handler(req: NextApiRequest, res: NextApiResponse) {
    const method: Record<string, () => Promise<void>> = {
        POST: async () => {
            const { data, error } = await supabase.from("quizs").insert(req.body).select().single();
            if (error) {
                return res.status(400).json({ error });
            }
            return res.status(200).send({ data });
        },
        GET: async () => {
            const selected = req.query?.selected as string | undefined;
            let data, error;
            if (selected) {
                ({ data, error } = await supabase.rpc("get_random_quiz").eq("type", selected));
            } else {
                ({ data, error } = await supabase.from("quizs").select("*"));
            }
            if (error) {
                return res.status(400).json({ error });
            }
            return res.status(200).send(data);
        },
        PUT: async () => {
            const { data, error } = await supabase.from("quizs").update(req.body.quiz).eq("id", req.body.id);
            if (error) {
                return res.status(400).json({ error });
            }
            return res.status(200).json("success");
        },
        DELETE: async () => {
            const { data, error } = await supabase.from("quizs").delete().eq("id", req.query.id as string);
            if (error) {
                return res.status(400).json({ error });
            }
            return res.status(200).json("success");
        },
    };

    if (method[req.method!]) {
        try {
            return method[req.method!]();
        } catch (e) {
            return res.status(400).send({ message: "Unexpected method" });
        }
    }
}
