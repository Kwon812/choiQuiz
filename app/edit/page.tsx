'use client'

import { useEffect, useMemo, useRef, useState } from "react";
import { deleteQuiz, getAllQuiz, postQuiz, putQuiz, Quiz } from "@/service/quizService";
import Masonry from "react-masonry-css";

const quizMapper: Record<string, string> = {
    filial: "효문화",
    media1: "미디어 1단계",
    media2: "미디어 2단계",
    media3: "미디어 3단계",
    media4: "미디어 4단계",
    "ai literacy": "AI 리터러시",
    "deep fake": "딥페이크",
};

const breakpointColumnsObj = { default: 3, 1620: 2, 1024: 1 };

const inputStyle: React.CSSProperties = {
    width: "100%",
    height: 50,
    borderRadius: 8,
    border: "1px solid #dddddd",
    padding: "0 14px",
    fontSize: 16,
    color: "#222222",
    outline: "none",
    boxSizing: "border-box",
    backgroundColor: "#ffffff",
    transition: "border-color 0.15s",
};

function SectionLabel({ children }: { children: React.ReactNode }) {
    return (
        <p style={{ fontSize: 15, fontWeight: 600, color: "#222222", marginBottom: 10 }}>
            {children}
        </p>
    );
}

function Divider() {
    return <div style={{ height: 1, backgroundColor: "#ebebeb", margin: "4px 0" }} />;
}

export default function EditPage() {
    const [form, setForm] = useState<Quiz>({ title: "", problems: [""], answer: "", type: "" });
    const [isEdit, setIsEdit] = useState<number | null>(null);
    const [cards, setCards] = useState<Quiz[]>([]);
    const [filterType, setFilterType] = useState("");
    const titleRef = useRef<HTMLInputElement>(null);

    const quizTypes = useMemo(
        () => cards.reduce((a: string[], c) => (a.includes(c.type) ? a : [...a, c.type]), []),
        [cards]
    );

    const isFormValid = useMemo(
        () =>
            form.title.trim() !== "" &&
            form.type.trim() !== "" &&
            form.answer !== "" &&
            form.problems.every((p) => p.trim() !== ""),
        [form]
    );

    const selectedCards = useMemo(
        () => (filterType ? cards.filter((x) => x.type === filterType) : cards),
        [filterType, cards]
    );

    const problemHandler = (e: React.MouseEvent<HTMLButtonElement>, i?: number) => {
        e.preventDefault();
        setForm((s) => {
            if (i === undefined) return { ...s, problems: [...s.problems, ""] };
            const temp = [...s.problems];
            temp.splice(i, 1);
            return { ...s, problems: temp };
        });
    };

    const submitFormHandler = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const prevCards = [...cards];
        const tempId = Date.now();

        if (isEdit !== null) {
            setCards((s) => s.map((x) => (x.id === isEdit ? { ...x, ...form } : x)));
        } else {
            setCards((s) => [...s, { ...form, tempId, state: "pending" }]);
        }

        try {
            const result = await (isEdit === null ? postQuiz(form) : putQuiz(form, isEdit));
            if (result?.data) {
                setCards((s) => s.map((x) => (x.tempId === tempId ? { ...result.data, state: "done" as const } : x)));
            }
            setIsEdit(null);
            setForm({ title: "", problems: [""], answer: "", type: "" });
            titleRef.current?.focus();
        } catch {
            setCards(prevCards);
        }
    };

    const onChangeInputHandler = (e: React.ChangeEvent<HTMLInputElement>, i?: number) => {
        const { name, value } = e.target;
        setForm((s) => {
            if (name === "problems" && i !== undefined) {
                const temp = [...s.problems];
                temp[i] = value;
                return { ...s, problems: temp };
            }
            return { ...s, [name]: value };
        });
        if (name === "type") setFilterType(value);
    };

    const editCardHandler = (card: Quiz) => {
        setIsEdit(card.id!);
        setForm({ title: card.title, problems: card.problems, answer: card.answer, type: card.type });
        setFilterType(card.type);
    };

    const deleteCardHandler = (card: Quiz) => {
        const prevCards = [...cards];
        setCards((s) => s.filter((x) => x.id !== card.id));
        deleteQuiz(card.id!).catch(() => setCards(prevCards));
    };

    useEffect(() => {
        getAllQuiz().then(setCards).catch(console.log);
    }, []);

    return (
        <div className="edit-layout">

            {/* 왼쪽 폼 패널 */}
            <div className="edit-form-panel">
                {/* 패널 헤더 */}
                <div style={{ padding: "24px 24px 20px", borderBottom: "1px solid #ebebeb", flexShrink: 0 }}>
                    <p style={{ fontSize: 19, fontWeight: 700, color: "#222222" }}>
                        {isEdit !== null ? "문제 수정" : "문제 만들기"}
                    </p>
                    <p style={{ fontSize: 14, color: "#929292", marginTop: 3 }}>
                        퀴즈 유형과 내용을 입력하세요
                    </p>
                </div>

                <form
                    onSubmit={submitFormHandler}
                    style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}
                >
                <div style={{ flex: 1, overflowY: "auto", padding: "0 24px" }}>

                    {/* 1. 유형 */}
                    <div style={{ padding: "18px 0", borderBottom: "1px solid #ebebeb" }}>
                        <SectionLabel>유형</SectionLabel>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                            {quizTypes.map((x, i) => {
                                const active = form.type === x;
                                return (
                                    <button
                                        key={i}
                                        type="button"
                                        onClick={() => {
                                            const next = active ? "" : x;
                                            setForm((s) => ({ ...s, type: next }));
                                            setFilterType(next);
                                        }}
                                        style={{
                                            padding: "6px 14px",
                                            borderRadius: 9999,
                                            border: `1px solid ${active ? "#ff385c" : "#dddddd"}`,
                                            backgroundColor: active ? "#fff5f7" : "#ffffff",
                                            color: active ? "#ff385c" : "#3f3f3f",
                                            fontSize: 14,
                                            fontWeight: active ? 600 : 400,
                                            cursor: "pointer",
                                            transition: "all 0.15s",
                                        }}
                                    >
                                        {quizMapper[x] ?? x}
                                    </button>
                                );
                            })}
                        </div>
                        <input
                            value={form.type}
                            name="type"
                            onChange={onChangeInputHandler}
                            placeholder="직접 입력..."
                            style={{ ...inputStyle, height: 42, fontSize: 14, marginTop: 10 }}
                            onFocus={(e) => (e.currentTarget.style.borderColor = "#222222")}
                            onBlur={(e) => (e.currentTarget.style.borderColor = "#dddddd")}
                        />
                    </div>

                    {/* 2. 문제 제목 */}
                    <div style={{ padding: "18px 0", borderBottom: "1px solid #ebebeb" }}>
                        <SectionLabel>문제 제목</SectionLabel>
                        <input
                            ref={titleRef}
                            name="title"
                            value={form.title}
                            onChange={onChangeInputHandler}
                            placeholder="문제를 입력하세요"
                            style={inputStyle}
                            onFocus={(e) => (e.currentTarget.style.borderColor = "#222222")}
                            onBlur={(e) => (e.currentTarget.style.borderColor = "#dddddd")}
                        />
                    </div>

                    {/* 3. 보기 + 정답 선택 */}
                    <div style={{ padding: "18px 0" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                            <SectionLabel>보기</SectionLabel>
                            <span style={{ fontSize: 13, color: "#929292" }}>클릭하여 정답 선택 · {form.problems.length}개</span>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                            {form.problems.map((x, i) => {
                                const isAnswer = form.answer === String(i + 1);
                                return (
                                    <div
                                        key={i}
                                        onClick={() => setForm((s) => ({ ...s, answer: String(i + 1) }))}
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 10,
                                            padding: "10px 12px",
                                            borderRadius: 8,
                                            backgroundColor: isAnswer ? "#fff5f7" : "#f7f7f7",
                                            border: `1px solid ${isAnswer ? "#ffd1da" : "transparent"}`,
                                            cursor: "pointer",
                                            transition: "all 0.15s",
                                        }}
                                    >
                                        <span
                                            style={{
                                                width: 20,
                                                height: 20,
                                                borderRadius: "50%",
                                                backgroundColor: isAnswer ? "#ff385c" : "#ffffff",
                                                border: `1px solid ${isAnswer ? "#ff385c" : "#dddddd"}`,
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                fontSize: 11,
                                                fontWeight: 600,
                                                color: isAnswer ? "#ffffff" : "#6a6a6a",
                                                flexShrink: 0,
                                                transition: "all 0.15s",
                                            }}
                                        >
                                            {i + 1}
                                        </span>
                                        <input
                                            value={x}
                                            onChange={(e) => onChangeInputHandler(e, i)}
                                            onClick={(e) => e.stopPropagation()}
                                            placeholder={`${i + 1}번 보기`}
                                            name="problems"
                                            style={{ flex: 1, border: "none", background: "transparent", fontSize: 15, color: "#222222", outline: "none", cursor: "text" }}
                                        />
                                        {isAnswer && (
                                            <span style={{ fontSize: 12, color: "#ff385c", fontWeight: 600, flexShrink: 0 }}>정답</span>
                                        )}
                                        {i !== 0 && (
                                            <button
                                                onClick={(e) => { e.stopPropagation(); problemHandler(e, i); }}
                                                style={{ background: "none", border: "none", cursor: "pointer", color: "#929292", fontSize: 18, lineHeight: 1, padding: 0, flexShrink: 0 }}
                                            >
                                                ×
                                            </button>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                        <button
                            onClick={(e) => problemHandler(e)}
                            style={{
                                marginTop: 8,
                                width: "100%",
                                padding: "10px 0",
                                borderRadius: 8,
                                border: "1px dashed #dddddd",
                                background: "transparent",
                                fontSize: 14,
                                color: "#6a6a6a",
                                cursor: "pointer",
                            }}
                        >
                            + 보기 추가
                        </button>
                    </div>
                </div>

                    {/* 하단 버튼 */}
                    <div style={{ padding: "16px 24px", borderTop: "1px solid #ebebeb", flexShrink: 0, display: "flex", gap: 8 }}>
                        {isEdit !== null && (
                            <button
                                type="button"
                                onClick={() => { setIsEdit(null); setForm({ title: "", problems: [""], answer: "", type: "" }); }}
                                style={{
                                    flex: 1, height: 48, borderRadius: 8,
                                    border: "1px solid #dddddd", background: "#ffffff",
                                    color: "#222222", fontSize: 15, fontWeight: 500, cursor: "pointer",
                                }}
                            >
                                취소
                            </button>
                        )}
                        <button
                            type="submit"
                            disabled={!isFormValid}
                            style={{
                                flex: 1, height: 48, borderRadius: 8, border: "none",
                                backgroundColor: isFormValid ? "#ff385c" : "#dddddd",
                                color: isFormValid ? "#ffffff" : "#aaaaaa",
                                fontSize: 15, fontWeight: 600,
                                cursor: isFormValid ? "pointer" : "not-allowed",
                                transition: "background-color 0.15s",
                            }}
                            onMouseOver={(e) => { if (isFormValid) e.currentTarget.style.backgroundColor = "#e00b41"; }}
                            onMouseOut={(e) => { if (isFormValid) e.currentTarget.style.backgroundColor = "#ff385c"; }}
                        >
                            {isEdit !== null ? "수정 완료" : "저장"}
                        </button>
                    </div>
                </form>
            </div>

            {/* 오른쪽 카드 목록 */}
            <div className="edit-cards-panel">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                    <p style={{ fontSize: 16, fontWeight: 600, color: "#222222" }}>
                        {selectedCards.length}개의 문제
                    </p>
                    {filterType && (
                        <button
                            onClick={() => { setFilterType(""); setForm((s) => ({ ...s, type: "" })); }}
                            style={{
                                fontSize: 13,
                                color: "#6a6a6a",
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                textDecoration: "underline",
                            }}
                        >
                            필터 해제
                        </button>
                    )}
                </div>

                {cards.length === 0 ? (
                    <p style={{ color: "#929292", fontSize: 15 }}>불러오는 중...</p>
                ) : (
                    <Masonry
                        breakpointCols={breakpointColumnsObj}
                        className="flex gap-5"
                        columnClassName="flex flex-col gap-5"
                    >
                        {selectedCards.map((x, i) => (
                            <div
                                key={i}
                                style={{
                                    backgroundColor: "#ffffff",
                                    borderRadius: 14,
                                    border: "1px solid #ebebeb",
                                    padding: "20px",
                                    boxShadow: "rgba(0,0,0,0.02) 0 0 0 1px, rgba(0,0,0,0.03) 0 2px 6px",
                                    position: "relative",
                                    opacity: x.state === "pending" ? 0.5 : 1,
                                    transition: "opacity 0.2s",
                                }}
                            >
                                {/* 유형 뱃지 */}
                                <div style={{ marginBottom: 12 }}>
                                    <span
                                        style={{
                                            fontSize: 11,
                                            fontWeight: 600,
                                            color: "#ff385c",
                                            backgroundColor: "#fff5f7",
                                            padding: "3px 10px",
                                            borderRadius: 9999,
                                        }}
                                    >
                                        {quizMapper[x.type] ?? x.type}
                                    </span>
                                </div>

                                {/* 제목 */}
                                <p style={{ fontSize: 15, fontWeight: 600, color: "#222222", marginBottom: 12, lineHeight: 1.4 }}>
                                    {x.title}
                                </p>

                                {/* 보기 목록 */}
                                <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 14 }}>
                                    {x.problems.map((problem, ii) => {
                                        const isAnswer = ii + 1 === Number(x.answer);
                                        return (
                                            <div
                                                key={ii}
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: 8,
                                                    padding: "8px 12px",
                                                    borderRadius: 8,
                                                    backgroundColor: isAnswer ? "#fff5f7" : "#f7f7f7",
                                                    border: isAnswer ? "1px solid #ffd1da" : "none",
                                                }}
                                            >
                                                <span style={{ fontSize: 12, fontWeight: 600, color: isAnswer ? "#ff385c" : "#929292", width: 16 }}>
                                                    {ii + 1}
                                                </span>
                                                <span style={{ fontSize: 13, color: isAnswer ? "#222222" : "#3f3f3f", fontWeight: isAnswer ? 500 : 400 }}>
                                                    {problem}
                                                </span>
                                                {isAnswer && (
                                                    <span style={{ marginLeft: "auto", fontSize: 11, color: "#ff385c", fontWeight: 600 }}>정답</span>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* 수정/삭제 버튼 */}
                                <div
                                    style={{
                                        display: "flex",
                                        gap: 8,
                                        paddingTop: 12,
                                        borderTop: "1px solid #ebebeb",
                                    }}
                                >
                                    <button
                                        disabled={x.state === "pending"}
                                        onClick={() => editCardHandler(x)}
                                        style={{
                                            flex: 1,
                                            padding: "7px 0",
                                            borderRadius: 8,
                                            border: "1px solid #dddddd",
                                            background: "#ffffff",
                                            fontSize: 13,
                                            color: "#222222",
                                            cursor: "pointer",
                                            fontWeight: 500,
                                        }}
                                    >
                                        수정
                                    </button>
                                    <button
                                        disabled={x.state === "pending"}
                                        onClick={() => deleteCardHandler(x)}
                                        style={{
                                            flex: 1,
                                            padding: "7px 0",
                                            borderRadius: 8,
                                            border: "1px solid #ffd1da",
                                            background: "#ffffff",
                                            fontSize: 13,
                                            color: "#ff385c",
                                            cursor: "pointer",
                                            fontWeight: 500,
                                        }}
                                    >
                                        삭제
                                    </button>
                                </div>
                            </div>
                        ))}
                    </Masonry>
                )}
            </div>
        </div>
    );
}
