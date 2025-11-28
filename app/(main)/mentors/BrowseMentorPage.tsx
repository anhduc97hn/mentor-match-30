"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Alert, Box, Container, Pagination } from "@mui/material";
import { useAppSelector, useAppDispatch } from "@/src/appService/hooks";
import { getUserProfile } from "@/src/slices/userProfileSlice";
import LoadingScreen from "@/src/components/LoadingScreen";
import MentorList from "./MentorList";
import { MentorFilterBar } from "./FilterBar";
import "./BrowseMentorPage.css";

interface FilterFormInputs {
  searchQuery: string;
  sortBy: string;
  company: string;
  position: string;
  city: string;
}

interface BrowseMentorPageProps {
  initialMentors: any[];
  initialTotal: number;
  initialTotalPages: number;
  initialPage: number;
}

const defaultValues: FilterFormInputs = {
  searchQuery: "",
  sortBy: "reviewDesc",
  company: "",
  position: "",
  city: "",
};

export default function BrowseMentorPage({ initialMentors, initialTotal, initialTotalPages }: BrowseMentorPageProps) {
  const dispatch = useAppDispatch();
  const { currentPageUsers, userProfilesById, isLoading, error, total, totalPages } = useAppSelector((state) => state.userProfile);

  // State
  const [page, setPage] = useState(1);
  const [filterParams, setFilterParams] = useState(defaultValues);

  // Form
  const methods = useForm<FilterFormInputs>({ defaultValues });

  // Data Merging (Client Store vs Server Initial)
  const clientMentors = currentPageUsers.map((userId) => userProfilesById[userId]);
  const hasClientData = clientMentors.length > 0;

  const mentors = hasClientData ? clientMentors : initialMentors;
  const currentTotal = hasClientData ? total : initialTotal;
  const currentTotalPages = hasClientData ? totalPages : initialTotalPages;

  // Filter Options Calculation
  const filterOptions = useMemo(() => {
    const extract = (key: string) => Array.from(new Set(mentors.map((m: any) => m[key]).filter(Boolean)));
    return {
      company: extract("currentCompany"),
      position: extract("currentPosition"),
      city: extract("city"),
    };
  }, [mentors]);

  // Handlers
  const handlePageChange = (_: unknown, value: number) => {
    setPage(value);
  };

  const handleSearch = (data: FilterFormInputs) => {
    setPage(1);
    setFilterParams(data);
  };

  const handleReset = () => {
    setPage(1);
    setFilterParams(defaultValues);
    methods.reset(defaultValues);
  };

  // API Effect
  const isInitialMount = useRef(true);
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    dispatch(getUserProfile({ filter: filterParams, page }));
  }, [dispatch, filterParams, page]);

  return (
    <section className="mentorlist-page">
      <Container
        sx={{
          backgroundColor: "primary.light",
          p: 2,
          m: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
        maxWidth={false}
      >
        {isLoading ? (
          <LoadingScreen sx={{ top: 0, left: 0 }} />
        ) : (
          <>
            <MentorFilterBar methods={methods} onSubmit={handleSearch} onReset={handleReset} options={filterOptions} resultCount={currentTotal} />

            <Box sx={{ position: "relative" }}>{error ? <Alert severity="error">{error}</Alert> : <MentorList mentors={mentors} />}</Box>

            <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
              <Pagination count={currentTotalPages} page={page} onChange={handlePageChange} />
            </Box>
          </>
        )}
      </Container>
    </section>
  );
}
