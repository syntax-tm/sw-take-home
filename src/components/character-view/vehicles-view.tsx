"use client";

import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";

export type Vehicle = {
  name: string;
  model: string;
  manufacturer: string;
  crew: string;
  passengers: string;
  vehicle_class: string;
  url: string;
};

type VehicleResult = {
  url: string;
  vehicle: Vehicle | null;
  error: boolean;
};

export default function VehiclesView({ url }: { url: string }) {
  const [result, setResult] = useState<VehicleResult>({ url: "", vehicle: null, error: false });
  const isLoading = result.url !== url;

  useEffect(() => {
    let active = true;

    fetch(url)
      .then((response) => {
        if (!response.ok) throw new Error(`Unable to load ${url}`);
        return response.json() as Promise<Vehicle>;
      })
      .then((vehicle) => {
        if (active) setResult({ url, vehicle, error: false });
      })
      .catch(() => {
        if (active) setResult({ url, vehicle: null, error: true });
      });

    return () => {
      active = false;
    };
  }, [url]);

  if (isLoading) {
    return <Typography variant="body2" color="text.secondary">Loading vehicle...</Typography>;
  }

  if (result.error || !result.vehicle) {
    return <Typography variant="body2" color="text.secondary">Vehicle details unavailable.</Typography>;
  }

  const { vehicle } = result;

  return (
    <Box
      component="article"
      aria-label={`${vehicle.name} details`}
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
          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{vehicle.name}</Typography>
          <Typography variant="caption" color="text.secondary" sx={{ textAlign: "right" }}>
            {vehicle.vehicle_class}
          </Typography>
        </Box>
        <Typography variant="body2">Crew / Passengers: {vehicle.crew} / {vehicle.passengers}</Typography>
        <Typography variant="body2" sx={{ overflowWrap: "anywhere" }}>
          Model / Manufacturer: {vehicle.model} / {vehicle.manufacturer}
        </Typography>
      </Box>
    </Box>
  );
}