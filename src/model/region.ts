/**
 * Refining regions. The surveyed pump gap is that region's gasoline or diesel
 * retail minus the Gulf Coast retail, median week, 2015 through June 2025,
 * March–May 2020 left out. It already includes taxes. It is not added again.
 * The dock is the published spot minus the Gulf spot, same window.
 * Midwest and the Rockies have no spot in that weekly table.
 */
export type RegionId = "east" | "midwest" | "gulf" | "rockies" | "west" | "california";

export type Region = {
  id: RegionId;
  name: string;
  /** Surveyed pump over the Gulf Coast pump. Not a dock. */
  gasolinePump: number;
  dieselPump: number;
  /** Published spot over the Gulf spot. Null where no spot is published. */
  gasolineDock: number | null;
  dieselDock: number | null;
};

export const REGIONS: Record<RegionId, Region> = {
  gulf: {
    id: "gulf",
    name: "Gulf Coast",
    gasolinePump: 0,
    dieselPump: 0,
    gasolineDock: 0,
    dieselDock: 0,
  },
  east: {
    id: "east",
    name: "East Coast",
    gasolinePump: 0.239,
    dieselPump: 0.255,
    gasolineDock: 0.058,
    dieselDock: 0.054,
  },
  midwest: {
    id: "midwest",
    name: "Midwest",
    gasolinePump: 0.196,
    dieselPump: 0.149,
    gasolineDock: null,
    dieselDock: null,
  },
  rockies: {
    id: "rockies",
    name: "Rocky Mountain",
    gasolinePump: 0.32,
    dieselPump: 0.229,
    gasolineDock: null,
    dieselDock: null,
  },
  west: {
    id: "west",
    name: "West Coast, outside California",
    gasolinePump: 0.673,
    dieselPump: 0.412,
    gasolineDock: null,
    dieselDock: null,
  },
  california: {
    id: "california",
    name: "California",
    gasolinePump: 1.244,
    dieselPump: 1.069,
    gasolineDock: 0.189,
    dieselDock: 0.087,
  },
};

const EAST = [
  "Maine", "New Hampshire", "Vermont", "Massachusetts", "Rhode Island", "Connecticut",
  "New York", "New Jersey", "Pennsylvania", "Delaware", "Maryland", "District of Columbia",
  "West Virginia", "Virginia", "North Carolina", "South Carolina", "Georgia", "Florida",
] as const;

const MIDWEST = [
  "Ohio", "Kentucky", "Tennessee", "Indiana", "Illinois", "Michigan", "Wisconsin", "Minnesota",
  "Iowa", "Missouri", "North Dakota", "South Dakota", "Nebraska", "Kansas", "Oklahoma",
] as const;

const GULF = ["Alabama", "Mississippi", "Arkansas", "Louisiana", "Texas", "New Mexico"] as const;

const ROCKIES = ["Montana", "Idaho", "Wyoming", "Utah", "Colorado"] as const;

const WEST = ["Washington", "Oregon", "Nevada", "Arizona", "Alaska", "Hawaii"] as const;

const BY_STATE: Record<string, RegionId> = {};
for (const name of EAST) BY_STATE[name] = "east";
for (const name of MIDWEST) BY_STATE[name] = "midwest";
for (const name of GULF) BY_STATE[name] = "gulf";
for (const name of ROCKIES) BY_STATE[name] = "rockies";
for (const name of WEST) BY_STATE[name] = "west";
BY_STATE.California = "california";

export function regionOf(stateName: string): Region {
  const id = BY_STATE[stateName];
  if (!id) throw new Error("that state is not in a refining region");
  return REGIONS[id];
}
