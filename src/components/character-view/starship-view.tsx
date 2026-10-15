import { Box, Typography } from "@mui/material";

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

export default function StarshipView({ starship }: { starship: Starship }) {
  return (
    <Box>
      <Typography variant="h6">{starship.name}</Typography>
      <Typography variant="body2">Crew / Passengers: {starship.crew} / {starship.passengers}</Typography>
      <Typography variant="body2">Model / Manufacturer: {starship.model} {starship.manufacturer}</Typography>
    </Box>
  );
}
