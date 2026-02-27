import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchBarters,
  updateBarterStatus,
  scheduleSession,
} from "../features/barters/bartersSlice";
import { createReview } from "../features/reviews/reviewsSlice";
import { fetchProfile } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";

const statusConfig = {
  Pending:   { color: "#D97706", bg: "#FFFBEB" },
  Accepted:  { color: "#2563EB", bg: "#EFF6FF" },
  Completed: { color: "#059669", bg: "#ECFDF5" },
  Rejected:  { color: "#DC2626", bg: "#FEF2F2" },
};

const styles = {
  page: {
    minHeight: "100vh",
    background: "#F3F4F6",
    padding: "40px 20px",
    fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
  },
  wrap: { maxWidth: 700, margin: "0 auto" },
  heading: { fontSize: 24, fontWeight: 700, color: "#111827", margin: 0, letterSpacing: "-0.4px" },
  sub: { fontSize: 13, color: "#9CA3AF", marginTop: 4 },
  card: {
    background: "#fff",
    border: "1px solid #E5E7EB",
    borderRadius: 12,
    padding: 24,
    marginTop: 16,
    boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
  },
  row: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  id: { fontSize: 12, color: "#9CA3AF", marginBottom: 6, fontWeight: 500 },
  badge: (s) => ({
    fontSize: 11,
    fontWeight: 700,
    padding: "3px 9px",
    borderRadius: 20,
    letterSpacing: "0.3px",
    color: statusConfig[s]?.color ?? "#374151",
    background: statusConfig[s]?.bg ?? "#F3F4F6",
  }),
  hr: { border: "none", borderTop: "1px solid #F3F4F6", margin: "16px 0" },
  sectionTitle: { fontSize: 11, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 10 },
  sessionRow: {
    display: "flex", gap: 14, alignItems: "center",
    background: "#F9FAFB", borderRadius: 8, padding: "7px 12px",
    fontSize: 13, color: "#374151", marginBottom: 6,
  },
  btnGroup: { display: "flex", gap: 8, flexWrap: "wrap" },
  btn: (v) => {
    const map = {
      green:  ["#059669", "#fff"],
      red:    ["#DC2626", "#fff"],
      blue:   ["#2563EB", "#fff"],
      dark:   ["#1F2937", "#fff"],
      purple: ["#7C3AED", "#fff"],
      ghost:  ["#F3F4F6", "#374151"],
    };
    const [bg, color] = map[v] ?? map.ghost;
    return { padding: "8px 14px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600, background: bg, color };
  },
  input: {
    width: "100%", padding: "9px 12px", border: "1px solid #E5E7EB",
    borderRadius: 8, fontSize: 13, color: "#111827", outline: "none",
    marginBottom: 10, boxSizing: "border-box", background: "#fff",
  },
  grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 },
  empty: { textAlign: "center", color: "#9CA3AF", padding: "60px 0", fontSize: 14 },
};

export default function BarterDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { barters, loading } = useSelector((s) => s.barters);
  const { user } = useSelector((s) => s.auth);

  const [reviewData, setReviewData] = useState({ rating: 5, comment: "" });
  const [scheduleData, setScheduleData] = useState({ date: "", time: "", mode: "Online" });
  const [openSchedule, setOpenSchedule] = useState(null);
  const [openReview, setOpenReview] = useState(null);
  const [reviewedBarters, setReviewedBarters] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("reviewedBarters") || "[]");
    } catch { return []; }
  });

  useEffect(() => { dispatch(fetchBarters()); }, [dispatch]);

  const handleStatus = async (id, status) => {
    await dispatch(updateBarterStatus({ id, status }));
    await dispatch(fetchBarters());
    await dispatch(fetchProfile());
  };

  const handleSchedule = async (barterId) => {
    await dispatch(scheduleSession({ id: barterId, data: scheduleData }));
    setScheduleData({ date: "", time: "", mode: "Online" });
    setOpenSchedule(null);
    await dispatch(fetchBarters());
  };

  const handleReview = async (barter) => {
    const senderId   = typeof barter.senderId   === "object" ? barter.senderId._id   : barter.senderId;
    const receiverId = typeof barter.receiverId  === "object" ? barter.receiverId._id : barter.receiverId;
    const revieweeId = senderId === user._id ? receiverId : senderId;
    await dispatch(createReview({ revieweeId, barterId: barter._id, ...reviewData }));
    setReviewData({ rating: 5, comment: "" });
    setOpenReview(null);
    const updated = [...reviewedBarters, barter._id];
    setReviewedBarters(updated);
    try { localStorage.setItem("reviewedBarters", JSON.stringify(updated)); } catch {}
    await dispatch(fetchProfile());
  };

  return (
    <div style={styles.page}>
      <div style={styles.wrap}>
        <h1 style={styles.heading}>My Barters</h1>
        <p style={styles.sub}>{barters.length} exchange{barters.length !== 1 ? "s" : ""}</p>

        {loading && <p style={styles.empty}>Loading…</p>}
        {!loading && barters.length === 0 && <p style={styles.empty}>No barters yet.</p>}

        {barters.map((barter) => {
          const receiverId = typeof barter.receiverId === "object" ? barter.receiverId._id : barter.receiverId;
          const isReceiver = receiverId === user._id;
          const { status } = barter;

          return (
            <div key={barter._id} style={styles.card}>

              {/* Header */}
              <div style={styles.row}>
                <div>
                  <div style={styles.id}>#{barter._id.slice(-8).toUpperCase()}</div>
                  <span style={styles.badge(status)}>{status}</span>
                </div>
              </div>

              {/* Sessions */}
              {barter.sessions?.length > 0 && (
                <>
                  <hr style={styles.hr} />
                  <div style={styles.sectionTitle}>Sessions</div>
                  {barter.sessions.map((s, i) => (
                    <div key={i} style={styles.sessionRow}>
                      <span>📅 {s.date}</span>
                      <span style={{ color: "#6B7280" }}>⏰ {s.time}</span>
                      <span style={{ color: "#6B7280" }}>{s.mode}</span>
                    </div>
                  ))}
                </>
              )}

              {/* Pending */}
              {status === "Pending" && isReceiver && (
                <>
                  <hr style={styles.hr} />
                  <div style={styles.btnGroup}>
                    <button style={styles.btn("green")} onClick={() => handleStatus(barter._id, "Accepted")}>Accept</button>
                    <button style={styles.btn("red")}   onClick={() => handleStatus(barter._id, "Rejected")}>Reject</button>
                  </div>
                </>
              )}

              {/* Accepted */}
              {status === "Accepted" && (
                <>
                  <hr style={styles.hr} />
                  <div style={styles.btnGroup}>
                    <button style={styles.btn("blue")}   onClick={() => handleStatus(barter._id, "Completed")}>Mark Completed</button>
                    <button style={styles.btn("dark")}   onClick={() => navigate(`/chat/${barter._id}`)}>Open Chat</button>
                    <button style={styles.btn("ghost")}  onClick={() => setOpenSchedule(openSchedule === barter._id ? null : barter._id)}>
                      {openSchedule === barter._id ? "Cancel" : "Schedule Session"}
                    </button>
                  </div>

                  {openSchedule === barter._id && (
                    <div style={{ marginTop: 16 }}>
                      <div style={styles.sectionTitle}>New Session</div>
                      <div style={styles.grid2}>
                        <input type="date" style={styles.input} value={scheduleData.date}
                          onChange={(e) => setScheduleData({ ...scheduleData, date: e.target.value })} />
                        <input type="time" style={styles.input} value={scheduleData.time}
                          onChange={(e) => setScheduleData({ ...scheduleData, time: e.target.value })} />
                      </div>
                      <select style={styles.input} value={scheduleData.mode}
                        onChange={(e) => setScheduleData({ ...scheduleData, mode: e.target.value })}>
                        <option value="Online">Online</option>
                        <option value="In-Person">In-Person</option>
                      </select>
                      <button style={styles.btn("purple")} onClick={() => handleSchedule(barter._id)}>Add Session</button>
                    </div>
                  )}
                </>
              )}

              {/* Completed */}
              {status === "Completed" && (
                <>
                  <hr style={styles.hr} />
                  {reviewedBarters.includes(barter._id) || barter.reviewedByMe ? (
                    <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#059669", fontWeight: 600 }}>
                      <span>✅</span> Review submitted
                    </div>
                  ) : (
                    <>
                      <button style={styles.btn("ghost")} onClick={() => setOpenReview(openReview === barter._id ? null : barter._id)}>
                        {openReview === barter._id ? "Cancel" : "Leave a Review"}
                      </button>

                      {openReview === barter._id && (
                        <div style={{ marginTop: 16 }}>
                          <div style={styles.sectionTitle}>Your Review</div>
                          <select style={{ ...styles.input, width: "auto", marginBottom: 12 }}
                            value={reviewData.rating}
                            onChange={(e) => setReviewData({ ...reviewData, rating: Number(e.target.value) })}>
                            {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{"★".repeat(n)} &nbsp;{n} star{n !== 1 ? "s" : ""}</option>)}
                          </select>
                          <textarea
                            style={{ ...styles.input, resize: "vertical", minHeight: 80 }}
                            placeholder="Share your experience…"
                            value={reviewData.comment}
                            onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                          />
                          <button style={styles.btn("purple")} onClick={() => handleReview(barter)}>Submit Review</button>
                        </div>
                      )}
                    </>
                  )}
                </>
              )}

            </div>
          );
        })}
      </div>
    </div>
  );
}