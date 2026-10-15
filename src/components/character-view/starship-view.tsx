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

// TODO: move this function to a shared utility file
async function fetchResource<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Unable to load ${url}`);
  return response.json();
}

export default async function StarshipView({ url }: { url: string }) {

  const starship = await fetchResource<Starship>(url);

  return (
    <Box>
      <Typography variant="h6">{starship.name}</Typography>
      <Typography variant="body2">Crew / Passengers: {starship.crew} / {starship.passengers}</Typography>
      <Typography variant="body2">Model / Manufacturer: {starship.model} {starship.manufacturer}</Typography>
    </Box>
  );
}
