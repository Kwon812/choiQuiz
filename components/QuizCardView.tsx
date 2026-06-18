import { useState, useEffect, useRef } from "react";
import { Quiz } from "@/service/quizService";

interface QuizCardViewProps {
    quiz: Quiz;
    nextQuizButtonHandler: (userAnswer: number | null, time: number) => void;
    currentIndex: number;
    total: number;
    hp: number;
    combo: number;
}

const TIME_LIMIT = 15;

export default function QuizCardView({
    quiz,
    nextQuizButtonHandler,
    currentIndex,
    total,
    hp,
    combo,
}: QuizCardViewProps) {
    const { title, problems, answer } = quiz;
    const correctNum = Number(answer);

    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [phase, setPhase] = useState<"selecting" | "feedback">("selecting");
    const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
    const [popupKey, setPopupKey] = useState(0);
    const [showPopup, setShowPopup] = useState(false);
    const [popupMsg, setPopupMsg] = useState("");

    const startRef = useRef(Date.now());
    const nextHandlerRef = useRef(nextQuizButtonHandler);
    nextHandlerRef.current = nextQuizButtonHandler;
    const submittedRef = useRef(false);

    const progress = ((currentIndex + 1) / total) * 100;
    const timerPct = (timeLeft / TIME_LIMIT) * 100;
    const isDanger = timeLeft <= 5 && phase === "selecting";

    const submitAnswer = (picked: number | null) => {
        if (submittedRef.current) return;
        submittedRef.current = true;

        const elapsed = Date.now() - startRef.current;
        const isCorrect = picked !== null && picked === correctNum;

        setSelectedAnswer(picked);
        setPhase("feedback");

        if (isCorrect) {
            const newCombo = combo + 1;
            setPopupMsg(newCombo >= 2 ? `+100  COMBO ×${newCombo}!` : "+100");
            setPopupKey((k) => k + 1);
            setShowPopup(true);
        }

        setTimeout(() => nextHandlerRef.current(picked, elapsed), 1300);
    };

    useEffect(() => {
        if (phase !== "selecting") return;

        if (timeLeft === 0) {
            submitAnswer(null);
            return;
        }

        const id = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
        return () => clearTimeout(id);
    }, [timeLeft, phase]);

    const getBtnStyle = (i: number) => {
        const num = i + 1;
        if (phase === "selecting") {
            return { backgroundColor: "#ffffff", color: "#222222", border: "1px solid #dddddd", fontWeight: 400 };
        }
        if (num === correctNum) return { backgroundColor: "#22c55e", color: "#ffffff", border: "none", fontWeight: 600 };
        if (num === selectedAnswer) return { backgroundColor: "#ef4444", color: "#ffffff", border: "none", fontWeight: 400 };
        return { backgroundColor: "#f5f5f5", color: "#bbbbbb", border: "1px solid #ebebeb", fontWeight: 400 };
    };

    return (
        <div
            className="absolute inset-0 flex flex-col items-center justify-center fade-in px-4 sm:px-0"
            style={{ backgroundColor: "#f7f7f7" }}
        >
            {/* 점수 팝업 */}
            {showPopup && (
                <div
                    key={popupKey}
                    className="score-popup-anim"
                    style={{
                        position: "fixed",
                        top: "calc(50% - 120px)",
                        left: "50%",
                        zIndex: 200,
                        fontSize: popupMsg.includes("COMBO") ? 19 : 28,
                        fontWeight: 800,
                        color: popupMsg.includes("COMBO") ? "#f97316" : "#22c55e",
                        whiteSpace: "nowrap",
                        textShadow: "0 2px 10px rgba(0,0,0,0.15)",
                    }}
                    onAnimationEnd={() => setShowPopup(false)}
                >
                    {popupMsg}
                </div>
            )}

            <div
                style={{
                    width: "100%",
                    maxWidth: 520,
                    backgroundColor: "#ffffff",
                    borderRadius: 14,
                    boxShadow:
                        "rgba(0,0,0,0.02) 0 0 0 1px, rgba(0,0,0,0.04) 0 2px 6px, rgba(0,0,0,0.10) 0 4px 8px",
                    overflow: "hidden",
                }}
            >
                {/* 문제 진행 바 */}
                <div style={{ height: 3, backgroundColor: "#f2f2f2" }}>
                    <div
                        style={{
                            height: "100%",
                            width: `${progress}%`,
                            backgroundColor: "#ff385c",
                            transition: "width 0.3s ease",
                        }}
                    />
                </div>

                <div className="quiz-card-inner">
                    {/* HP + 콤보 + 진행도 */}
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: 14,
                        }}
                    >
                        {/* 하트 */}
                        <div style={{ display: "flex", gap: 3, alignItems: "center" }}>
                            {[1, 2, 3].map((i) => (
                                <span
                                    key={i}
                                    className="material-symbols-outlined"
                                    style={{
                                        fontSize: 22,
                                        color: i <= hp ? "#ff385c" : "#ebebeb",
                                        transition: "color 0.3s",
                                    }}
                                >
                                    favorite
                                </span>
                            ))}
                        </div>

                        {/* 콤보 뱃지 */}
                        {combo >= 2 && (
                            <div
                                key={combo}
                                className="combo-in-anim"
                                style={{
                                    background:
                                        combo >= 5
                                            ? "linear-gradient(90deg,#f59e0b,#ef4444)"
                                            : combo >= 3
                                            ? "#f97316"
                                            : "#ff385c",
                                    color: "#fff",
                                    borderRadius: 999,
                                    padding: "4px 12px",
                                    fontSize: 13,
                                    fontWeight: 700,
                                    letterSpacing: "0.02em",
                                }}
                            >
                                🔥 COMBO ×{combo}
                            </div>
                        )}

                        {/* 진행도 */}
                        <span style={{ fontSize: 15, fontWeight: 600, color: "#6a6a6a" }}>
                            {currentIndex + 1}
                            <span style={{ fontWeight: 400 }}> / {total}</span>
                        </span>
                    </div>

                    {/* 카운트다운 바 */}
                    <div style={{ marginBottom: 22 }}>
                        <div
                            style={{
                                height: 7,
                                backgroundColor: "#f2f2f2",
                                borderRadius: 999,
                                overflow: "hidden",
                            }}
                        >
                            <div
                                style={{
                                    height: "100%",
                                    width: `${timerPct}%`,
                                    backgroundColor: isDanger ? "#ef4444" : "#22c55e",
                                    transition: "width 0.9s linear, background-color 0.4s",
                                    borderRadius: 999,
                                }}
                            />
                        </div>
                        <div
                            style={{
                                marginTop: 5,
                                fontSize: 13,
                                fontWeight: 700,
                                color: isDanger ? "#ef4444" : "#929292",
                                textAlign: "right",
                                fontVariantNumeric: "tabular-nums",
                            }}
                            className={isDanger ? "timer-danger-anim" : ""}
                        >
                            {phase === "feedback" && selectedAnswer === null ? (
                                <span style={{ color: "#ef4444" }}>시간 초과</span>
                            ) : (
                                `${timeLeft}s`
                            )}
                        </div>
                    </div>

                    {/* 질문 */}
                    <p
                        style={{
                            fontSize: 22,
                            fontWeight: 600,
                            color: "#222222",
                            lineHeight: 1.4,
                            textAlign: "center",
                            marginBottom: 24,
                            wordBreak: "keep-all",
                        }}
                    >
                        {title}
                    </p>

                    {/* 보기 */}
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 10,
                            pointerEvents: phase === "feedback" ? "none" : "auto",
                        }}
                    >
                        {problems.map((problem, i) => {
                            const s = getBtnStyle(i);
                            return (
                                <button
                                    key={i}
                                    onClick={() => submitAnswer(i + 1)}
                                    style={{
                                        padding: "14px 20px",
                                        borderRadius: 8,
                                        fontSize: 17,
                                        textAlign: "left",
                                        cursor: "pointer",
                                        transition: "background-color 0.25s, color 0.25s",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 12,
                                        ...s,
                                    }}
                                >
                                    <span
                                        style={{
                                            width: 26,
                                            height: 26,
                                            borderRadius: "50%",
                                            backgroundColor: "rgba(0,0,0,0.07)",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            fontSize: 13,
                                            fontWeight: 600,
                                            flexShrink: 0,
                                            color: s.color,
                                        }}
                                    >
                                        {i + 1}
                                    </span>
                                    {problem}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
