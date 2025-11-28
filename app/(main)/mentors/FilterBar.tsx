import { FAutoComplete, FormProvider, FSelect, FTextField } from "@/src/components/form";
import { Box, Button, InputAdornment, Stack, Typography } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

export const MentorFilterBar = ({ methods, onSubmit, onReset, options, resultCount }: any) => {
  const { handleSubmit } = methods;

  const menuItems = [
    { name: "company", label: "Company", options: options.company },
    { name: "position", label: "Position", options: options.position },
    { name: "city", label: "City", options: options.city },
  ];

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Box className="search-bar" sx={{ borderRadius: 1.5, width: "100%", p: 2 }}>
        <FTextField
          name="searchQuery"
          size="medium"
          variant="standard"
          sx={{ width: "100%", mb: 2 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ width: 30, height: 30 }} color="primary" />
              </InputAdornment>
            ),
            placeholder: "Search by mentor name, company, or position...",
          }}
        />
        <Stack direction={{ xs: "column", md: "row" }} spacing={2} justifyContent="space-around" width="100%">
          {menuItems.map((item) => (
            <FAutoComplete key={item.name} {...item} sx={{ width: { xs: "100%", md: "25%" }, border: "1px solid #9DA4AE", borderRadius: 1 }} />
          ))}
          <FSelect name="sortBy" label="Sort By" size="medium" sx={{ width: { xs: "100%", md: "15%" } }}>
            {[
              { value: "reviewDesc", label: "Most Rated" },
              { value: "sessionDesc", label: "Most Sessions" },
              { value: "newest", label: "Newest" },
            ].map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </FSelect>
        </Stack>
      </Box>

      <Stack direction="row" alignItems="center" justifyContent="space-between" mt={2} mb={2}>
        <Typography variant="subtitle1">{`${resultCount} mentors found`}</Typography>
        <Stack direction="row" spacing={1}>
          <Button variant="contained" size="small" type="submit">
            Search
          </Button>
          <Button variant="outlined" size="small" onClick={onReset}>
            Reset
          </Button>
        </Stack>
      </Stack>
    </FormProvider>
  );
};