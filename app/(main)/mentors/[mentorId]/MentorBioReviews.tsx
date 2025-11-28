import { Avatar, Box, Card, Stack, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getReviewsPerMentor } from "@/src/slices/reviewSlice";
import { fDateToMonthYear } from "@/src/utils/formatTime";
import { LoadingButton } from "@mui/lab";
import LoadingScreen from "@/src/components/LoadingScreen";
import { IMentorProfile } from "@/src/types/user";
import { useAppDispatch, useAppSelector } from "@/src/appService/hooks";

// Define the shape for the component's props
interface Props {
  selectedUser: IMentorProfile | null;
}

// --- Component ---

const MentorBioReviews: React.FC<Props> = ({ selectedUser }) => {
  // Guard clause to handle null selectedUser
  if (!selectedUser) {
    return <Typography>No user selected.</Typography>;
  }

  const userProfileId = selectedUser._id;
  const dispatch = useAppDispatch()

  const {
    isLoading,
    reviewsById,
    currentPageReviewsByMentor,
    totalReviewsByMentor,
    totalPages,
  } = useAppSelector((state) => state.review);

  const [page, setPage] = useState<number>(1);

  // Type the reviews array and filter out potential undefined values
  const reviews = currentPageReviewsByMentor
    .map((reviewId) => reviewsById[reviewId])

  useEffect(() => {
    if (userProfileId) {
      dispatch(getReviewsPerMentor({ userProfileId, page }));
    }
  }, [dispatch, userProfileId, page]);

  return (
    <Stack>
      <Typography variant="h6" gutterBottom>
        Reviews ({selectedUser.reviewCount})
      </Typography>
      {isLoading && page === 1 ? (
        <LoadingScreen sx={{ top: 0, left: 0 }} />
      ) : (
        <>
          {reviews.map((review) => {
            const fReviewDate = review.createdAt
              ? fDateToMonthYear(review.createdAt)
              : "";
            return (
              <Card
                sx={{
                  mt: 1,
                  mb: 1,
                  p: 2,
                  display: "flex",
                  flexDirection: { xs: "column", md: "row" },
                  alignItems: { xs: "flex-start", md: "center" },
                  justifyContent: "space-between",
                  gap: 2,
                }}
                key={review._id}
              >
                <Stack
                  alignItems="flex-start"
                  sx={{ width: { xs: "100%", md: "150px" } }}
                  flexShrink={0}
                >
                  <Avatar
                    sx={{ width: "50px", height: "50px", mb: 1 }}
                    src={review.session?.from.avatarUrl as string}
                    alt={review.session?.from.name}
                  />
                  <Typography variant="subtitle2">
                    {review.session?.from.name}
                  </Typography>
                  <Typography variant="caption">{fReviewDate}</Typography>
                </Stack>
                <Card sx={{ p: 1.5, bgcolor: "neutral.100", borderRadius: 1, width: '100%' }}>
                  <Typography variant="body2">{review.content}</Typography>
                </Card>
              </Card>
            );
          })}
          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            {totalReviewsByMentor > 0 && page < totalPages ? (
              <LoadingButton
                sx={{ mt: 1 }}
                variant="outlined"
                size="small"
                loading={isLoading}
                onClick={() => setPage((page) => page + 1)}
              >
                Load more reviews
              </LoadingButton>
            ) : reviews.length === 0 && !isLoading ? (
                <Typography variant="body1">No Reviews Yet</Typography>
            ) : null}
          </Box>
        </>
      )}
    </Stack>
  );
};

export default MentorBioReviews;