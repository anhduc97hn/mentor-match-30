import React, { useRef, useState, Dispatch, SetStateAction, RefObject } from "react";
import { Stack } from "@mui/material";
import EduForm from "./EduForm";
import EduList from "./EduList";
import { Education } from "@/src/types/user";

function AccountEducation() {

    const [currentEdu, setCurrentEdu] = useState<Education | null>(null);
    const eduFormRef = useRef<HTMLDivElement | null>(null); 

    return (
        <Stack spacing={3}>
            <EduForm
                currentEdu={currentEdu}
                setCurrentEdu={setCurrentEdu as Dispatch<SetStateAction<Education | null>>}
                eduFormRef={eduFormRef}
            />
            <EduList
                setCurrentEdu={setCurrentEdu as Dispatch<SetStateAction<Education | null>>}
                eduFormRef={eduFormRef}
            />
        </Stack>
    );
}

export default AccountEducation;