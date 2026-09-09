# Coating Calculator

Next.js 16 + Tailwind 4 app that reproduces the Onshape variable table for stain, oil, Resysta
and powder coating quantities — with one-click copy on every value and a paste-aware surface
area input.

```bash
npm install
npm run dev      # http://localhost:3010
```

## Input

- **Total surface area** in `in²` or `ft²`, switchable. The **Paste** button reads the clipboard,
  pulls the first number out of whatever was copied (`1,234.5`, `2019 sq in`, `6.94 ft^2`) and
  auto-detects the unit when the text mentions one. `Ctrl+V` directly into the field does the same.
- **#COATS** with +/- steppers.
- Everything (area, coats, constants, envelope) persists in `localStorage`.

## Formulas

Identical to the Onshape variable table:

| Variable | Expression |
| --- | --- |
| `#SQFT` | in² / 144 |
| `#GALLONS_OF_STAIN_REQUIRED` | `(#SQFT/#STAIN)*#COATS` |
| `#MILLIETERS_OF_CUTEK_COLORTONE_REQUIRED` | `#GALLONS_OF_STAIN_REQUIRED*100` |
| `#LITTERS_OF_CUTEK_COLORTONE_REQUIRED` | `#MILLIETERS_.../1000` |
| `#GALLONS_OF_OIL_REQUIRED` | `(#SQFT/#OIL)*#COATS` |
| `#KG` | `#SQFT/#COVER` |
| `#LBS` | `#KG/0.453592` |
| `#TOTAL_OF_RESYSTA_PRIMER` | `(#SQFT/0.1585)*#COATS` ml |
| `#TOTAL_OF_RESYSTA_STAIN` | `(#SQFT/0.07927)*#COATS` ml |

Constants default to STAIN 600 sqft/gal, OIL 450 sqft/gal, GRAV 1.682, EFFIC 0.7,
THICKNESS 2.5 mil, Resysta primer 0.1585 sqft/ml (600 sqft/gal), Resysta stain 0.07927 sqft/ml
(300 sqft/gal). All are editable in the Constants panel.

## Copying

- Every row has a copy button.
- **Copy group** copies a section as `#NAME<tab>value` lines — pastes straight into a spreadsheet.
- **Copy all** copies every value including `#SQIN`, `#SQFT` and `#COATS`.
- If the browser blocks clipboard access, the button opens a small pre-selected field so `Ctrl+C`
  still works.

---

Developed by [Sergio Alexo](https://sergioalexo.com)

## License

Copyright (C) 2026 Sergio Alexo.

This program is free software: you can redistribute it and/or modify it under the terms of the
GNU General Public License as published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version. See [LICENSE](LICENSE) for the full text.
