import { useState, useEffect } from "react";

const REVIEW_DATA = `
1. "스텐팬이 음식이 너무 잘 눌러붙음, 예열에 신경쓰는게 일이 많음"
2. "인덕션 바꾸고 나니 기존 스텐 냄비세트 다 못쓰게 됐어요"
3. "스테인리스 특성상 사용 초기에 길들이기가 필요할 수 있어요"
4. "인덕션 호환 여부 알기가 너무 어려움 - 304는 안되고 430은 된다는데 제품에 표시 불분명"
5. "스텐 냄비 세척이 너무 힘들어요 - 탄 자국이 잘 안지워짐"
6. "무쇠팬 단점: 너무 무거움, 산성요리에 사용못함, 눌러붙으면 청소 힘듬"
7. "스테인리스는 위생적이고 반영구적으로 사용 가능해서 선택"
8. "바닥 3중 구조로 열효율이 좋고 음식이 고르게 익는다는 점이 장점"
9. "코팅팬은 3-4개월이면 교체해야 해서 경제적으로 만만치 않음"
10. "인덕션에 맞는 스텐냄비 찾기가 너무 어렵고 비쌈"
11. "스텐팬 길들이기 유튜브 검색해야 함 - 소비자가 스스로 공부해야 함"
12. "가성비는 좋으나 디자인이 너무 기본적이라 개성 없음"
13. "스테인리스는 내구성 좋고 위생적이지만 무거움"
14. "통 3중 이상 냄비 가격이 너무 비쌈"
15. "스텐이 건강에는 좋은데 요리가 너무 어려워서 테플론으로 돌아왔어요"
16. "요즘 인덕션 주방이 많아져서 인덕션 호환 여부가 정말 중요해짐"
17. "스텐냄비 변색됐는데 원래 색으로 돌아오나요?"
18. "통3중 스테인리스 뛰어난 성능과 디자인 동시 만족"
19. "오래 쓸 냄비를 원해서 스테인리스 선택 - 평생 쓰는 느낌"
20. "국내 브랜드 스테인리스 냄비 왜 잘 팔리는지 정보가 없음"
`;

const SYSTEM_PROMPT = `스테인리스 냄비 소비자 리뷰를 분석해 상품기획 인사이트를 반환하세요. 반드시 순수 JSON만 출력하세요. 마크다운 코드블록 없이.

{
  "keyInsight": "TYS 관점 핵심 인사이트 한 줄",
  "buyReasons": [
    {"title": "구매 이유 제목", "description": "설명 1-2문장", "frequency": "높음"}
  ],
  "complaints": [
    {"title": "불만 제목", "description": "설명 1-2문장", "severity": "높음"}
  ],
  "opportunities": [
    {"title": "기획 기회 제목", "description": "구체적 제안 1-2문장", "impact": "높음"}
  ]
}

buyReasons 3개, complaints 4개, opportunities 3개. frequency/severity/impact 값은 높음/중간/낮음 중 하나.`;

export default function ReviewAnalysis() {
  const [phase, setPhase] = useState("intro");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [dots, setDots] = useState("");
  const [activeTab, setActiveTab] = useState("complaints");

  useEffect(() => {
    if (phase === "collecting" || phase === "analyzing") {
      const iv = setInterval(() => setDots(d => d.length >= 3 ? "" : d + "."), 400);
      return () => clearInterval(iv);
    }
  }, [phase]);

  const runAnalysis = async () => {
    setPhase("collecting");
    setError(null);
    await new Promise(r => setTimeout(r, 1500));
    setPhase("analyzing");
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-opus-4-5-20251101",
          max_tokens: 2000,
          system: SYSTEM_PROMPT,
          messages: [{ role: "user", content: `다음 리뷰를 분석해주세요:\n${REVIEW_DATA}` }],
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`);
      const data = await res.json();
      if (data.error) throw new Error(data.error.message);
      const raw = (data.content?.[0]?.text || "").replace(/```json|```/g, "").trim();
      let parsed;
      try { parsed = JSON.parse(raw); }
      catch { throw new Error(`JSON 파싱 실패. 응답: ${raw.slice(0, 400)}`); }
      setResult(parsed);
      setPhase("result");
    } catch (e) {
      setError(e.message);
      setPhase("intro");
    }
  };

  const severityClr = { 높음: { bg:"#fef2f2", tx:"#dc2626", bd:"#fecaca" }, 중간: { bg:"#fffbeb", tx:"#d97706", bd:"#fde68a" }, 낮음: { bg:"#f0fdf4", tx:"#16a34a", bd:"#bbf7d0" } };
  const freqClr = { 높음: { bg:"#eff6ff", tx:"#2563eb", bd:"#bfdbfe" }, 중간: { bg:"#f5f3ff", tx:"#7c3aed", bd:"#ddd6fe" }, 낮음: { bg:"#f9fafb", tx:"#6b7280", bd:"#e5e7eb" } };

  const steps = [
    { n:"01", icon:"📥", label:"리뷰 수집", sub:"커뮤니티/쿠팡/네이버", done: phase !== "intro" },
    { n:"02", icon:"🧠", label:"AI 분석", sub:"Claude 패턴 인식", done: phase === "analyzing" || phase === "result" },
    { n:"03", icon:"💡", label:"인사이트", sub:"상품기획 기회 도출", done: phase === "result" },
  ];

  const tabs = [
    { key:"complaints", label:"불만 사항", emoji:"🔴", items: result?.complaints },
    { key:"buyReasons", label:"구매 이유", emoji:"🔵", items: result?.buyReasons },
    { key:"opportunities", label:"기획 기회", emoji:"🟢", items: result?.opportunities },
  ];

  return (
    <div style={{ minHeight:"100vh", background:"#f1f5f9", fontFamily:"'Apple SD Gothic Neo','Malgun Gothic',sans-serif", color:"#1e293b" }}>

      {/* Header */}
      <div style={{ background:"#fff", borderBottom:"1px solid #e2e8f0", padding:"14px 28px", display:"flex", alignItems:"center", gap:12 }}>
        <div style={{ width:38, height:38, background:"linear-gradient(135deg,#3b82f6,#6366f1)", borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>🔍</div>
        <div>
          <div style={{ fontSize:15, fontWeight:800, color:"#1e293b" }}>AI Review Analyzer</div>
          <div style={{ fontSize:11, color:"#94a3b8" }}>스테인리스 주방용품 · 소비자 인사이트 추출</div>
        </div>
        <div style={{ marginLeft:"auto", padding:"5px 14px", background:"#eff6ff", borderRadius:20, fontSize:11, color:"#3b82f6", fontWeight:600, border:"1px solid #bfdbfe" }}>
          DATA: 커뮤니티/포럼 리뷰 20건
        </div>
      </div>

      <div style={{ maxWidth:860, margin:"0 auto", padding:"28px 20px" }}>

        {/* Steps */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12, marginBottom:28 }}>
          {steps.map((s,i) => (
            <div key={i} style={{ background: s.done ? "#eff6ff" : "#fff", border:`1px solid ${s.done?"#bfdbfe":"#e2e8f0"}`, borderRadius:12, padding:"16px 18px", transition:"all 0.4s" }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
                <span style={{ fontSize:18 }}>{s.icon}</span>
                <span style={{ fontSize:10, fontWeight:700, color:s.done?"#3b82f6":"#cbd5e1", letterSpacing:1 }}>STEP {s.n}</span>
                {s.done && <span style={{ marginLeft:"auto", color:"#3b82f6", fontWeight:700 }}>✓</span>}
              </div>
              <div style={{ fontSize:13, fontWeight:700, color:s.done?"#1d4ed8":"#94a3b8" }}>{s.label}</div>
              <div style={{ fontSize:11, color:"#94a3b8", marginTop:2 }}>{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Intro */}
        {phase === "intro" && (
          <div style={{ background:"#fff", border:"1px solid #e2e8f0", borderRadius:16, padding:"48px 32px", textAlign:"center", boxShadow:"0 1px 3px rgba(0,0,0,0.04)" }}>
            <div style={{ fontSize:44, marginBottom:16 }}>🍳</div>
            <div style={{ fontSize:18, fontWeight:800, marginBottom:8 }}>소비자 리뷰 AI 분석</div>
            <div style={{ fontSize:13, color:"#64748b", marginBottom:6 }}>수집된 스테인리스 냄비 리뷰 데이터를 AI가 분석합니다</div>
            <div style={{ fontSize:12, color:"#94a3b8", marginBottom:36 }}>82cook · 클리앙 · 마일모아 · 딜바다 등 커뮤니티 기반 20건</div>
            <button onClick={runAnalysis} style={{ background:"linear-gradient(135deg,#3b82f6,#6366f1)", border:"none", borderRadius:10, padding:"14px 44px", color:"#fff", fontSize:15, fontWeight:700, cursor:"pointer", boxShadow:"0 4px 14px rgba(59,130,246,0.3)" }}>
              ▶ AI 분석 실행
            </button>
            {error && (
              <div style={{ marginTop:24, background:"#fef2f2", border:"1px solid #fecaca", borderRadius:10, padding:"16px 20px", textAlign:"left" }}>
                <div style={{ fontWeight:700, color:"#dc2626", marginBottom:6, fontSize:13 }}>⚠ 오류 발생</div>
                <div style={{ fontSize:11, color:"#991b1b", wordBreak:"break-all", lineHeight:1.7 }}>{error}</div>
              </div>
            )}
          </div>
        )}

        {/* Loading */}
        {(phase === "collecting" || phase === "analyzing") && (
          <div style={{ background:"#fff", border:"1px solid #e2e8f0", borderRadius:16, padding:"60px 32px", textAlign:"center", boxShadow:"0 1px 3px rgba(0,0,0,0.04)" }}>
            <div style={{ width:52, height:52, margin:"0 auto 24px", borderRadius:"50%", border:"4px solid #e2e8f0", borderTop:"4px solid #3b82f6", animation:"spin 0.9s linear infinite" }} />
            <div style={{ fontSize:16, fontWeight:700, marginBottom:8 }}>
              {phase === "collecting" ? "리뷰 데이터 수집 중" : "AI 패턴 분석 중"}{dots}
            </div>
            <div style={{ fontSize:12, color:"#94a3b8" }}>
              {phase === "collecting" ? "커뮤니티/포럼 리뷰 데이터 로딩" : "Claude AI가 구매 이유·불만·기회를 추출하고 있습니다"}
            </div>
          </div>
        )}

        {/* Result */}
        {phase === "result" && result && (
          <div>
            <div style={{ background:"linear-gradient(135deg,#eff6ff,#f5f3ff)", border:"1px solid #c7d2fe", borderRadius:14, padding:"20px 24px", marginBottom:24, display:"flex", alignItems:"center", gap:16 }}>
              <div style={{ fontSize:34 }}>💡</div>
              <div>
                <div style={{ fontSize:10, fontWeight:700, color:"#6366f1", letterSpacing:1, marginBottom:4 }}>핵심 인사이트 (TYS 관점)</div>
                <div style={{ fontSize:15, fontWeight:700, color:"#1e293b", lineHeight:1.5 }}>{result.keyInsight}</div>
              </div>
            </div>

            <div style={{ background:"#fff", border:"1px solid #e2e8f0", borderRadius:14, overflow:"hidden", boxShadow:"0 1px 3px rgba(0,0,0,0.04)" }}>
              <div style={{ display:"flex", borderBottom:"1px solid #e2e8f0", background:"#f8fafc" }}>
                {tabs.map(tab => (
                  <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{ flex:1, padding:"13px 12px", background: activeTab===tab.key ? "#fff" : "transparent", border:"none", borderBottom: activeTab===tab.key ? "2px solid #3b82f6" : "2px solid transparent", color: activeTab===tab.key ? "#1e293b" : "#94a3b8", fontSize:13, fontWeight: activeTab===tab.key ? 700 : 500, cursor:"pointer", transition:"all 0.2s", fontFamily:"inherit" }}>
                    {tab.emoji} {tab.label} ({tab.items?.length || 0})
                  </button>
                ))}
              </div>
              <div style={{ padding:"20px" }}>
                {tabs.find(t => t.key === activeTab)?.items?.map((item, i) => {
                  const isOpp = activeTab === "opportunities";
                  const isReason = activeTab === "buyReasons";
                  const val = isOpp ? item.impact : isReason ? item.frequency : item.severity;
                  const clrMap = isReason ? freqClr : severityClr;
                  const c = clrMap[val] || clrMap["중간"];
                  const leftColor = isOpp ? "#10b981" : c.tx;
                  const label = isOpp ? `임팩트 ${val}` : isReason ? `빈도 ${val}` : `심각도 ${val}`;
                  const tagBg = isOpp ? "#f0fdf4" : c.bg;
                  const tagTx = isOpp ? "#16a34a" : c.tx;
                  const tagBd = isOpp ? "#bbf7d0" : c.bd;
                  return (
                    <div key={i} style={{ border:"1px solid #e2e8f0", borderLeft:`4px solid ${leftColor}`, borderRadius:10, padding:"16px 20px", marginBottom:12, background:"#fff" }}>
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
                        <div style={{ fontSize:14, fontWeight:700, color:"#1e293b" }}>{item.title}</div>
                        <span style={{ padding:"3px 10px", background:tagBg, color:tagTx, border:`1px solid ${tagBd}`, borderRadius:20, fontSize:11, fontWeight:700, whiteSpace:"nowrap", marginLeft:12 }}>{label}</span>
                      </div>
                      <div style={{ fontSize:13, color:"#64748b", lineHeight:1.7 }}>{item.description}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={{ textAlign:"center", marginTop:20 }}>
              <button onClick={() => { setPhase("intro"); setResult(null); setActiveTab("complaints"); }} style={{ background:"#fff", border:"1px solid #e2e8f0", borderRadius:8, padding:"9px 22px", color:"#64748b", fontSize:13, cursor:"pointer", fontFamily:"inherit" }}>
                ↺ 다시 분석
              </button>
            </div>
          </div>
        )}
      </div>
      <style>{`@keyframes spin { to { transform:rotate(360deg); } }`}</style>
    </div>
  );
}
