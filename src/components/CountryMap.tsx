"use client";

import { useEffect, useState, useCallback } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from "react-simple-maps";
import { Country } from "../../lib/countries";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// Mapping from ISO alpha-2 → ISO numeric (ccn3), which is what world-atlas uses as geo IDs.
const ALPHA2_TO_NUMERIC: Record<string, string> = {
  "AW": "533", "AF": "004", "AO": "024", "AI": "660", "AX": "248",
  "AL": "008", "AD": "020", "AE": "784", "AR": "032", "AM": "051",
  "AS": "016", "AQ": "010", "TF": "260", "AG": "028", "AU": "036",
  "AT": "040", "AZ": "031", "BI": "108", "BE": "056", "BJ": "204",
  "BF": "854", "BD": "050", "BG": "100", "BH": "048", "BS": "044",
  "BA": "070", "BL": "652", "SH": "654", "BY": "112", "BZ": "084",
  "BM": "060", "BO": "068", "BQ": "535", "BR": "076", "BB": "052",
  "BN": "096", "BT": "064", "BV": "074", "BW": "072", "CF": "140",
  "CA": "124", "CC": "166", "CH": "756", "CL": "152", "CN": "156",
  "CI": "384", "CM": "120", "CD": "180", "CG": "178", "CK": "184",
  "CO": "170", "KM": "174", "CV": "132", "CR": "188", "CU": "192",
  "CW": "531", "CX": "162", "KY": "136", "CY": "196", "CZ": "203",
  "DE": "276", "DJ": "262", "DM": "212", "DK": "208", "DO": "214",
  "DZ": "012", "EC": "218", "EG": "818", "ER": "232", "EH": "732",
  "ES": "724", "EE": "233", "ET": "231", "FI": "246", "FJ": "242",
  "FK": "238", "FR": "250", "FO": "234", "FM": "583", "GA": "266",
  "GB": "826", "GE": "268", "GG": "831", "GH": "288", "GI": "292",
  "GN": "324", "GP": "312", "GM": "270", "GW": "624", "GQ": "226",
  "GR": "300", "GD": "308", "GL": "304", "GT": "320", "GF": "254",
  "GU": "316", "GY": "328", "HK": "344", "HM": "334", "HN": "340",
  "HR": "191", "HT": "332", "HU": "348", "ID": "360", "IM": "833",
  "IN": "356", "IO": "086", "IE": "372", "IR": "364", "IQ": "368",
  "IS": "352", "IL": "376", "IT": "380", "JM": "388", "JE": "832",
  "JO": "400", "JP": "392", "KZ": "398", "KE": "404", "KG": "417",
  "KH": "116", "KI": "296", "KN": "659", "KR": "410", "KW": "414",
  "LA": "418", "LB": "422", "LR": "430", "LY": "434", "LC": "662",
  "LI": "438", "LK": "144", "LS": "426", "LT": "440", "LU": "442",
  "LV": "428", "MO": "446", "MF": "663", "MA": "504", "MC": "492",
  "MD": "498", "MG": "450", "MV": "462", "MX": "484", "MH": "584",
  "MK": "807", "ML": "466", "MT": "470", "MM": "104", "ME": "499",
  "MN": "496", "MP": "580", "MZ": "508", "MR": "478", "MS": "500",
  "MQ": "474", "MU": "480", "MW": "454", "MY": "458", "YT": "175",
  "NA": "516", "NC": "540", "NE": "562", "NF": "574", "NG": "566",
  "NI": "558", "NU": "570", "NL": "528", "NO": "578", "NP": "524",
  "NR": "520", "NZ": "554", "OM": "512", "PK": "586", "PA": "591",
  "PN": "612", "PE": "604", "PH": "608", "PW": "585", "PG": "598",
  "PL": "616", "PR": "630", "KP": "408", "PT": "620", "PY": "600",
  "PS": "275", "PF": "258", "QA": "634", "RE": "638", "RO": "642",
  "RU": "643", "RW": "646", "SA": "682", "SD": "729", "SN": "686",
  "SG": "702", "GS": "239", "SJ": "744", "SB": "090", "SL": "694",
  "SV": "222", "SM": "674", "SO": "706", "PM": "666", "RS": "688",
  "SS": "728", "ST": "678", "SR": "740", "SK": "703", "SI": "705",
  "SE": "752", "SZ": "748", "SX": "534", "SC": "690", "SY": "760",
  "TC": "796", "TD": "148", "TG": "768", "TH": "764", "TJ": "762",
  "TK": "772", "TM": "795", "TL": "626", "TO": "776", "TT": "780",
  "TN": "788", "TR": "792", "TV": "798", "TW": "158", "TZ": "834",
  "UG": "800", "UA": "804", "UM": "581", "UY": "858", "US": "840",
  "UZ": "860", "VA": "336", "VC": "670", "VE": "862", "VG": "092",
  "VI": "850", "VN": "704", "VU": "548", "WF": "876", "WS": "882",
  "YE": "887", "ZA": "710", "ZM": "894", "ZW": "716",
};

interface CountryMapProps {
  country: Country;
}

const MIN_ZOOM = 1;
const MAX_ZOOM = 12;

export function CountryMap({ country }: CountryMapProps) {
  const [mounted, setMounted] = useState(false);
  const [zoom, setZoom] = useState(3);
  const [center, setCenter] = useState<[number, number]>([0, 0]);

  // Compute [lng, lat] from country coordinates [lat, lng]
  const [lat, lng] = country.coordinates;
  const countryCenter: [number, number] = [lng, lat];
  const targetNumericId = ALPHA2_TO_NUMERIC[country.code];

  // Whenever country changes, fly to the new country with appropriate zoom
  useEffect(() => {
    setCenter(countryCenter);
    // Zoom level based on country "size" heuristic – defaulting to 4
    setZoom(4);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [country.code]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleZoomIn = useCallback(() => {
    setZoom((z) => Math.min(z + 1.5, MAX_ZOOM));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom((z) => Math.max(z - 1.5, MIN_ZOOM));
  }, []);

  const handleReset = useCallback(() => {
    setCenter(countryCenter);
    setZoom(4);
  }, [countryCenter]);

  if (!mounted) {
    return <div className="w-full h-full bg-blue-50/50 animate-pulse rounded-2xl" />;
  }

  return (
    <div className="w-full h-full min-h-[300px] bg-sky-100 rounded-3xl overflow-hidden border-4 border-white shadow-inner relative group">
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ scale: 150 }}
        className="w-full h-full outline-none"
        style={{ background: "#bfdbfe" }}
      >
        <ZoomableGroup
          zoom={zoom}
          center={center}
          minZoom={MIN_ZOOM}
          maxZoom={MAX_ZOOM}
          onMoveEnd={({ zoom: newZoom, coordinates }) => {
            setZoom(newZoom);
            setCenter(coordinates);
          }}
        >
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const isSelected = targetNumericId
                  ? String(geo.id) === String(targetNumericId)
                  : false;

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={isSelected ? "#E63946" : "#E2E8F0"}
                    stroke={isSelected ? "#FFFFFF" : "#FFFFFF"}
                    strokeWidth={isSelected ? 0.8 : 0.5}
                    className="outline-none"
                    style={{
                      default: {
                        outline: "none",
                        fill: isSelected ? "#E63946" : "#CBD5E1",
                        filter: isSelected
                          ? "drop-shadow(0 0 6px rgba(230,57,70,0.8))"
                          : "none",
                      },
                      hover: {
                        outline: "none",
                        fill: isSelected ? "#c1121f" : "#94A3B8",
                        cursor: "grab",
                      },
                      pressed: {
                        outline: "none",
                        cursor: "grabbing",
                      },
                    }}
                  />
                );
              })
            }
          </Geographies>
          {/* Pin marker — always visible even for tiny islands */}
          <Marker coordinates={countryCenter}>
            <g transform="translate(-4, -10)" style={{ pointerEvents: "none" }}>
              <filter id="pin-shadow" x="-50%" y="-50%" width="200%" height="200%">
                <feDropShadow dx="0" dy="0.5" stdDeviation="0.5" floodColor="#00000055" />
              </filter>
              <path
                d="M4 8C5.9 6.2 7.5 4.8 7.5 3.5a3.5 3.5 0 1 0-7 0C0.5 4.8 2.1 6.2 4 8z"
                fill="#F4B333"
                stroke="#FFFFFF"
                strokeWidth="0.8"
                filter="url(#pin-shadow)"
              />
              <circle cx="4" cy="3.5" r="1.2" fill="#1D3557" />
            </g>
          </Marker>
        </ZoomableGroup>
      </ComposableMap>

      {/* Zoom Controls */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <button
          onClick={handleZoomIn}
          className="w-8 h-8 bg-white/90 hover:bg-white rounded-lg shadow-md flex items-center justify-center text-gray-700 font-bold text-lg transition-all hover:scale-110 active:scale-95"
          title="Zoom in"
        >
          +
        </button>
        <button
          onClick={handleZoomOut}
          className="w-8 h-8 bg-white/90 hover:bg-white rounded-lg shadow-md flex items-center justify-center text-gray-700 font-bold text-lg transition-all hover:scale-110 active:scale-95"
          title="Zoom out"
        >
          −
        </button>
        <button
          onClick={handleReset}
          className="w-8 h-8 bg-white/90 hover:bg-white rounded-lg shadow-md flex items-center justify-center text-gray-600 text-xs transition-all hover:scale-110 active:scale-95"
          title="Reset view"
        >
          ⊙
        </button>
      </div>

      {/* Drag hint */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-black/20 text-white text-xs px-3 py-1 rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 backdrop-blur-sm whitespace-nowrap">
        Drag to pan · scroll to zoom
      </div>

      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-sky-200/30 to-transparent pointer-events-none" />
    </div>
  );
}
