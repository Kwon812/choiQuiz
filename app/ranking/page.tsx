'use client'
import { useEffect, useMemo, useState } from "react";
import { getRecords, RankingRecord } from "@/service/rankingService";
import { msToTime } from "@/util/msToTime";

const MEDAL: { [k: number]: { bg: string; border: string; label: string } } = {
    1: { bg: "linear-gradient(135deg,#FFD700,#FFC300)", border: "#FFD700", label: "#92700A" },
    2: { bg: "linear-gradient(135deg,#E8E8E8,#C8C8C8)", border: "#C0C0C0", label: "#555" },
    3: { bg: "linear-gradient(135deg,#E8A87C,#CD7F32)", border: "#CD7F32", label: "#7A4515" },
};

export default function RankingPage() {
    const [records, setRecords] = useState<RankingRecord[]>([]);

    const [top, rest] = useMemo(() => [records.slice(0, 3), records.slice(3)], [records]);

    useEffect(() => {
        getRecords()
            .then(setRecords)
            .catch(console.log);
    }, []);

    if (records.length === 0) {
        return (
            <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <p style={{ fontSize: 16, color: "#6a6a6a" }}>불러오는 중...</p>
            </div>
        );
    }

    return (
        <div className="ranking-page">
            <div style={{ maxWidth: 780, margin: "0 auto" }}>

                {/* 헤더 */}
                <div style={{ textAlign: "center", marginBottom: 40 }}>
                    <p style={{ fontSize: 14, fontWeight: 700, color: "#ff385c", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>
                        Ranking
                    </p>
                    <h1 style={{ fontSize: 32, fontWeight: 700, color: "#222222", lineHeight: 1.3 }}>
                        퀴즈 랭킹
                    </h1>
                </div>

                {/* Top 3 */}
                <div className="ranking-top-grid">
                    {top.map((record, i) => (
                        <TopCard key={i} ranking={i + 1} record={record} />
                    ))}
                </div>

                {/* 나머지 */}
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {rest.map((record, i) => (
                        <RestCard key={i} ranking={i + 4} record={record} />
                    ))}
                </div>
            </div>
        </div>
    );
}

function TopCard({ ranking, record }: { ranking: number; record: RankingRecord }) {
    const { name, try: t, score, time } = record;
    const [stu, school] = name.split("-");
    const medal = MEDAL[ranking];

    return (
        <div
            style={{
                background: medal.bg,
                border: `1.5px solid ${medal.border}`,
                borderRadius: 14,
                padding: "24px 20px",
                boxShadow: "rgba(0,0,0,0.02) 0 0 0 1px, rgba(0,0,0,0.04) 0 2px 6px, rgba(0,0,0,0.10) 0 4px 8px",
                position: "relative",
                overflow: "hidden",
            }}
        >
            {/* 순위 */}
            <p
                style={{
                    fontSize: 48,
                    fontWeight: 700,
                    color: medal.label,
                    lineHeight: 1,
                    marginBottom: 4,
                    opacity: 0.5,
                }}
            >
                #{ranking}
            </p>

            {/* 점수 */}
            <p style={{ fontSize: 32, fontWeight: 700, color: "#222222", marginBottom: 12 }}>
                {score}<span style={{ fontSize: 16, fontWeight: 500, color: "#3f3f3f" }}>점</span>
            </p>

            <div style={{ width: "100%", height: 1, backgroundColor: "rgba(0,0,0,0.1)", marginBottom: 12 }} />

            {/* 이름 */}
            <p style={{ fontSize: 20, fontWeight: 700, color: "#222222", marginBottom: 2 }}>{stu}</p>
            <p style={{ fontSize: 14, color: "#3f3f3f", marginBottom: 10 }}>{school}</p>

            {/* 메타 */}
            <p style={{ fontSize: 13, color: "#6a6a6a" }}>걸린 시간: {msToTime(time)}</p>
            <p style={{ fontSize: 13, color: "#6a6a6a" }}>시도 횟수: {t}회</p>
        </div>
    );
}

function RestCard({ ranking, record }: { ranking: number; record: RankingRecord }) {
    const { name, try: t, score, time } = record;
    const [stu, school] = name.split("-");

    return (
        <div className="rest-card">
            <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                <span style={{ fontSize: 22, fontWeight: 700, color: "#929292", width: 36 }}>
                    {ranking}
                </span>
                <div>
                    <p style={{ fontSize: 18, fontWeight: 600, color: "#222222" }}>{stu}</p>
                    <p style={{ fontSize: 14, color: "#6a6a6a" }}>{school}</p>
                </div>
            </div>

            <div className="rest-card-right">
                <div className="rest-card-stat">
                    <p style={{ fontSize: 13, color: "#6a6a6a" }}>걸린 시간</p>
                    <p style={{ fontSize: 15, fontWeight: 500, color: "#222222" }}>{msToTime(time)}</p>
                </div>
                <div className="rest-card-stat">
                    <p style={{ fontSize: 13, color: "#6a6a6a" }}>시도</p>
                    <p style={{ fontSize: 15, fontWeight: 500, color: "#222222" }}>{t}회</p>
                </div>
                <div
                    style={{
                        backgroundColor: "#ff385c",
                        color: "#fff",
                        borderRadius: 9999,
                        padding: "6px 18px",
                        fontSize: 16,
                        fontWeight: 600,
                    }}
                >
                    {score}점
                </div>
            </div>
        </div>
    );
}
