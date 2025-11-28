import { fDateToMonthYear } from "@/src/utils/formatTime";
import { fData } from "@/src/utils/numberFormat";
import { Avatar, Box, Card, Divider, Stack, Typography } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import LanguageIcon from "@mui/icons-material/Language";
import StarIcon from "@mui/icons-material/Star";

export const MentorHeader = ({ profile }: { profile: any }) => {
  const formattedDate = fDateToMonthYear(profile.createdAt);
  const formattedRating = profile.reviewAverageRating ? fData(profile.reviewAverageRating) : "N/A";

  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: { xs: "90vw", md: "50vw" }, gap: 3, mt: 5, mb: 2 }}>
      <Avatar sx={{ width: "100px", height: "100px" }} src={profile.avatarUrl} alt={profile.name} />

      <Box sx={{ textAlign: "center" }}>
        <Typography variant="h5">{profile.name}</Typography>
        <Typography variant="body1">
          {profile.currentPosition} at {profile.currentCompany}
        </Typography>
      </Box>

      <Stack direction={{ xs: "column", md: "row" }} alignItems="center" spacing={{ xs: 2, md: 5 }} divider={<Divider orientation="vertical" flexItem />}>
        <InfoItem icon={<LocationOnIcon color="primary" />} text={profile.city} />
        <InfoItem icon={<LanguageIcon color="primary" />} text="Vietnamese, English" />
        <Typography variant="subtitle2">Joined {formattedDate}</Typography>
      </Stack>

      <Card sx={{ width: "100%", bgcolor: "transparent", borderRadius: 1, border: "1px solid #F3F4F6" }}>
        <Stack direction={{ xs: "column", md: "row" }} alignItems="center" justifyContent="space-between" sx={{ p: 2 }} spacing={2}>
          <PriceBox title="Free" subtitle="Price per hour" />
          <PriceBox title="1 hour" subtitle="Cancel anytime" />

          <Stack alignItems="center">
            <Stack direction="row" alignItems="center">
              <StarIcon sx={{ color: "primary.main", mr: 0.5 }} />
              <Typography variant="h5">{formattedRating}</Typography>
            </Stack>
            <Typography variant="body2">
              {profile.reviewCount} reviews / {profile.sessionCount} sessions
            </Typography>
          </Stack>
        </Stack>
      </Card>
    </Box>
  );
};

const InfoItem = ({ icon, text }: { icon: React.ReactNode; text: string }) => (
  <Stack direction="row" spacing={1} alignItems="center">
    {icon} <Typography variant="subtitle2">{text}</Typography>
  </Stack>
);

const PriceBox = ({ title, subtitle }: { title: string; subtitle: string }) => (
  <Box sx={{ textAlign: "center" }}>
    <Typography variant="h6" color="success.main">
      {title}
    </Typography>
    <Typography variant="body2">{subtitle}</Typography>
  </Box>
);
