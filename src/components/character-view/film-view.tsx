import { Box, Grid, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { fetchResource, intToRoman } from "@/utils";

export type Film = {
  title: string
  episode_id: number
  opening_crawl: string
  director: string
  producer: string
  release_date: string
  characters: string[]
  planets: string[]
  starships: string[]
  vehicles: string[]
  species: string[]
  created: string
  edited: string
  url: string
};

type FilmResult = {
  url: string;
  film: Film | null;
  error: boolean;
};

const getEpisodeSubtitle = (episodeId: number): string => {
  const romanNumeral = intToRoman(episodeId);
  return `Episode ${romanNumeral}`;
}

export default function FilmView({ url }: { url: string }) {

  const [result, setResult] = useState<FilmResult>({ url: "", film: null, error: false });
  const isLoading = result.url !== url;

  useEffect(() => {
    let active = true;

    fetchResource<Film>(url)
      .then((film) => {
        if (active) setResult({ url, film, error: false });
      })
      .catch(() => {
        if (active) setResult({ url, film: null, error: true });
      });

    return () => {
      active = false;
    };
  }, [url]);

  if (isLoading) {
    return <Typography variant="body2" color="text.secondary">Loading film...</Typography>;
  }

  if (result.error || !result.film) {
    return <Typography variant="body2" color="text.secondary">Film details unavailable.</Typography>;
  }

  const { film } = result;

  return (
    <Box
      component="article"
      aria-label={`${film.title} details`}
      sx={{
        display: "grid",
        gridTemplateRows: "80px minmax(0, 1fr)",
        gap: 1.5,
        alignItems: "center",
        alignContent: "center",
        p: 1,
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      <Grid container sx={{ alignItems: "center", justifyContent: "center" }}>
        <Box
            aria-hidden="true"
            sx={{
              width: 56,
              aspectRatio: "2/3",
              border: "1px solid",
              borderColor: "divider",
              bgcolor: "action.hover",
            }}
          />
      </Grid>
      <Stack direction="column" spacing={0.25} sx={{ minWidth: 0 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 700, textAlign: "center" }}>{film.title}</Typography>
        <Typography variant="caption" color="text.secondary" sx={{ textAlign: "center" }}>
          {getEpisodeSubtitle(film.episode_id)}
        </Typography>
      </Stack>
    </Box>
  );
}
