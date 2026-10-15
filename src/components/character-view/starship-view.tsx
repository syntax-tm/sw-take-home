import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { fetchResource } from "@/utils";

export type Starship = {
  name: string
  model: string
  manufacturer: string
  cost_in_credits: string
  length: string
  max_atmosphering_speed: string
  crew: string
  passengers: string
  cargo_capacity: string
  consumables: string
  hyperdrive_rating: string
  MGLT: string
  starship_class: string
  pilots: string[]
  films: string[]
  created: string
  edited: string
  url: string
};

type StarshipResult = {
  url: string;
  starship: Starship | null;
  error: boolean;
};

export default function StarshipView({ url }: { url: string }) {

  const [result, setResult] = useState<StarshipResult>({ url: "", starship: null, error: false });
  const isLoading = result.url !== url;

  useEffect(() => {
    let active = true;

    fetchResource<Starship>(url)
      .then((starship) => {
        if (active) setResult({ url, starship, error: false });
      })
      .catch(() => {
        if (active) setResult({ url, starship: null, error: true });
      });

    return () => {
      active = false;
    };
  }, [url]);

  if (isLoading) {
    return <Typography variant="body2" color="text.secondary">Loading starship...</Typography>;
  }

  if (result.error || !result.starship) {
    return <Typography variant="body2" color="text.secondary">Starship details unavailable.</Typography>;
  }

  const { starship } = result;

  return (
    <Box
      component="article"
      aria-label={`${starship.name} details`}
      sx={{
        display: "grid",
        gridTemplateColumns: "56px minmax(0, 1fr)",
        gap: 1.5,
        alignItems: "center",
        p: 1.5,
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      <Box
        aria-hidden="true"
        sx={{
          width: 56,
          aspectRatio: "1",
          border: "1px solid",
          borderColor: "divider",
          bgcolor: "action.hover",
        }}
      />
      <Box sx={{ minWidth: 0 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", gap: 1, mb: 0.5 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{starship.name}</Typography>
          <Typography variant="caption" color="text.secondary" sx={{ textAlign: "right" }}>
            {starship.starship_class}
          </Typography>
        </Box>
        <Typography variant="body2">Crew / Passengers: {starship.crew} / {starship.passengers}</Typography>
        <Typography variant="body2" sx={{ overflowWrap: "anywhere" }}>
          Model / Manufacturer: {starship.model} / {starship.manufacturer}
        </Typography>
      </Box>
    </Box>
  );
}
