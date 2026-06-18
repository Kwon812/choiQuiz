import { useState } from "react";
import { msToTime } from "@/util/msToTime";
import { useRouter } from "next/navigation";
import { postRecord } from "@/service/rankingService";

interface ResultViewProps {
    score: number;
    time: number;
    hp: number;
    isGameOver: boolean;
}

const GRADES = [
    { min: 95, minHp: 3, label: "S", color: "#f59e0b", msg: "완벽한 클리어!" },
    { min: 80, minHp: 0, label: "A", color: "#22c55e", msg: "훌륭해요!" },
    { min: 60, minHp: 0, label: "B", color: "#3b82f6", msg: "잘했어요!" },
    { min: 40, minHp: 0, label: "C", color: "#f97316", msg: "더 노력해봐요!" },
    { min: 0,  minHp: 0, label: "D", color: "#ef4444", msg: "다시 도전!" },
];

function getGrade(score: number, hp: number) {
    for (const g of GRADES) {
        if (score >= g.min && hp >= g.minHp) return g;
    }
    return GRADES[GRADES.length - 1];
}

export default function ResultView({ score: rawScore, time, hp, isGameOver }: ResultViewProps) {
    const [name, setName] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const score = Math.round(rawScore);
    const t = msToTime(time);
    const router = useRouter();
    const grade = getGrade(score, hp);

    const submitRecordHandler = async () => {
        setIsLoading(true);
        try {
            await postRecord({ name, time, try: 1, score });
            router.push("/ranking");
        } catch (err) {
            console.log(err);
            alert("저장 중 오류가 발생했습니다.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div
            className="fade-in result-card"
            style={{
                backgroundColor: "#ffffff",
                borderRadius: 14,
                boxShadow: "rgba(0,0,0,0.02) 0 0 0 1px, rgba(0,0,0,0.04) 0 2px 6px, rgba(0,0,0,0.10) 0 4px 8px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            }}
        >
            {/* 게임오버 / 클리어 배너 */}
            <p
                style={{
                    fontSize: isGameOver ? 26 : 20,
                    fontWeight: 900,
                    color: isGameOver ? "#ef4444" : "#222222",
                    letterSpacing: -0.5,
                    marginBottom: 20,
                }}
            >
                {isGameOver ? "💔 게임 오버" : "🎉 클리어!"}
            </p>

            {/* 등급 원 */}
            <div
                style={{
                    width: 80,
                    height: 80,
                    borderRadius: "50%",
                    backgroundColor: grade.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 8,
                    boxShadow: `0 4px 20px ${grade.color}55`,
                }}
            >
                <span style={{ fontSize: 40, fontWeight: 900, color: "#fff", letterSpacing: -1 }}>
                    {grade.label}
                </span>
            </div>
            <p style={{ fontSize: 14, fontWeight: 600, color: grade.color, marginBottom: 20 }}>
                {grade.msg}
            </p>

            {/* 점수 */}
            <p
                style={{
                    fontSize: 72,
                    fontWeight: 700,
                    color: "#ff385c",
                    lineHeight: 1.1,
                    letterSpacing: "-1px",
                }}
            >
                {score}
                <span style={{ fontSize: 26, fontWeight: 500, color: "#6a6a6a", letterSpacing: 0 }}>점</span>
            </p>

            {/* 시간 + 남은 하트 */}
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 8, marginBottom: 28 }}>
                <p style={{ fontSize: 14, color: "#6a6a6a" }}>{t}</p>
                <div style={{ display: "flex", gap: 3 }}>
                    {[1, 2, 3].map((i) => (
                        <span
                            key={i}
                            className="material-symbols-outlined"
                            style={{ fontSize: 18, color: i <= hp ? "#ff385c" : "#ebebeb" }}
                        >
                            favorite
                        </span>
                    ))}
                </div>
            </div>

            {/* 구분선 */}
            <div style={{ width: "100%", height: 1, backgroundColor: "#ebebeb", marginBottom: 24 }} />

            {/* 이름 입력 */}
            <p style={{ fontSize: 14, fontWeight: 600, color: "#6a6a6a", marginBottom: 8, alignSelf: "flex-start" }}>
                이름 입력
            </p>
            <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="학교-이름"
                style={{
                    width: "100%",
                    height: 54,
                    borderRadius: 8,
                    border: "1px solid #dddddd",
                    padding: "14px 12px",
                    fontSize: 16,
                    color: "#222222",
                    outline: "none",
                    boxSizing: "border-box",
                    transition: "border-color 0.15s",
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#222222")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#dddddd")}
            />

            {/* 저장 버튼 */}
            <button
                disabled={name.length === 0 || isLoading}
                onClick={submitRecordHandler}
                style={{
                    marginTop: 14,
                    width: "100%",
                    height: 52,
                    borderRadius: 8,
                    backgroundColor: name.length === 0 ? "#ffd1da" : "#ff385c",
                    color: "#ffffff",
                    fontSize: 16,
                    fontWeight: 500,
                    border: "none",
                    cursor: name.length === 0 ? "not-allowed" : "pointer",
                    transition: "background-color 0.15s",
                }}
                onMouseOver={(e) => { if (name.length > 0 && !isLoading) e.currentTarget.style.backgroundColor = "#e00b41"; }}
                onMouseOut={(e) => { if (name.length > 0) e.currentTarget.style.backgroundColor = "#ff385c"; }}
            >
                {isLoading ? "저장 중..." : "랭킹에 등록하기"}
            </button>
        </div>
    );
}
