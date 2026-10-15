"use client";

import { useState } from "react";
import {
  Box,
  List,
  ListItemButton,
  ListItemText,
  TextField,
  Typography,
} from "@mui/material";
import CharacterView, { type Person } from "../character-view/character-view";

export default function CharacterBrowser({ people }: { people: Person[] }) {
  const [selectedUrl, setSelectedUrl] = useState(people[0]?.url ?? "");
  const [search, setSearch] = useState("");
  const selectedPerson = people.find((person) => person.url === selectedUrl);
  const visiblePeople = people
    .filter((person) => person.name.toLowerCase().includes(search.trim().toLowerCase()))
    .sort((first, second) => first.name.localeCompare(second.name));

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "240px minmax(0, 1fr)" },
        gap: { xs: 2, md: 3 },
        alignItems: "start",
      }}
    >
      <Box component="aside" aria-label="Character list">
        <Box sx={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", mb: 1 }}>
          <Typography component="h2" variant="overline" sx={{ fontWeight: 700 }}>
            Characters
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {visiblePeople.length} / {people.length}
          </Typography>
        </Box>
        <TextField
          fullWidth
          size="small"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search characters"
          slotProps={{ htmlInput: { "aria-label": "Search characters" } }}
        />
        <List
          disablePadding
          aria-label="Characters"
          sx={{
            mt: 1,
            maxHeight: { xs: "32vh", md: "calc(100vh - 205px)" },
            overflowY: "auto",
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 1,
          }}
        >
          {visiblePeople.length ? (
            visiblePeople.map((person) => (
              <ListItemButton
                key={person.url}
                selected={person.url === selectedUrl}
                onClick={() => setSelectedUrl(person.url)}
                sx={{
                  minHeight: 38,
                  py: 0.5,
                  borderLeft: "2px solid transparent",
                  "&.Mui-selected": {
                    borderLeftColor: "primary.main",
                    backgroundColor: "action.selected",
                  },
                }}
              >
                <ListItemText
                  primary={person.name}
                  slotProps={{ primary: { variant: "body2", noWrap: true } }}
                />
              </ListItemButton>
            ))
          ) : (
            <Typography sx={{ px: 1.5, py: 2 }} variant="body2" color="text.secondary">
              No characters found.
            </Typography>
          )}
        </List>
      </Box>

      {selectedPerson ? (
        <CharacterView person={selectedPerson} />
      ) : (
        <Typography color="text.secondary">No character data available.</Typography>
      )}
    </Box>
  );
}