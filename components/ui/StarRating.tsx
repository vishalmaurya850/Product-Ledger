import { Star } from "lucide-react";
import { motion } from "framer-motion";

type StarRatingProps = {
  rating: number; 
  maxStars?: number; 
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
};

const StarRating = ({
  rating = 0,
  maxStars = 5,
  size = 'md',
  showText = true
}: StarRatingProps) => {
 
  const sizeClasses = {
    'sm': 'h-4 w-4',
    'md': 'h-6 w-6',
    'lg': 'h-8 w-8'
  };

   return (
    <div className="flex items-center justify-center mt-6 gap-0.5">
     {[...Array(maxStars)].map((_, index) => {
        const starValue = index + 1;
        const isFilled = starValue <= Math.floor(rating);
        const isHalf = rating % 1 >= 0.5 && starValue === Math.ceil(rating);

        return (
          <motion.div 
            key={index} 
            className="relative"
            whileHover={{ scale: 1.2 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Star
              className={`${sizeClasses[size]} text-gray-600`}
              fill="transparent"
              strokeWidth={1.2}
            />
            {(isFilled || isHalf) && (
              <div className={`absolute top-0 left-0 ${isHalf ? 'w-1/2 overflow-hidden' : 'w-full'}`}>
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: index * 0.05 }}
                >
                <Star
                  className={`${sizeClasses[size]} text-yellow-400`}
                  fill="currentColor"
                  strokeWidth={0}
                />
                </motion.div>
              </div>
            )}
          </motion.div>
        );
      })}
      {showText && (
         <motion.span 
          className="ml-2 text-sm text-gray-500"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: maxStars * 0.05 }}
        >
          {rating.toFixed(1)}
        </motion.span>
      )}
    </div>
  );
}

<<<<<<< HEAD
export default StarRating
=======
export default StarRating
>>>>>>> 5d2afdf1da669018d0f5aae77b62470d7f05bce3
