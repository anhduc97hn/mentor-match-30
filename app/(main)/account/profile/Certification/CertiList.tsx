import { LoadingButton } from "@mui/lab";
import React, { useEffect, useState, Dispatch, SetStateAction, RefObject } from "react";
import { Box, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { certificationGetAll } from "@/src/slices/resourceSlice";
import CertiCard from "./CertiCard";
import LoadingScreen from "@/src/components/LoadingScreen";
import { Certification } from "@/src/types/user";
import { useAppDispatch, useAppSelector } from "@/src/appService/hooks";

interface CertiListProps {
  setCurrentCerti: Dispatch<SetStateAction<Certification | null>>;
  certiFormRef: RefObject<HTMLDivElement | null>;
}

function CertiList({ setCurrentCerti, certiFormRef }: CertiListProps) {
  const [page, setPage] = useState(1);
  const { currentPageData, dataById, isLoading, total, totalPages} = useAppSelector(
    (state) => state.certification
  );
  
  // Type assertion to ensure dataById is a Record mapping string IDs to Certification objects.
  const certifications = currentPageData.map((eduId) => 
    (dataById as Record<string, Certification>)[eduId]
  );
  
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(certificationGetAll({ page }));
  }, [dispatch, page]);

  return (
    <>
      {isLoading ? (
        <LoadingScreen sx={{ top: 0, left: 0 }} />
      ) : (
        certifications.map((certi) => certi && (
          <CertiCard
            key={certi._id}
            certi={certi}
            setCurrentCerti={setCurrentCerti}
            certiFormRef={certiFormRef}
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
          <Typography variant="subtitle1">No Certification Yet</Typography>
        )}
      </Box>
    </>
  );
}

export default CertiList;