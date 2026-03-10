"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Alert, Box, Container, Pagination } from "@mui/material";
import apiService from "@/src/appService/apiService";
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
  // State
  const [page, setPage] = useState(1);
  const [filterParams, setFilterParams] = useState(defaultValues);

  const [mentors, setMentors] = useState(initialMentors);
  const [total, setTotal] = useState(initialTotal);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form
  const methods = useForm<FilterFormInputs>({ defaultValues });

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
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        params.append("page", page.toString());
        Object.entries(filterParams).forEach(([key, value]) => {
          if (value) params.append(key, value);
        });
        const response = await apiService.get(`/userprofiles/?${params.toString()}`);
          setTotal(response.data?.count || 0);
          setTotalPages(response.data?.totalPages || 0);
          setMentors(response.data?.userProfiles || []);
          setIsLoading(false);
      } catch (error: any) {
        setError(error.message || "Failed to fetch data");
      }
      finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [filterParams, page]);

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
            <MentorFilterBar methods={methods} onSubmit={handleSearch} onReset={handleReset} options={filterOptions} resultCount={total} />

            <Box sx={{ position: "relative" }}>{error ? <Alert severity="error">{error}</Alert> : <MentorList mentors={mentors} />}</Box>

            <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
              <Pagination count={totalPages} page={page} onChange={handlePageChange} />
            </Box>
          </>
        )}
      </Container>
    </section>
  );
}
