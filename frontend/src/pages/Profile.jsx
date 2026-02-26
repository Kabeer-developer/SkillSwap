import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { fetchReviews } from "../features/reviews/reviewsSlice";
import ReviewCard from "../components/ReviewCard";

function Profile() {
  const { user } = useSelector((state) => state.auth);
  const { reviews } = useSelector((state) => state.reviews);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user?._id) {
      dispatch(fetchReviews(user._id));
    }
  }, [dispatch, user]);

  if (!user) return null;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Profile</h2>

      <div className="mb-6">
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Credits:</strong> {user.credits}</p>
        <p><strong>Trust Score:</strong> ⭐ {user.trustScore}</p>
      </div>

      <h3 className="text-xl font-semibold mb-2">Reviews</h3>
      <div className="space-y-3">
        {reviews.map((review) => (
          <ReviewCard key={review._id} review={review} />
        ))}
      </div>
    </div>
  );
}

export default Profile;