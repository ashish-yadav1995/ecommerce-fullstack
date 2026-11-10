import { createContext, useContext, useCallback, useEffect, useState } from "react";

const ReviewContext = createContext();

export const useReview = () => useContext(ReviewContext);

import { addReviews, getSingleProductReviews, updateReviews, deleteReviews } from "../services/reviews";

function ReviewProvider({ children }) {
    const [reviews, setReviews] = useState([]);
    const [totalReviews, setTotalReviews] = useState(0);
    const [averageRating, setAverageRating] = useState(0);

    const handleAddReviews = async (data) => {
        debugger
        const response = await addReviews(data);
        if (response.success) {
            setReviews(prevReviews => [...prevReviews, response.data]);
        }
        console.log(response);
        return response;
    };

    
const handleGetSinglegProductReviews = useCallback(async (id) => {
  try {
    const response = await getSingleProductReviews(id);

    console.log("from reviewContext", response);

    setReviews((prevReviews) => {
      const updatedReviews = [...prevReviews, ...response.data];

      return updatedReviews.filter((item, index, self) =>
        index === self.findIndex(
          (review) => review._id === item._id
        )
      );
    });

    setTotalReviews(response.totalReviews);
    setAverageRating(response.averageRating);

  } catch (error) {
    console.log("error to fetching reviews", error);
  }
}, []);

    const handleUpdateReviews = async (id, data) => {
        const response = await updateReviews(id, data);
        console.log("from reviewContext", response);
        if (response.success) {
            setReviews(prevReviews =>
                prevReviews.map(review => 
                    review._id === id
                        ? {
                            ...review,
                            ...response.data,
                            user: review.user // Purana user object (naam ke sath) wapas set kar diya
                        }
                        : review
                )
            );

        }
        console.log(response);
        return response;
    };

    const handleDeleteReviews = async (id) => {
        const response = await deleteReviews(id);
        console.log("from reviewContext", response);
        debugger
        if (response.success) {
            setReviews((prevReviews) =>
                prevReviews.filter((review) => review._id !== id)
            );
        }
        return response;
    };
    console.log("reviews final------------------------", reviews);

    return (
        <ReviewContext.Provider value={{ reviews, setReviews, totalReviews, averageRating, handleAddReviews, handleGetSinglegProductReviews, handleUpdateReviews, handleDeleteReviews }}>
            {children}
        </ReviewContext.Provider>
    );
}

export default ReviewProvider;