import React from "react";
import { Review } from "../types";

export interface ReviewListProps {
  reviews: Review[];
}

export const ReviewList: React.FC<ReviewListProps> = () => {
  return (
    <div className="space-y-4">
      {/* Review List Shell */}
    </div>
  );
};
