export const COLLECTIONS = [
  {
    slug: 'apollo',
    title: 'The Apollo Program',
    eyebrow: 'HUMAN SPACEFLIGHT / 1961—1972',
    description: 'The photographs, people, spacecraft, and moments that carried humanity to the Moon.',
    query: 'Apollo',
    accent: 'warm',
  },
  {
    slug: 'james-webb',
    title: 'James Webb Space Telescope',
    eyebrow: 'OBSERVATORY / DEEP SPACE',
    description: 'Infrared observations revealing galaxies, nebulae, and details hidden in the distant universe.',
    query: 'James Webb Space Telescope',
    accent: 'blue',
  },
  {
    slug: 'hubble',
    title: 'The Hubble Archive',
    eyebrow: 'OBSERVATORY / 1990—PRESENT',
    description: 'A changing portrait of the cosmos through decades of Hubble observations.',
    query: 'Hubble Space Telescope',
    accent: 'violet',
  },
  {
    slug: 'mars',
    title: 'Mars Exploration',
    eyebrow: 'PLANETARY SCIENCE / MARS',
    description: 'Rovers, orbiters, landscapes, and the ongoing search to understand the red planet.',
    query: 'Mars rover',
    accent: 'rust',
  },
  {
    slug: 'earth',
    title: 'Earth from Above',
    eyebrow: 'EARTH SCIENCE / HOME',
    description: 'Our planet observed from orbit: weather, oceans, cities, and changing environments.',
    query: 'Earth from space',
    accent: 'green',
  },
  {
    slug: 'iss',
    title: 'Life aboard the ISS',
    eyebrow: 'LOW EARTH ORBIT / 1998—PRESENT',
    description: 'Daily life, science, and extraordinary views from the International Space Station.',
    query: 'International Space Station',
    accent: 'slate',
  },
];

export function getCollection(slug) {
  return COLLECTIONS.find((collection) => collection.slug === slug);
}
