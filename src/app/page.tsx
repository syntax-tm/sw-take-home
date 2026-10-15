import { Suspense } from "react";
import { Box, Typography } from "@mui/material";
import PeopleMenu from "@/components/character-menu/character-menu";
import AppThemeProvider from "@providers/app-theme-provider";

export default function Home() {
  return (
    <AppThemeProvider>
      <Box
        component="main"
        sx={{ minHeight: "100vh", px: { xs: 2, sm: 4 }, py: 2.5 }}
      >
        <Box sx={{ width: "min(100%, 1280px)", mx: "auto" }}>
          <Box component="header" sx={{ mb: 3, pb: 2, borderBottom: "1px solid", borderColor: "divider" }}>
            <Typography component="h1" variant="h6" sx={{ fontWeight: 600 }}>
              Star Wars Character Datapad
            </Typography>
          </Box>
          <Suspense fallback={<Typography color="text.secondary">Loading characters...</Typography>}>
            <PeopleMenu />
          </Suspense>
        </Box>
      </Box>
    </AppThemeProvider>
  );
}
