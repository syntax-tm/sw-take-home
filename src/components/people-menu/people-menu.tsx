import PeopleBrowser from "./people-browser";
import type { Person } from "../character-view/character-view";

export default async function PeopleMenu() {
  const response = await fetch("https://swapi.info/api/people");
  if (!response.ok) {
    throw new Error("Unable to load Star Wars characters.");
  }

  const people: Person[] = await response.json();

  return <PeopleBrowser people={people} />;
}