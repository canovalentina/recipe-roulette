import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import countries from 'world-countries';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MEALDB_AREAS = {
  "American": ["US"],
  "British": ["GB"],
  "Canadian": ["CA"],
  "Chinese": ["CN"],
  "Croatian": ["HR"],
  "Dutch": ["NL"],
  "Egyptian": ["EG"],
  "Filipino": ["PH"],
  "French": ["FR"],
  "Greek": ["GR"],
  "Indian": ["IN"],
  "Irish": ["IE"],
  "Italian": ["IT"],
  "Jamaican": ["JM"],
  "Japanese": ["JP"],
  "Kenyan": ["KE"],
  "Malaysian": ["MY"],
  "Mexican": ["MX"],
  "Moroccan": ["MA"],
  "Polish": ["PL"],
  "Portuguese": ["PT"],
  "Russian": ["RU"],
  "Spanish": ["ES"],
  "Thai": ["TH"],
  "Tunisian": ["TN"],
  "Turkish": ["TR"],
  "Ukrainian": ["UA"],
  "Vietnamese": ["VN"],
};

// Create a reverse mapping
const countryToArea = {};
for (const [area, codes] of Object.entries(MEALDB_AREAS)) {
  for (const code of codes) {
    countryToArea[code] = area;
  }
}

const formattedCountries = countries.map(country => {
  const code = country.cca2;
  return {
    name: country.name.common,
    flag: country.flag,
    coordinates: country.latlng,
    mealDbArea: countryToArea[code] || null,
    code: code
  };
});

const fileContent = `// Automatically generated from world-countries
export interface Country {
  name: string;
  flag: string;
  coordinates: [number, number]; // [lat, lng]
  mealDbArea: string | null;
  code: string;
}

export const COUNTRIES: Country[] = ${JSON.stringify(formattedCountries, null, 2)};
`;

const libPath = path.join(__dirname, '..', 'lib');
if (!fs.existsSync(libPath)) {
  fs.mkdirSync(libPath, { recursive: true });
}

fs.writeFileSync(path.join(libPath, 'countries.ts'), fileContent);
console.log('Successfully generated lib/countries.ts with ' + formattedCountries.length + ' countries.');
