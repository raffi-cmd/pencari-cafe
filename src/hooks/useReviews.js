import { useLocalStorage } from "./useLocalStorage";

const initialSampleReviews = [
  {
    id: "rev-1",
    cafeId: "shop-01",
    userName: "Dimas Pratama",
    rating: 5,
    comment: "WiFi kencang banget dan suasananya sangat mendukung buat kerja seharian. Manual brew Gayo-nya the best!",
    createdAt: "2026-08-15"
  },
  {
    id: "rev-2",
    cafeId: "shop-03",
    userName: "Siti Rahma",
    rating: 5,
    comment: "Kopi Susu Tetangga nggak pernah salah! Selalu mampir sebelum berangkat ke kantor.",
    createdAt: "2026-08-20"
  },
  {
    id: "rev-3",
    cafeId: "shop-04",
    userName: "Kevin Wijaya",
    rating: 5,
    comment: "Salah satu tempat WFC terbaik di Gandaria. Kursi ergonomis, colokan banyak dan pastry-nya enak.",
    createdAt: "2026-08-28"
  }
];

export function useReviews() {
  const [reviews, setReviews] = useLocalStorage("kopidex_reviews", initialSampleReviews);

  const addReview = ({ cafeId, userName, rating, comment }) => {
    const newReview = {
      id: "rev-" + Date.now(),
      cafeId,
      userName: userName.trim() || "Pecinta Kopi",
      rating: Number(rating) || 5,
      comment: comment.trim(),
      createdAt: new Date().toISOString().split("T")[0]
    };
    setReviews([newReview, ...reviews]);
    return newReview;
  };

  const getCafeReviews = (cafeId) => reviews.filter((r) => r.cafeId === cafeId);

  const deleteReview = (reviewId) => {
    setReviews(reviews.filter((r) => r.id !== reviewId));
  };

  return {
    reviews,
    addReview,
    getCafeReviews,
    deleteReview,
    totalReviews: reviews.length
  };
}
