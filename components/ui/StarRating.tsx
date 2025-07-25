import { Star } from "lucide-react";

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
          <div key={index} className="relative">
            <Star
              className={`${sizeClasses[size]} text-gray-600`}
              fill="transparent"
              strokeWidth={1.2}
            />
            {(isFilled || isHalf) && (
              <div className={`absolute top-0 left-0 ${isHalf ? 'w-1/2 overflow-hidden' : 'w-full'}`}>
                <Star
                  className={`${sizeClasses[size]} text-yellow-400`}
                  fill="currentColor"
                  strokeWidth={0}
                />
              </div>
            )}
          </div>
        );
      })}
      {showText && (
        <span className="ml-2 text-sm text-gray-500">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}

export default StarRating
