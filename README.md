# ORBITAL — NASA Media Explorer

An independent React SPA for exploring NASA's public Image and Video Library. ORBITAL includes an atmospheric starfield landing page, an editorial field-index search experience, a slide-over filter inspector, NASA metadata filters, client-side sorting, pagination, media details with technical metadata, direct album lookup, curated collections, saved items, recent history, and light/dark themes.

## Requirements

- Node.js 20.19+ (Node 22 LTS recommended)
- npm 10+
- Internet connection while using the app (media and metadata are fetched from NASA)

## Setup

Open a terminal in this project folder and run:

```bash
npm install
npm run dev
```

Vite will print the local development URL. By default this project uses:

```text
http://localhost:5173
```

To create and preview a production build:

```bash
npm run build
npm run preview
```

The production output is created in `dist/`.

## NASA API

The app uses the public NASA Image and Video Library API:

```text
https://images-api.nasa.gov
```

No API key or `.env` file is required. The app calls the API directly from the browser and therefore requires an internet connection.

Implemented endpoints:

- `GET /search` — keyword search and metadata filters
- `GET /asset/{nasa_id}` — media asset manifest
- `GET /metadata/{nasa_id}` — technical metadata location
- `GET /captions/{nasa_id}` — video caption location when available
- `GET /album/{album_name}` — direct lookup of a case-sensitive NASA album name, with page navigation

Search filters include one or multiple media types, year range, NASA center, title, keywords, location, photographer, secondary creator, description, accessibility description, and NASA ID. The Collections page also includes direct NASA album lookup. Media detail retrieves the technical metadata JSON document when available. Exact availability of metadata depends on each NASA record.

### Sorting note

NASA's search endpoint does not expose a general server-side sort parameter. Best Match preserves NASA's returned order. Newest, oldest, and title sorting are applied to the results currently loaded in the browser; they do not claim to sort the entire archive.

### Media note

Some records do not have an original file or caption track available through the manifest. In those cases the app shows the preview when possible and explains when an original asset is unavailable. Browser playback also depends on the source file's format and server response headers.

## Local browser storage

The following preferences are stored in `localStorage`:

- `orbital-theme` — light/dark preference
- `orbital-saved-media` — saved media records
- `orbital-recent-media` — recently viewed media records

These are browser-local and are not synchronized across devices or users. Clearing browser storage removes them.

## Project structure

```text
src/
├── app/                 # Route composition
├── components/
│   ├── layout/          # App shell, sidebar, theme, starfield
│   ├── media/           # Media cards, viewer, player, empty states
│   └── search/          # Search filters
├── context/             # Theme and local media library state
├── pages/               # Route-level pages
├── services/            # NASA API requests and response normalization
├── styles/              # Design system and responsive styling
└── utils/               # Collection presets and formatters
```

## Notes

- ORBITAL is an independent project and is not an official NASA product.
- Media, source records, and individual credits belong to their respective NASA source records. Retain source credits when reusing media and review the metadata for each asset.
- The starfield is a locally rendered visual effect. It is not NASA data and does not require an API request.
