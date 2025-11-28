import React, { useRef, useState, Dispatch, SetStateAction, RefObject } from "react";
import { Stack } from "@mui/material";
import ExpForm from "./ExpForm";
import ExpList from "./ExpList";
import { Experience } from "@/src/types/user";


function AccountExperiences() {
  // State to hold the currently selected experience for editing.
  const [currentExp, setCurrentExp] = useState<Experience | null>(null);

  // Ref to access the ExpForm component's DOM or instance methods.
  const expFormRef = useRef<HTMLDivElement | null>(null);

  return (
    <Stack spacing={3}>
      <ExpForm
        currentExp={currentExp}
        setCurrentExp={setCurrentExp as Dispatch<SetStateAction<Experience | null>>}
        expFormRef={expFormRef}
      />
      <ExpList
        setCurrentExp={setCurrentExp as Dispatch<SetStateAction<Experience | null>>}
        expFormRef={expFormRef}
      />
    </Stack>
  );
}

export default AccountExperiences;