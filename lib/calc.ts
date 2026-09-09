// Mirrors the Onshape variable table 1:1.
//
//   #SQFT                                   -> total surface area in ft^2
//   #GALLONS_OF_STAIN_REQUIRED              = (#SQFT/#STAIN)*#COATS
//   #MILLIETERS_OF_CUTEK_COLORTONE_REQUIRED = #GALLONS_OF_STAIN_REQUIRED*100
//   #LITTERS_OF_CUTEK_COLORTONE_REQUIRED    = #MILLIETERS_.../1000
//   #GALLONS_OF_OIL_REQUIRED                = (#SQFT/#OIL)*#COATS
//   #KG                                     = #SQFT/#COVER
//   #LBS                                    = #KG/0.453592

export const LB_PER_KG = 0.453592;
export const SQ_IN_PER_SQ_FT = 144;

export type Constants = {
  STAIN: number; // sqft per gallon
  OIL: number; // sqft per gallon
  GRAV: number; // specific gravity
  EFFIC: number; // transfer efficiency (0-1)
  THICKNESS: number; // mil
  COVER: number; // sqft per lb of powder
  coverAuto: boolean; // derive COVER from GRAV / EFFIC / THICKNESS
  CUTEK_ML_PER_GAL: number; // ml of Colortone per gallon of stain
  RESYSTA_PRIMER_ML: number; // sqft per ml
  RESYSTA_PRIMER_GAL: number; // sqft per US gallon
  RESYSTA_STAIN_ML: number; // sqft per ml
  RESYSTA_STAIN_GAL: number; // sqft per US gallon
};

export const DEFAULT_CONSTANTS: Constants = {
  STAIN: 600,
  OIL: 450,
  GRAV: 1.682,
  EFFIC: 0.7,
  THICKNESS: 2.5,
  COVER: 32.012,
  coverAuto: true,
  CUTEK_ML_PER_GAL: 100,
  RESYSTA_PRIMER_ML: 0.1585,
  RESYSTA_PRIMER_GAL: 600,
  RESYSTA_STAIN_ML: 0.07927,
  RESYSTA_STAIN_GAL: 300,
};

export type MaxSize = { W: number; H: number; L: number };
export const DEFAULT_MAX_SIZE: MaxSize = { W: 40, H: 58, L: 115 };

/** Theoretical powder coverage: 192.3 / (SG x mils) x transfer efficiency = sqft per lb. */
export function deriveCover(c: Pick<Constants, "GRAV" | "EFFIC" | "THICKNESS">): number {
  const denom = c.GRAV * c.THICKNESS;
  if (!denom) return 0;
  return (192.3 / denom) * c.EFFIC;
}

export function effectiveCover(c: Constants): number {
  return c.coverAuto ? deriveCover(c) : c.COVER;
}

export type Results = {
  SQFT: number;
  SQIN: number;
  COVER: number;
  GALLONS_OF_STAIN_REQUIRED: number;
  MILLIETERS_OF_CUTEK_COLORTONE_REQUIRED: number;
  LITTERS_OF_CUTEK_COLORTONE_REQUIRED: number;
  GALLONS_OF_OIL_REQUIRED: number;
  KG: number;
  LBS: number;
  RESYSTA_PRIMER_MILLILITERS: number;
  RESYSTA_PRIMER_LITERS: number;
  RESYSTA_PRIMER_GALLONS: number;
  RESYSTA_STAIN_MILLILITERS: number;
  RESYSTA_STAIN_LITERS: number;
  RESYSTA_STAIN_GALLONS: number;
};

export function calculate(sqft: number, coats: number, c: Constants): Results {
  const COVER = effectiveCover(c);
  const stainGal = c.STAIN ? (sqft / c.STAIN) * coats : 0;
  const oilGal = c.OIL ? (sqft / c.OIL) * coats : 0;
  const cutekMl = stainGal * c.CUTEK_ML_PER_GAL;
  const KG = COVER ? sqft / COVER : 0;

  // Resysta: coverage is quoted directly as sqft per ml and sqft per US gallon.
  const resystaPrimerMl = c.RESYSTA_PRIMER_ML ? (sqft / c.RESYSTA_PRIMER_ML) * coats : 0;
  const resystaStainMl = c.RESYSTA_STAIN_ML ? (sqft / c.RESYSTA_STAIN_ML) * coats : 0;

  return {
    SQFT: sqft,
    SQIN: sqft * SQ_IN_PER_SQ_FT,
    COVER,
    GALLONS_OF_STAIN_REQUIRED: stainGal,
    MILLIETERS_OF_CUTEK_COLORTONE_REQUIRED: cutekMl,
    LITTERS_OF_CUTEK_COLORTONE_REQUIRED: cutekMl / 1000,
    GALLONS_OF_OIL_REQUIRED: oilGal,
    KG,
    LBS: KG / LB_PER_KG,
    RESYSTA_PRIMER_MILLILITERS: resystaPrimerMl,
    RESYSTA_PRIMER_LITERS: resystaPrimerMl / 1000,
    RESYSTA_PRIMER_GALLONS: c.RESYSTA_PRIMER_GAL ? (sqft / c.RESYSTA_PRIMER_GAL) * coats : 0,
    RESYSTA_STAIN_MILLILITERS: resystaStainMl,
    RESYSTA_STAIN_LITERS: resystaStainMl / 1000,
    RESYSTA_STAIN_GALLONS: c.RESYSTA_STAIN_GAL ? (sqft / c.RESYSTA_STAIN_GAL) * coats : 0,
  };
}

/** Fits if any orientation of the part is within the oven/booth envelope. */
export function fitsEnvelope(part: MaxSize, max: MaxSize) {
  const dims = [part.W, part.H, part.L];
  if (dims.some((d) => !d || d <= 0)) return null;
  const box = [max.W, max.H, max.L];
  const perms = [
    [0, 1, 2],
    [0, 2, 1],
    [1, 0, 2],
    [1, 2, 0],
    [2, 0, 1],
    [2, 1, 0],
  ];
  for (const p of perms) {
    if (dims[p[0]] <= box[0] && dims[p[1]] <= box[1] && dims[p[2]] <= box[2]) {
      return { fits: true, orientation: p };
    }
  }
  return { fits: false, orientation: null };
}

export function fmt(n: number, decimals: number): string {
  if (!isFinite(n)) return "0";
  return n.toFixed(decimals);
}

/** Pulls the first number out of pasted text; understands 1,234.5 / 12" / 6.94 ft^2. */
export function parseNumeric(text: string): { value: number | null; unit: "in" | "ft" | null } {
  const cleaned = text.replace(/,/g, " ").trim();
  const match = cleaned.match(/-?\d*\.?\d+(?:[eE][-+]?\d+)?/);
  if (!match) return { value: null, unit: null };
  const value = parseFloat(match[0]);
  if (!isFinite(value)) return { value: null, unit: null };
  const lower = cleaned.toLowerCase();
  let unit: "in" | "ft" | null = null;
  if (/(sq\s*\.?\s*in|in\^?2|in²|inch|\bin\b|")/.test(lower)) unit = "in";
  if (/(sq\s*\.?\s*ft|ft\^?2|ft²|feet|foot|\bft\b|')/.test(lower)) unit = "ft";
  return { value, unit };
}
