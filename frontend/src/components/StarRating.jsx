import { Star, StarHalf } from "lucide-react";

const StarRating = ({ rating = 0, numReviews }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (rating >= i) {
      stars.push(<Star key={i} size={15} fill="#f5a524" color="#f5a524" />);
    } else if (rating >= i - 0.5) {
      stars.push(<StarHalf key={i} size={15} fill="#f5a524" color="#f5a524" />);
    } else {
      stars.push(<Star key={i} size={15} color="#d8dce1" />);
    }
  }

  return (
    <div className="star-rating">
      <span className="stars">{stars}</span>
      {typeof numReviews === "number" && (
        <span className="review-count">({numReviews})</span>
      )}
    </div>
  );
};

export default StarRating;
