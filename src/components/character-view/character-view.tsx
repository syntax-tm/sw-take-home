import { Avatar, Box, Chip, Divider, Paper, Typography } from "@mui/material";

export type Person = {
  name: string;
  url: string;
  height: string;
  mass: string;
  hair_color: string;
  skin_color: string;
  eye_color: string;
  birth_year: string;
  gender: string;
  homeworld: string;
  films: string[];
  species: string[];
  vehicles: string[];
  starships: string[];
};

const filmTitles: Record<string, string> = {
  "1": "Episode IV · A New Hope",
  "2": "Episode V · The Empire Strikes Back",
  "3": "Episode VI · Return of the Jedi",
  "4": "Episode I · The Phantom Menace",
  "5": "Episode II · Attack of the Clones",
  "6": "Episode III · Revenge of the Sith",
};

function resourceNumber(url: string) {
  return url.split("/").filter(Boolean).at(-1) ?? "?";
}

function displayValue(value: string) {
  if (value === "unknown") return "Unknown";
  if (value === "n/a") return "N/A";
  return value;
}

export default function CharacterView({ person }: { person: Person }) {
  const initials = person.name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  const attributes = [
    ["Birth year", displayValue(person.birth_year)],
    ["Gender", displayValue(person.gender)],
    ["Height", person.height === "unknown" ? "Unknown" : `${person.height} cm`],
    ["Mass", person.mass === "unknown" ? "Unknown" : `${person.mass} kg`],
    ["Eye color", displayValue(person.eye_color)],
    ["Hair color", displayValue(person.hair_color)],
    ["Skin color", displayValue(person.skin_color)],
  ];

  const connections = [
    ["Homeworld", `Planet ${resourceNumber(person.homeworld)}`],
    [
      "Species",
      person.species.length
        ? person.species.map((url) => `Species ${resourceNumber(url)}`).join(", ")
        : "Unspecified",
    ],
    [
      "Starships",
      person.starships.length
        ? person.starships.map((url) => `Starship ${resourceNumber(url)}`).join(", ")
        : "None listed",
    ],
    [
      "Vehicles",
      person.vehicles.length
        ? person.vehicles.map((url) => `Vehicle ${resourceNumber(url)}`).join(", ")
        : "None listed",
    ],
  ];

  return (
    <Paper
      component="section"
      variant="outlined"
      aria-label={`${person.name} details`}
      sx={{ p: { xs: 2, sm: 3 }, borderColor: "divider", borderRadius: 1 }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
        <Avatar
          aria-hidden="true"
          sx={{ width: 56, height: 56, bgcolor: "grey.100", color: "text.secondary", fontWeight: 600 }}
        >
          {initials}
        </Avatar>
        <Box>
          <Typography component="h2" variant="h5" sx={{ fontWeight: 700 }}>
            {person.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Character {resourceNumber(person.url)}
          </Typography>
        </Box>
      </Box>

      <Divider />

      <Box component="section" sx={{ py: 2.5 }}>
        <Typography component="h3" variant="overline" sx={{ fontWeight: 700 }}>
          Attributes
        </Typography>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr 1fr", sm: "repeat(3, minmax(0, 1fr))" },
            mt: 1,
            borderTop: "1px solid",
            borderLeft: "1px solid",
            borderColor: "divider",
          }}
        >
          {attributes.map(([label, value]) => (
            <Box
              key={label}
              sx={{
                minWidth: 0,
                px: 1.5,
                py: 1.25,
                borderRight: "1px solid",
                borderBottom: "1px solid",
                borderColor: "divider",
              }}
            >
              <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
                {label}
              </Typography>
              <Typography variant="body2" sx={{ overflowWrap: "anywhere" }}>
                {value}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

      <Divider />

      <Box component="section" sx={{ py: 2.5 }}>
        <Typography component="h3" variant="overline" sx={{ fontWeight: 700 }}>
          Films
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
          {person.films.map((url) => {
            const id = resourceNumber(url);
            return <Chip key={url} label={filmTitles[id] ?? `Film ${id}`} size="small" variant="outlined" />;
          })}
        </Box>
      </Box>

      <Divider />

      <Box component="section" sx={{ pt: 2.5 }}>
        <Typography component="h3" variant="overline" sx={{ fontWeight: 700 }}>
          Connections
        </Typography>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))" },
            columnGap: 3,
            rowGap: 1.5,
            mt: 1,
          }}
        >
          {connections.map(([label, value]) => (
            <Box key={label} sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
              <Typography variant="body2" color="text.secondary">
                {label}
              </Typography>
              <Typography variant="body2" sx={{ textAlign: "right", overflowWrap: "anywhere" }}>
                {value}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Paper>
  );
}