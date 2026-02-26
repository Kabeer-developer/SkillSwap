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

function BarterDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { barters, loading } = useSelector((state) => state.barters);
  const { user } = useSelector((state) => state.auth);

  const [reviewData, setReviewData] = useState({
    rating: 5,
    comment: "",
  });

  const [scheduleData, setScheduleData] = useState({
    date: "",
    time: "",
    mode: "Online",
  });

  useEffect(() => {
    dispatch(fetchBarters());
  }, [dispatch]);

  // ================= STATUS UPDATE =================
  const handleStatus = async (id, status) => {
    await dispatch(updateBarterStatus({ id, status }));
    await dispatch(fetchBarters());
    await dispatch(fetchProfile()); // refresh credits
  };

  // ================= REVIEW =================
  const handleReview = async (barter) => {
    // FIX: Proper ID extraction (populate-safe)
    const senderId =
      typeof barter.senderId === "object"
        ? barter.senderId._id
        : barter.senderId;

    const receiverId =
      typeof barter.receiverId === "object"
        ? barter.receiverId._id
        : barter.receiverId;

    // Determine who is the other user
    const revieweeId =
      senderId === user._id ? receiverId : senderId;

    await dispatch(
      createReview({
        revieweeId,
        barterId: barter._id,
        rating: reviewData.rating,
        comment: reviewData.comment,
      })
    );

    setReviewData({ rating: 5, comment: "" });

    await dispatch(fetchProfile()); // refresh trustScore
  };

  // ================= SCHEDULE =================
  const handleSchedule = async (barterId) => {
    await dispatch(
      scheduleSession({
        id: barterId,
        data: scheduleData,
      })
    );

    setScheduleData({
      date: "",
      time: "",
      mode: "Online",
    });

    await dispatch(fetchBarters());
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">My Barters</h2>

      {loading && <p>Loading...</p>}

      <div className="space-y-6">
        {barters.map((barter) => {
          // FIX: receiver check populate-safe
          const receiverId =
            typeof barter.receiverId === "object"
              ? barter.receiverId._id
              : barter.receiverId;

          const isReceiver = receiverId === user._id;

          return (
            <div
              key={barter._id}
              className="border p-4 rounded shadow"
            >
              <p>
                <strong>Status:</strong> {barter.status}
              </p>

              {/* Always show sessions */}
              {barter.sessions?.length > 0 && (
                <div className="mt-3 border p-3 bg-gray-50">
                  <h4 className="font-semibold mb-2">
                    Scheduled Sessions
                  </h4>
                  {barter.sessions.map((session, i) => (
                    <div key={i} className="text-sm">
                      📅 {session.date} | ⏰ {session.time} | {session.mode}
                    </div>
                  ))}
                </div>
              )}

              {/* ================= Pending ================= */}
              {barter.status === "Pending" && isReceiver && (
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() =>
                      handleStatus(barter._id, "Accepted")
                    }
                    className="bg-green-500 text-white px-3 py-1"
                  >
                    Accept
                  </button>

                  <button
                    onClick={() =>
                      handleStatus(barter._id, "Rejected")
                    }
                    className="bg-red-500 text-white px-3 py-1"
                  >
                    Reject
                  </button>
                </div>
              )}

              {/* ================= Accepted ================= */}
              {barter.status === "Accepted" && (
                <div className="mt-3 space-y-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        handleStatus(barter._id, "Completed")
                      }
                      className="bg-blue-500 text-white px-3 py-1"
                    >
                      Mark Completed
                    </button>

                    <button
                      onClick={() =>
                        navigate(`/chat/${barter._id}`)
                      }
                      className="bg-gray-700 text-white px-3 py-1"
                    >
                      Open Chat
                    </button>
                  </div>

                  {/* Schedule Form */}
                  <div className="border p-3 mt-3">
                    <h4 className="font-semibold mb-2">
                      Schedule Session
                    </h4>

                    <input
                      type="date"
                      value={scheduleData.date}
                      className="border p-2 mb-2 w-full"
                      onChange={(e) =>
                        setScheduleData({
                          ...scheduleData,
                          date: e.target.value,
                        })
                      }
                    />

                    <input
                      type="time"
                      value={scheduleData.time}
                      className="border p-2 mb-2 w-full"
                      onChange={(e) =>
                        setScheduleData({
                          ...scheduleData,
                          time: e.target.value,
                        })
                      }
                    />

                    <select
                      value={scheduleData.mode}
                      className="border p-2 mb-2 w-full"
                      onChange={(e) =>
                        setScheduleData({
                          ...scheduleData,
                          mode: e.target.value,
                        })
                      }
                    >
                      <option value="Online">Online</option>
                      <option value="In-Person">In-Person</option>
                    </select>

                    <button
                      onClick={() =>
                        handleSchedule(barter._id)
                      }
                      className="bg-purple-600 text-white px-3 py-1"
                    >
                      Add Session
                    </button>
                  </div>
                </div>
              )}

              {/* ================= Completed ================= */}
              {barter.status === "Completed" && (
                <div className="mt-4">
                  <h4 className="font-semibold mb-2">
                    Leave Review
                  </h4>

                  <select
                    className="border p-2 mb-2"
                    value={reviewData.rating}
                    onChange={(e) =>
                      setReviewData({
                        ...reviewData,
                        rating: Number(e.target.value),
                      })
                    }
                  >
                    <option value={5}>5</option>
                    <option value={4}>4</option>
                    <option value={3}>3</option>
                    <option value={2}>2</option>
                    <option value={1}>1</option>
                  </select>

                  <textarea
                    className="border p-2 w-full mb-2"
                    placeholder="Write review"
                    value={reviewData.comment}
                    onChange={(e) =>
                      setReviewData({
                        ...reviewData,
                        comment: e.target.value,
                      })
                    }
                  />

                  <button
                    onClick={() =>
                      handleReview(barter)
                    }
                    className="bg-purple-600 text-white px-4 py-2"
                  >
                    Submit Review
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default BarterDashboard;