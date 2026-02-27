import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { fetchReviews } from "../features/reviews/reviewsSlice";
import { fetchProfile } from "../features/auth/authSlice";

// ─── Helpers ────────────────────────────────────────────────────────────────

const palette = [
  ["#7C3AED", "#EDE9FE"],
  ["#2563EB", "#EFF6FF"],
  ["#059669", "#ECFDF5"],
  ["#D97706", "#FFFBEB"],
  ["#DC2626", "#FEF2F2"],
  ["#0891B2", "#ECFEFF"],
];

function getInitials(name = "") {
  return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
}

function getColors(name = "") {
  return palette[(name?.charCodeAt(0) ?? 0) % palette.length];
}

function formatDate(str) {
  if (!str) return "";
  return new Date(str).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function Stars({ rating, size = 13 }) {
  return (
    <div style={{ display: "flex", gap: 2 }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n} style={{ fontSize: size, color: n <= rating ? "#F59E0B" : "#E5E7EB" }}>★</span>
      ))}
    </div>
  );
}

function ReviewCard({ review }) {
  const name = review.reviewerId?.name ?? "Anonymous";
  const [fg, bg] = getColors(name);

  return (
    <div style={{
      background: "#fff",
      border: "1px solid #E5E7EB",
      borderRadius: 12,
      padding: "16px 20px",
      boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 38, height: 38, borderRadius: "50%",
            background: bg, color: fg,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 700, fontSize: 13, flexShrink: 0,
          }}>
            {getInitials(name)}
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>{name}</div>
            <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 1 }}>{formatDate(review.createdAt)}</div>
          </div>
        </div>
        <Stars rating={review.rating} />
      </div>

      {review.comment && (
        <p style={{
          margin: 0, marginTop: 12, paddingTop: 12,
          borderTop: "1px solid #F3F4F6",
          fontSize: 13, color: "#4B5563", lineHeight: 1.65,
        }}>
          "{review.comment}"
        </p>
      )}
    </div>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const s = {
  page: {
    minHeight: "100vh",
    background: "#F3F4F6",
    padding: "40px 20px",
    fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
  },
  wrap: { maxWidth: 700, margin: "0 auto" },
  card: {
    background: "#fff",
    border: "1px solid #E5E7EB",
    borderRadius: 14,
    padding: 28,
    boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
    marginBottom: 24,
  },
  avatarRow: { display: "flex", alignItems: "center", gap: 18, marginBottom: 24 },
  avatar: {
    width: 56, height: 56, borderRadius: "50%",
    background: "linear-gradient(135deg, #7C3AED, #3B82F6)",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 22, color: "#fff", fontWeight: 700, flexShrink: 0,
  },
  name: { fontSize: 20, fontWeight: 700, color: "#111827", letterSpacing: "-0.3px", margin: 0 },
  email: { fontSize: 13, color: "#9CA3AF", marginTop: 2 },
  statsRow: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
  statBox: { background: "#F9FAFB", border: "1px solid #F3F4F6", borderRadius: 10, padding: "14px 18px" },
  statLabel: { fontSize: 11, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 6 },
  statValue: { fontSize: 22, fontWeight: 700, color: "#111827", letterSpacing: "-0.5px" },
  statSub: { fontSize: 12, color: "#6B7280", marginTop: 2 },
  sectionHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 },
  sectionTitle: { fontSize: 15, fontWeight: 700, color: "#111827", margin: 0, letterSpacing: "-0.2px" },
  reviewCount: { fontSize: 12, color: "#9CA3AF", fontWeight: 500 },
  reviewStack: { display: "flex", flexDirection: "column", gap: 10 },
  empty: {
    background: "#fff", border: "1px solid #E5E7EB", borderRadius: 12,
    padding: "40px 24px", textAlign: "center", color: "#9CA3AF", fontSize: 14,
  },
};

// ─── Profile ─────────────────────────────────────────────────────────────────

export default function Profile() {
  const { user } = useSelector((state) => state.auth);
  const { reviews } = useSelector((state) => state.reviews);
  const dispatch = useDispatch();

  useEffect(() => { dispatch(fetchProfile()); }, [dispatch]);

  useEffect(() => {
    if (user?._id) dispatch(fetchReviews(user._id));
  }, [dispatch, user?._id]);

  if (!user) return null;

  const trustScore = Number(user.trustScore ?? 0);

  return (
    <div style={s.page}>
      <div style={s.wrap}>

        {/* Profile Card */}
        <div style={s.card}>
          <div style={s.avatarRow}>
            <div style={s.avatar}>{getInitials(user.name)}</div>
            <div>
              <p style={s.name}>{user.name}</p>
              <p style={s.email}>{user.email}</p>
            </div>
          </div>

          <div style={s.statsRow}>
            <div style={s.statBox}>
              <div style={s.statLabel}>Credits</div>
              <div style={s.statValue}>{user.credits ?? 0}</div>
              <div style={s.statSub}>available balance</div>
            </div>
            <div style={s.statBox}>
              <div style={s.statLabel}>Trust Score</div>
              <div style={{ ...s.statValue, display: "flex", alignItems: "center", gap: 8 }}>
                {trustScore.toFixed(1)}
                <Stars rating={Math.round(trustScore)} size={15} />
              </div>
              <div style={s.statSub}>based on {reviews.length} review{reviews.length !== 1 ? "s" : ""}</div>
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div style={s.sectionHeader}>
          <h3 style={s.sectionTitle}>Reviews Received</h3>
          {reviews.length > 0 && (
            <span style={s.reviewCount}>{reviews.length} total</span>
          )}
        </div>

        {reviews.length === 0 ? (
          <div style={s.empty}>No reviews yet.</div>
        ) : (
          <div style={s.reviewStack}>
            {reviews.map((review) => (
              <ReviewCard key={review._id} review={review} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}