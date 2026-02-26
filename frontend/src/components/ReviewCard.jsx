function ReviewCard({ review }) {
  return (
    <div className="border p-4 rounded shadow">
      <p className="font-bold">Rating: ⭐ {review.rating}</p>
      <p>{review.comment}</p>
    </div>
  );
}

export default ReviewCard;