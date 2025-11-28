import { LoadingButton } from "@mui/lab";
import React, { useEffect, useState, Dispatch, SetStateAction, RefObject } from "react";
import { Box, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { educationGetAll } from "@/src/slices/resourceSlice";
import EduCard from "./EduCard";
import LoadingScreen from "@/src/components/LoadingScreen";
import { Education } from "@/src/types/user";
import { useAppDispatch, useAppSelector } from "@/src/appService/hooks";

// Define the types for the component's props
interface EduListProps {
  setCurrentEdu: Dispatch<SetStateAction<Education | null>>;
  eduFormRef: RefObject<HTMLDivElement | null>;
}

function EduList({ setCurrentEdu, eduFormRef }: EduListProps) {
  const [page, setPage] = useState(1);
  const { currentPageData, dataById, isLoading, total, totalPages } =
    useAppSelector((state) => state.education);
  
  // Type assertion to ensure dataById is a Record mapping string IDs to Education objects.
  const education = currentPageData.map((eduId) =>
    (dataById as Record<string, Education>)[eduId]
  );
  
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(educationGetAll({ page }));
  }, [dispatch, page]);

  return (
    <>
      {isLoading ? (
        <LoadingScreen sx={{ top: 0, left: 0 }} />
      ) : (
        education.map((edu) => edu && (
          <EduCard
            key={edu._id}
            edu={edu}
            setCurrentEdu={setCurrentEdu}
            eduFormRef={eduFormRef}
          />
        ))
      )}
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        {total ? (
          <LoadingButton
            variant="outlined"
            size="small"
            loading={isLoading}
            onClick={() => setPage((page) => page + 1)}
            disabled={Boolean(totalPages === 1 || page === totalPages)}
          >
            Load more
          </LoadingButton>
        ) : (
          <Typography variant="subtitle1">No Education Yet</Typography>
        )}
      </Box>
    </>
  );
}

export default EduList;