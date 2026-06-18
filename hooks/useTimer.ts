import { useEffect, useState } from "react";

export function useTimer() {
    const [timer, setTimer] = useState(0);

    useEffect(() => {
        const id = setInterval(() => setTimer((s) => s + 10), 10);
        return () => clearInterval(id);
    }, []);

    return timer;
}
