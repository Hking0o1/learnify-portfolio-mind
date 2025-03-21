
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { StarIcon, ThumbsUp, MessageCircle, Flag, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { useUserAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";

// Types for review data
export interface ReviewData {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  content: string;
  createdAt: Date;
  likes: number;
  isInstructor?: boolean;
  isVerifiedPurchase?: boolean;
  replies: ReplyData[];
}

export interface ReplyData {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  createdAt: Date;
  isInstructor?: boolean;
}

interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  readOnly?: boolean;
  size?: "sm" | "md" | "lg";
}

// Star Rating Component
export const StarRating = ({ value, onChange, readOnly = false, size = "md" }: StarRatingProps) => {
  const [hoverValue, setHoverValue] = useState(0);
  
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6"
  };
  
  const className = sizeClasses[size];
  
  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className={`${readOnly ? "cursor-default" : "cursor-pointer"} p-0 mx-0.5`}
          onClick={() => !readOnly && onChange?.(star)}
          onMouseEnter={() => !readOnly && setHoverValue(star)}
          onMouseLeave={() => !readOnly && setHoverValue(0)}
          disabled={readOnly}
        >
          <StarIcon
            className={`${className} ${
              star <= (hoverValue || value)
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-300 dark:text-gray-600"
            }`}
          />
        </button>
      ))}
    </div>
  );
};

// Review Component
export const Review = ({ review, onReply, onDelete }: { 
  review: ReviewData; 
  onReply: (reviewId: string, content: string) => void;
  onDelete?: (reviewId: string) => void;
}) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const { toast } = useToast();
  const { isAdmin, isInstructor, userId } = useUserAuth();
  const canDelete = isAdmin || (userId === review.userId);
  
  const handleSubmitReply = () => {
    if (replyContent.trim()) {
      onReply(review.id, replyContent);
      setReplyContent("");
      setShowReplyForm(false);
      toast({
        title: "Reply submitted",
        description: "Your reply has been added to the review",
      });
    }
  };
  
  return (
    <Card className="mb-4 border-none shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={review.userAvatar} />
              <AvatarFallback>{review.userName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <p className="font-medium">{review.userName}</p>
                {review.isInstructor && (
                  <Badge variant="outline" className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">Instructor</Badge>
                )}
                {review.isVerifiedPurchase && (
                  <Badge variant="outline" className="text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300">Verified Purchase</Badge>
                )}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <StarRating value={review.rating} readOnly size="sm" />
                <span className="text-xs text-gray-500">
                  {formatDistanceToNow(review.createdAt, { addSuffix: true })}
                </span>
              </div>
            </div>
          </div>
          {canDelete && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => onDelete?.(review.id)}
              className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
              aria-label="Delete review"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-2 pb-3">
        <p className="text-gray-700 dark:text-gray-300">{review.content}</p>
      </CardContent>
      <CardFooter className="py-2 flex flex-col items-start">
        <div className="flex items-center gap-4 text-sm text-gray-500 w-full">
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex items-center gap-1 text-xs h-8"
            onClick={() => {
              toast({
                title: "Thanks for your feedback!",
                description: "You found this review helpful.",
              });
            }}
          >
            <ThumbsUp className="h-4 w-4 mr-1" />
            Helpful ({review.likes})
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex items-center gap-1 text-xs h-8"
            onClick={() => setShowReplyForm(!showReplyForm)}
          >
            <MessageCircle className="h-4 w-4 mr-1" />
            Reply ({review.replies.length})
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex items-center gap-1 text-xs h-8 ml-auto"
            onClick={() => {
              toast({
                title: "Report submitted",
                description: "We'll review this content shortly.",
              });
            }}
          >
            <Flag className="h-4 w-4 mr-1" />
            Report
          </Button>
        </div>
        
        {showReplyForm && (
          <div className="w-full mt-3">
            <Textarea
              placeholder="Write your reply..."
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              className="min-h-[80px] mb-2"
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowReplyForm(false)}>Cancel</Button>
              <Button size="sm" onClick={handleSubmitReply}>Submit Reply</Button>
            </div>
          </div>
        )}
        
        {review.replies.length > 0 && (
          <div className="w-full mt-3 space-y-3">
            {review.replies.map((reply) => (
              <div 
                key={reply.id}
                className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-md ml-4 border-l-2 border-blue-300"
              >
                <div className="flex items-center gap-2 mb-1">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={reply.userAvatar} />
                    <AvatarFallback className="text-xs">{reply.userName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium text-sm">{reply.userName}</span>
                  {reply.isInstructor && (
                    <Badge variant="outline" className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">Instructor</Badge>
                  )}
                  <span className="text-xs text-gray-500 ml-auto">
                    {formatDistanceToNow(reply.createdAt, { addSuffix: true })}
                  </span>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 ml-8">
                  {reply.content}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

// Review Form Component
export const ReviewForm = ({ onSubmit }: { 
  onSubmit: (rating: number, content: string) => void 
}) => {
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState("");
  const [showForm, setShowForm] = useState(false);
  const { toast } = useToast();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      toast({
        title: "Rating required",
        description: "Please provide a star rating for your review.",
        variant: "destructive",
      });
      return;
    }
    
    if (content.trim().length < 10) {
      toast({
        title: "Review too short",
        description: "Please provide a more detailed review (at least 10 characters).",
        variant: "destructive",
      });
      return;
    }
    
    onSubmit(rating, content);
    setRating(0);
    setContent("");
    setShowForm(false);
    toast({
      title: "Review submitted",
      description: "Thank you for your feedback!",
    });
  };
  
  if (!showForm) {
    return (
      <div className="text-center my-6">
        <Button onClick={() => setShowForm(true)}>Write a Review</Button>
      </div>
    );
  }
  
  return (
    <motion.form 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onSubmit={handleSubmit}
      className="mb-8 p-6 bg-gray-50 dark:bg-gray-800/30 rounded-lg"
    >
      <h3 className="text-xl font-semibold mb-4">Write Your Review</h3>
      
      <div className="mb-4">
        <label className="block mb-2">Your Rating</label>
        <StarRating value={rating} onChange={setRating} size="lg" />
      </div>
      
      <div className="mb-4">
        <label htmlFor="review-content" className="block mb-2">Your Review</label>
        <Textarea
          id="review-content"
          placeholder="Share your experience with this course..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-[120px]"
        />
      </div>
      
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
        <Button type="submit">Submit Review</Button>
      </div>
    </motion.form>
  );
};

// Reviews Section Component with Rating Summary
export const ReviewsSection = ({ 
  reviews, 
  averageRating, 
  totalReviews,
  ratingDistribution,
  onAddReview,
  onAddReply,
  onDeleteReview
}: { 
  reviews: ReviewData[];
  averageRating: number;
  totalReviews: number;
  ratingDistribution: number[];
  onAddReview: (rating: number, content: string) => void;
  onAddReply: (reviewId: string, content: string) => void;
  onDeleteReview: (reviewId: string) => void;
}) => {
  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-6">Student Reviews</h2>
      
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <div className="bg-gray-50 dark:bg-gray-800/30 rounded-lg p-6">
          <div className="text-center">
            <div className="text-5xl font-bold mb-2">{averageRating.toFixed(1)}</div>
            <div className="mb-2">
              <StarRating value={Math.round(averageRating)} readOnly size="md" />
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Based on {totalReviews} reviews
            </div>
          </div>
          
          <div className="mt-6 space-y-2">
            {[5, 4, 3, 2, 1].map((star) => (
              <div key={star} className="flex items-center gap-2">
                <div className="flex items-center min-w-[50px]">
                  <span className="font-medium">{star}</span>
                  <StarIcon className="w-4 h-4 ml-1 text-yellow-400 fill-yellow-400" />
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full" 
                    style={{ width: `${totalReviews > 0 ? (ratingDistribution[star-1] / totalReviews) * 100 : 0}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 w-[40px] text-right">
                  {ratingDistribution[star-1]}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <ReviewForm onSubmit={onAddReview} />
        </div>
      </div>
      
      <div className="space-y-4">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <Review 
              key={review.id} 
              review={review} 
              onReply={onAddReply}
              onDelete={onDeleteReview}
            />
          ))
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <p>No reviews yet. Be the first to review this course!</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Utility to calculate rating statistics
export const calculateRatingStatistics = (reviews: ReviewData[]) => {
  if (!reviews.length) {
    return {
      averageRating: 0,
      totalReviews: 0,
      ratingDistribution: [0, 0, 0, 0, 0]
    };
  }
  
  const totalReviews = reviews.length;
  const sumRatings = reviews.reduce((sum, review) => sum + review.rating, 0);
  const averageRating = sumRatings / totalReviews;
  
  // Count distribution of ratings (5-star, 4-star, etc.)
  const ratingDistribution = [0, 0, 0, 0, 0]; // For ratings 1-5
  
  reviews.forEach(review => {
    if (review.rating >= 1 && review.rating <= 5) {
      ratingDistribution[review.rating - 1]++;
    }
  });
  
  return {
    averageRating,
    totalReviews,
    ratingDistribution
  };
};
