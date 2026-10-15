import { useEffect, useState } from "react";
import { Avatar, Box, Chip, Divider, Paper, Typography } from "@mui/material";

// TODO move this type to the types folder along with all of the dependent models
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

type Species = {
  name: string;
  classification: string;
  designation: string;
  average_height: string;
  average_lifespan: string;
  language: string;
};

type Homeworld = {
  name: string;
  population: string;
  terrain: string;
  climate: string;
  surface_water: string;
  diameter: string;
  rotation_period: string;
  orbital_period: string;
  gravity: string;
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

async function fetchResource<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Unable to load ${url}`);
  return response.json();
}

function DetailRows({ items }: { items: [string, string][] }) {
  return (
    <Box sx={{ mt: 1, borderTop: "1px solid", borderLeft: "1px solid", borderColor: "divider" }}>
      {items.map(([label, value]) => (
        <Box
          key={label}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            gap: 1.5,
            px: 1.25,
            py: 0.9,
            borderRight: "1px solid",
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          <Typography variant="caption" color="text.secondary">{label}</Typography>
          <Typography variant="body2" sx={{ textAlign: "right", overflowWrap: "anywhere" }}>
            {displayValue(value)}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}

export default function CharacterView({ person }: { person: Person }) {
  const detailsKey = `${person.homeworld}|${person.species.join("|")}`;
  const [loadedDetails, setLoadedDetails] = useState<{
    key: string;
    homeworld: Homeworld | null;
    species: Species[];
  }>({ key: "", homeworld: null, species: [] });
  const detailsLoading = loadedDetails.key !== detailsKey;
  const homeworld = detailsLoading ? null : loadedDetails.homeworld;
  const species = detailsLoading ? [] : loadedDetails.species;

  useEffect(() => {
    let active = true;

    Promise.all([
      fetchResource<Homeworld>(person.homeworld).catch(() => null),
      Promise.all(person.species.map((url) => fetchResource<Species>(url).catch(() => null))),
    ]).then(([loadedHomeworld, loadedSpecies]) => {
      if (!active) return;
      setLoadedDetails({
        key: detailsKey,
        homeworld: loadedHomeworld,
        species: loadedSpecies.filter((item): item is Species => item !== null),
      });
    });

    return () => {
      active = false;
    };
  }, [detailsKey, person.homeworld, person.species]);

  const initials = person.name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  const attributes: [string, string][] = [
    ["Birth year", displayValue(person.birth_year)],
    ["Gender", displayValue(person.gender)],
    ["Height", person.height === "unknown" ? "Unknown" : `${person.height} cm`],
    ["Mass", person.mass === "unknown" ? "Unknown" : `${person.mass} kg`],
    ["Eye color", displayValue(person.eye_color)],
    ["Hair color", displayValue(person.hair_color)],
    ["Skin color", displayValue(person.skin_color)],
  ];

  const connections = [
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

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "repeat(3, minmax(0, 1fr))" },
          gap: { xs: 2, md: 2.5 },
          py: 2.5,
        }}
      >
        <Box component="section">
          <Typography component="h3" variant="overline" sx={{ fontWeight: 700 }}>
            Attributes
          </Typography>
          <DetailRows items={attributes} />
        </Box>

        <Box component="section">
          <Typography component="h3" variant="overline" sx={{ fontWeight: 700 }}>
            Species
          </Typography>
          {detailsLoading ? (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Loading species...
            </Typography>
          ) : species.length ? (
            species.map((item) => (
              <Box key={item.name}>
                <Typography variant="subtitle2" sx={{ mt: 1, fontWeight: 700 }}>
                  {item.name}
                </Typography>
                <DetailRows
                  items={[
                    ["Classification", item.classification],
                    ["Designation", item.designation],
                    ["Average height", item.average_height === "unknown" ? item.average_height : `${item.average_height} cm`],
                    ["Average lifespan", item.average_lifespan === "unknown" ? item.average_lifespan : `${item.average_lifespan} years`],
                    ["Language", item.language],
                  ]}
                />
              </Box>
            ))
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              No species listed.
            </Typography>
          )}
        </Box>

        <Box component="section">
          <Typography component="h3" variant="overline" sx={{ fontWeight: 700 }}>
            Homeworld
          </Typography>
          {detailsLoading ? (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Loading homeworld...
            </Typography>
          ) : homeworld ? (
            <>
              <Typography variant="subtitle2" sx={{ mt: 1, fontWeight: 700 }}>
                {homeworld.name}
              </Typography>
              <DetailRows
                items={[
                  ["Population", homeworld.population],
                  ["Terrain", homeworld.terrain],
                  ["Climate", homeworld.climate],
                  ["Surface water", homeworld.surface_water === "unknown" ? homeworld.surface_water : `${homeworld.surface_water}%`],
                  ["Diameter", homeworld.diameter === "unknown" ? homeworld.diameter : `${homeworld.diameter} km`],
                  ["Rotation period", homeworld.rotation_period === "unknown" ? homeworld.rotation_period : `${homeworld.rotation_period} hr`],
                  ["Orbital period", homeworld.orbital_period === "unknown" ? homeworld.orbital_period : `${homeworld.orbital_period} days`],
                  ["Gravity", homeworld.gravity],
                ]}
              />
            </>
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Homeworld details unavailable.
            </Typography>
          )}
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