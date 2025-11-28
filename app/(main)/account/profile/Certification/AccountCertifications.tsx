import React, { useRef, useState } from "react";
import { Stack } from "@mui/material";
import CertiForm from "./CertiForm";
import CertiList from "./CertiList";
import { Certification } from "@/src/types/user";

function AccountCertifications() {
    
    const [currentCerti, setCurrentCerti] = useState<Certification | null>(null);

    // Ref to access the CertiForm component's DOM or instance methods.
    // It's a good practice to explicitly type the ref, in this case, a RefObject holding an HTMLDivElement or null.
    // If you need to access component methods, you might need to use `useImperativeHandle`.
    const certiFormRef = useRef<HTMLDivElement | null>(null); 

    return (
        <Stack spacing={3}>
            <CertiForm
                currentCerti={currentCerti}
                setCurrentCerti={setCurrentCerti}
                certiFormRef={certiFormRef}
            />
            <CertiList
                setCurrentCerti={setCurrentCerti}
                certiFormRef={certiFormRef}
            />
        </Stack>
    );
}

export default AccountCertifications;