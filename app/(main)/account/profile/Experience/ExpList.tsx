import { LoadingButton } from "@mui/lab";
import React, { useEffect, useState, Dispatch, SetStateAction, RefObject } from "react";
import { Box, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { experienceGetAll } from "@/src/slices/resourceSlice";
import ExpCard from "./ExpCard";
import LoadingScreen from "@/src/components/LoadingScreen";
import { Experience } from "@/src/types/user";
import { useAppDispatch, useAppSelector } from "@/src/appService/hooks";

// Define the types for the component's props
interface ExpListProps {
  setCurrentExp: Dispatch<SetStateAction<Experience | null>>;
  expFormRef: RefObject<HTMLDivElement | null>;
}

function ExpList({ setCurrentExp, expFormRef }: ExpListProps) {
  const [page, setPage] = useState(1);
  const { currentPageData, dataById, isLoading, total, totalPages } =
    useAppSelector((state) => state.experience);
  
  // Type assertion to ensure dataById is a Record mapping string IDs to Experience objects.
  const experiences = currentPageData.map((expId) =>
    (dataById as Record<string, Experience>)[expId]
  );
  
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(experienceGetAll({ page }));
  }, [dispatch, page]);

  return (
    <>
      {isLoading ? (
        <LoadingScreen sx={{ top: 0, left: 0 }} />
      ) : (
        experiences.map((exp) => exp && (
          <ExpCard
            key={exp._id}
            exp={exp}
            setCurrentExp={setCurrentExp}
            expFormRef={expFormRef}
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
          <Typography variant="subtitle1">No Experience Yet</Typography>
        )}
      </Box>
    </>
  );
}

export default ExpList;