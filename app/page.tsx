"use client";

import { useMemo, useState } from "react";
import AreaInput from "@/components/AreaInput";
import ConstantsPanel from "@/components/ConstantsPanel";
import CopyButton from "@/components/CopyButton";
import FitCheck from "@/components/FitCheck";
import Section from "@/components/Section";
import ValueGroup, { ValueChips } from "@/components/ValueGroup";
import {
  Constants,
  DEFAULT_CONSTANTS,
  DEFAULT_MAX_SIZE,
  MaxSize,
  SQ_IN_PER_SQ_FT,
  calculate,
} from "@/lib/calc";
import { useStickyState } from "@/lib/useStickyState";

const DECIMAL_OPTIONS = [2, 3, 4, 6];

export default function Page() {
  const [sqin, setSqin] = useStickyState<number>("pc.sqin", 1000);
  const [coats, setCoats] = useStickyState<number>("pc.coats", 1);
  const [decimals, setDecimals] = useStickyState<number>("pc.decimals", 4);
  const [showVars, setShowVars] = useStickyState<boolean>("pc.showVars", false);
  const [constants, setConstants] = useStickyState<Constants>("pc.constants", DEFAULT_CONSTANTS);
  const [part, setPart] = useState<MaxSize>({ W: 0, H: 0, L: 0 });

  const sqft = sqin / SQ_IN_PER_SQ_FT;
  const r = useMemo(() => calculate(sqft, coats, constants), [sqft, coats, constants]);
  const f = (n: number) => n.toFixed(decimals);

  const stainGroups = [
    {
      label: "Cutek Clearcoat",
      emphasis: true,
      items: [
        {
          name: "GALLONS_OF_STAIN_REQUIRED",
          value: f(r.GALLONS_OF_STAIN_REQUIRED),
          unit: "gal",
          formula: "(#SQFT/#STAIN)*#COATS",
        },
      ],
    },
    {
      label: "Cutek Colortone",
      items: [
        {
          name: "MILLIETERS_OF_CUTEK_COLORTONE_REQUIRED",
          value: f(r.MILLIETERS_OF_CUTEK_COLORTONE_REQUIRED),
          unit: "ml",
          formula: `#GALLONS_OF_STAIN_REQUIRED*${constants.CUTEK_ML_PER_GAL}`,
        },
        {
          name: "LITTERS_OF_CUTEK_COLORTONE_REQUIRED",
          value: f(r.LITTERS_OF_CUTEK_COLORTONE_REQUIRED),
          unit: "L",
          formula: "#MILLIETERS_OF_CUTEK_COLORTONE_REQUIRED/1000",
        },
      ],
    },
  ];

  const oilGroups = [
    {
      label: "Oil required",
      emphasis: true,
      items: [
        {
          name: "GALLONS_OF_OIL_REQUIRED",
          value: f(r.GALLONS_OF_OIL_REQUIRED),
          unit: "gal",
          formula: "(#SQFT/#OIL)*#COATS",
        },
      ],
    },
  ];

  const resystaGroups = [
    {
      label: "Primer",
      emphasis: true,
      items: [
        {
          name: "TOTAL_OF_RESYSTA_PRIMER",
          value: f(r.RESYSTA_PRIMER_MILLILITERS),
          unit: "ml",
          formula: `(#SQFT/${constants.RESYSTA_PRIMER_ML})*#COATS`,
        },
        {
          name: "RESYSTA_PRIMER_GALLONS",
          value: f(r.RESYSTA_PRIMER_GALLONS),
          unit: "gal",
          formula: `(#SQFT/${constants.RESYSTA_PRIMER_GAL})*#COATS`,
        },
        {
          name: "RESYSTA_PRIMER_LITERS",
          value: f(r.RESYSTA_PRIMER_LITERS),
          unit: "L",
          formula: "#TOTAL_OF_RESYSTA_PRIMER/1000",
        },
      ],
    },
    {
      label: "Stain",
      emphasis: true,
      items: [
        {
          name: "TOTAL_OF_RESYSTA_STAIN",
          value: f(r.RESYSTA_STAIN_MILLILITERS),
          unit: "ml",
          formula: `(#SQFT/${constants.RESYSTA_STAIN_ML})*#COATS`,
        },
        {
          name: "RESYSTA_STAIN_GALLONS",
          value: f(r.RESYSTA_STAIN_GALLONS),
          unit: "gal",
          formula: `(#SQFT/${constants.RESYSTA_STAIN_GAL})*#COATS`,
        },
        {
          name: "RESYSTA_STAIN_LITERS",
          value: f(r.RESYSTA_STAIN_LITERS),
          unit: "L",
          formula: "#TOTAL_OF_RESYSTA_STAIN/1000",
        },
      ],
    },
  ];

  const powderGroups = [
    {
      label: "Powder",
      emphasis: true,
      items: [
        { name: "KG", value: f(r.KG), unit: "kg", formula: "#SQFT/#COVER" },
        { name: "LBS", value: f(r.LBS), unit: "lb", formula: "#KG/0.453592" },
      ],
    },
  ];

  const allText = [
    `#SQIN\t${f(r.SQIN)}`,
    `#SQFT\t${f(r.SQFT)}`,
    `#COATS\t${coats}`,
    ...[...stainGroups, ...oilGroups, ...resystaGroups, ...powderGroups].flatMap((g) =>
      g.items.map((x) => `#${x.name}\t${x.value}`),
    ),
  ].join("\n");

  const groupText = (groups: { items: { name: string; value: string }[] }[]) =>
    groups.flatMap((g) => g.items.map((x) => `#${x.name}\t${x.value}`)).join("\n");

  return (
    <main className="mx-auto w-full max-w-[1500px] px-4 py-4">
      <header className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-baseline gap-3">
          <h1 className="text-lg font-semibold tracking-tight text-fg">
            Coating <span className="text-accent">Calculator</span>
          </h1>
          <p className="hidden text-[11px] text-fg-dim sm:block">
            Stain, oil, Resysta and powder quantities from total surface area.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-1.5 text-[11px] text-fg-dim">
            Decimals
            <select
              value={decimals}
              onChange={(e) => setDecimals(Number(e.target.value))}
              className="rounded-lg border border-line bg-field px-1.5 py-1 text-xs text-fg outline-none focus:border-accent/60"
            >
              {DECIMAL_OPTIONS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            onClick={() => setShowVars(!showVars)}
            aria-pressed={showVars}
            title={showVars ? "Show plain labels" : "Show Onshape variable names"}
            className={`rounded-lg border px-2 py-1 font-mono text-[11px] transition-colors ${
              showVars
                ? "border-accent/50 bg-accent/15 text-accent"
                : "border-line bg-raised text-fg-dim hover:text-fg"
            }`}
          >
            #name
          </button>
          <CopyButton
            value={allText}
            label="Copy all"
            className="px-2.5 py-1.5"
            title="Copy every value"
          />
        </div>
      </header>

      <div className="grid items-start gap-3 md:grid-cols-2">
        {/* Inputs */}
        <div className="flex flex-col gap-3">
          <AreaInput sqin={sqin} onChange={setSqin} decimals={decimals} />

          <ConstantsPanel
            constants={constants}
            onChange={setConstants}
            coats={coats}
            onCoatsChange={setCoats}
          />

          <FitCheck max={DEFAULT_MAX_SIZE} part={part} onPartChange={setPart} />
        </div>

        {/* Powder, stain, oil and Resysta */}
        <div className="flex flex-col gap-3">
          <Section
            title="Powder"
            accent="bg-sky-500"
            action={
              showVars ? (
                <CopyButton value={groupText(powderGroups)} label="Copy" />
              ) : (
                <ValueChips label="Powder" items={powderGroups[0].items} emphasis />
              )
            }
          >
            {showVars
              ? powderGroups.map((g) => <ValueGroup key={g.label} {...g} showVars />)
              : null}
          </Section>

          <Section
            title="Stain"
            accent="bg-orange-500"
            action={<CopyButton value={groupText(stainGroups)} label="Copy" />}
          >
            {stainGroups.map((g) => (
              <ValueGroup key={g.label} {...g} showVars={showVars} />
            ))}
          </Section>

          <Section
            title="Oil"
            accent="bg-emerald-500"
            action={
              showVars ? (
                <CopyButton value={groupText(oilGroups)} label="Copy" />
              ) : (
                <ValueChips label="Oil" items={oilGroups[0].items} emphasis />
              )
            }
          >
            {showVars
              ? oilGroups.map((g) => <ValueGroup key={g.label} {...g} showVars />)
              : null}
          </Section>

          <Section
            title="Resysta"
            accent="bg-cyan-500"
            action={<CopyButton value={groupText(resystaGroups)} label="Copy" />}
          >
            {resystaGroups.map((g) => (
              <ValueGroup key={g.label} {...g} showVars={showVars} />
            ))}
          </Section>
        </div>
      </div>

      <footer className="mt-3 flex items-center justify-between gap-3 px-1 text-[11px] text-fg-dim">
        <span>
          Developed by{" "}
          <a
            href="https://sergioalexo.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-accent underline-offset-4 transition-colors hover:text-accent-strong hover:underline"
          >
            Sergio Alexo
          </a>
        </span>
        <span className="flex flex-wrap items-center justify-end gap-x-3 gap-y-1">
          <a
            href="mailto:mgmt@sergioalexo.com?subject=Coating%20Calculator"
            title="Collaborations, suggestions and general inquiries"
            className="transition-colors hover:text-fg-muted"
          >
            mgmt@sergioalexo.com
          </a>
          <a
            href="https://sergioalexo.com"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-fg-muted"
          >
            sergioalexo.com
          </a>
        </span>
      </footer>
    </main>
  );
}
