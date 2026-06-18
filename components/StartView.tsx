import { useState } from "react";

interface StartViewProps {
    start: boolean;
    startButtonHandler: (selectedQuiz: string) => void;
}

const QUIZ_GROUPS = [
    {
        title: "미디어 탐험대",
        options: [
            { key: "media1", label: "1단계", sub: "안전의 정글" },
            { key: "media2", label: "2단계", sub: "맹독의 늪" },
            { key: "media3", label: "3단계", sub: "진실의 정글" },
            { key: "media4", label: "4단계", sub: "규칙의 정글" },
        ],
    },
    {
        title: "AI",
        options: [
            { key: "ai literacy", label: "AI 리터러시", sub: "탐험대" },
        ],
    },
    {
        title: "미디어 역기능 예방",
        options: [
            { key: "deep fake", label: "딥페이크", sub: "온라인 그루밍" },
        ],
    },
    {
        title: "효문화 탐험대",
        options: [
            { key: "filial", label: "효문화 퀴즈", sub: "1단계" },
        ],
    },
];

export default function StartView({ start, startButtonHandler }: StartViewProps) {
    const [activeGroup, setActiveGroup] = useState(0);
    const [selectedQuiz, setSelectedQuiz] = useState("");

    const currentOptions = QUIZ_GROUPS[activeGroup].options;

    return (
        <>
            {/* 플레이 버튼 */}
            <button
                onClick={() => { if (!start) startButtonHandler(selectedQuiz); }}
                className={`z-50 h-fit ${start ? "button-big" : ""}`}
            >
                <div
                    style={{
                        width: 108,
                        height: 108,
                        borderRadius: "50%",
                        backgroundColor: "#ff385c",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "rgba(0,0,0,0.02) 0 0 0 1px, rgba(0,0,0,0.04) 0 2px 6px, rgba(0,0,0,0.18) 0 8px 24px",
                        cursor: "pointer",
                        transition: "transform 0.15s",
                    }}
                    className="hover:scale-105"
                >
                    <span className="material-symbols-outlined" style={{ fontSize: 60, color: "#fff" }}>
                        play_arrow
                    </span>
                </div>
            </button>

            {/* 도어 패널 */}
            <div className="absolute inset-0 grid grid-rows-2 pointer-events-none">

                {/* 위 도어 */}
                <div
                    className={`flex flex-col items-center justify-end pb-10 gap-8 ${start ? "door-up" : ""}`}
                    style={{
                        backgroundColor: "#ff385c",
                        borderBottom: "3px solid rgba(255,255,255,0.25)",
                        pointerEvents: start ? "none" : "auto",
                    }}
                >
                    {/* 타이틀 */}
                    <div style={{ textAlign: "center", color: "#ffffff", userSelect: "none" }}>
                        <p style={{ fontSize: 72, fontWeight: 900, letterSpacing: -2, lineHeight: 1 }}>
                            퀴즈
                        </p>
                        <p style={{ fontSize: 20, fontWeight: 500, marginTop: 10, opacity: 0.88, letterSpacing: 0.5 }}>
                            단계를 선택하고 시작하세요
                        </p>
                    </div>

                    {/* 선택 카드 */}
                    <div
                        className="start-card"
                        style={{
                            backgroundColor: "#ffffff",
                            borderRadius: 16,
                            boxShadow: "rgba(0,0,0,0.02) 0 0 0 1px, rgba(0,0,0,0.06) 0 4px 12px, rgba(0,0,0,0.12) 0 8px 24px",
                            overflow: "hidden",
                        }}
                    >
                        {/* 탭 헤더 */}
                        <div
                            style={{
                                display: "flex",
                                borderBottom: "1px solid #ebebeb",
                                padding: "0 4px",
                            }}
                        >
                            {QUIZ_GROUPS.map((group, gi) => {
                                const active = activeGroup === gi;
                                return (
                                    <button
                                        key={gi}
                                        onClick={() => setActiveGroup(gi)}
                                        className="start-tab-btn"
                                        style={{
                                            flex: 1,
                                            fontWeight: active ? 600 : 400,
                                            color: active ? "#222222" : "#6a6a6a",
                                            background: "none",
                                            border: "none",
                                            borderBottom: active ? "2px solid #222222" : "2px solid transparent",
                                            cursor: "pointer",
                                            transition: "all 0.15s",
                                            marginBottom: -1,
                                        }}
                                    >
                                        {group.title}
                                    </button>
                                );
                            })}
                        </div>

                        {/* 옵션 그리드 */}
                        <div
                            style={{
                                padding: "20px 24px 24px",
                                display: "grid",
                                gridTemplateColumns: "repeat(2, 1fr)",
                                gap: 10,
                                minHeight: 120,
                            }}
                        >
                            {currentOptions.map((opt) => {
                                const selected = selectedQuiz === opt.key;
                                return (
                                    <button
                                        key={opt.key}
                                        onClick={() => setSelectedQuiz(opt.key)}
                                        style={{
                                            padding: "18px 20px",
                                            borderRadius: 12,
                                            border: selected ? "1.5px solid #ff385c" : "1px solid #ebebeb",
                                            backgroundColor: selected ? "#fff5f7" : "#ffffff",
                                            cursor: "pointer",
                                            textAlign: "left",
                                            transition: "all 0.15s",
                                        }}
                                    >
                                        <p
                                            style={{
                                                fontSize: 20,
                                                fontWeight: 700,
                                                color: selected ? "#ff385c" : "#222222",
                                                marginBottom: 4,
                                            }}
                                        >
                                            {opt.label}
                                        </p>
                                        <p style={{ fontSize: 16, color: "#6a6a6a", fontWeight: 400 }}>
                                            {opt.sub}
                                        </p>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* 아래 도어 */}
                <div
                    className={start ? "door-down" : ""}
                    style={{
                        backgroundColor: "#ff385c",
                        borderTop: "3px solid rgba(255,255,255,0.25)",
                        pointerEvents: "none",
                    }}
                />
            </div>
        </>
    );
}
