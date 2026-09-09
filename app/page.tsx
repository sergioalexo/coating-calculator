"use client";

import { useMemo, useState } from "react";
import AreaInput from "@/components/AreaInput";
import ConstantsPanel from "@/components/ConstantsPanel";
import CopyButton from "@/components/CopyButton";
import FitCheck from "@/components/FitCheck";
import Section from "@/components/Section";
import ValueRow from "@/components/ValueRow";
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
  const [maxSize, setMaxSize] = useStickyState<MaxSize>("pc.maxSize", DEFAULT_MAX_SIZE);
  const [part, setPart] = useState<MaxSize>({ W: 0, H: 0, L: 0 });

  const sqft = sqin / SQ_IN_PER_SQ_FT;
  const r = useMemo(() => calculate(sqft, coats, constants), [sqft, coats, constants]);
  const f = (n: number) => n.toFixed(decimals);

  const stainRows = [
    {
      label: "Stain required",
      name: "GALLONS_OF_STAIN_REQUIRED",
      value: f(r.GALLONS_OF_STAIN_REQUIRED),
      unit: "gal",
      formula: "(#SQFT/#STAIN)*#COATS",
      emphasis: true,
    },
    {
      label: "Cutek Colortone",
      name: "MILLIETERS_OF_CUTEK_COLORTONE_REQUIRED",
      value: f(r.MILLIETERS_OF_CUTEK_COLORTONE_REQUIRED),
      unit: "ml",
      formula: `#GALLONS_OF_STAIN_REQUIRED*${constants.CUTEK_ML_PER_GAL}`,
    },
    {
      label: "Cutek Colortone",
      name: "LITTERS_OF_CUTEK_COLORTONE_REQUIRED",
      value: f(r.LITTERS_OF_CUTEK_COLORTONE_REQUIRED),
      unit: "L",
      formula: "#MILLIETERS_OF_CUTEK_COLORTONE_REQUIRED/1000",
    },
  ];

  const oilRows = [
    {
      label: "Oil required",
      name: "GALLONS_OF_OIL_REQUIRED",
      value: f(r.GALLONS_OF_OIL_REQUIRED),
      unit: "gal",
      formula: "(#SQFT/#OIL)*#COATS",
      emphasis: true,
    },
  ];

  const resystaRows = [
    {
      label: "Resysta primer",
      name: "TOTAL_OF_RESYSTA_PRIMER",
      value: f(r.RESYSTA_PRIMER_MILLILITERS),
      unit: "ml",
      formula: `(#SQFT/${constants.RESYSTA_PRIMER_ML})*#COATS`,
      emphasis: true,
    },
    {
      label: "Resysta primer",
      name: "RESYSTA_PRIMER_GALLONS",
      value: f(r.RESYSTA_PRIMER_GALLONS),
      unit: "gal",
      formula: `(#SQFT/${constants.RESYSTA_PRIMER_GAL})*#COATS`,
    },
    {
      label: "Resysta primer",
      name: "RESYSTA_PRIMER_LITERS",
      value: f(r.RESYSTA_PRIMER_LITERS),
      unit: "L",
      formula: "#TOTAL_OF_RESYSTA_PRIMER/1000",
    },
    {
      label: "Resysta stain",
      name: "TOTAL_OF_RESYSTA_STAIN",
      value: f(r.RESYSTA_STAIN_MILLILITERS),
      unit: "ml",
      formula: `(#SQFT/${constants.RESYSTA_STAIN_ML})*#COATS`,
      emphasis: true,
    },
    {
      label: "Resysta stain",
      name: "RESYSTA_STAIN_GALLONS",
      value: f(r.RESYSTA_STAIN_GALLONS),
      unit: "gal",
      formula: `(#SQFT/${constants.RESYSTA_STAIN_GAL})*#COATS`,
    },
    {
      label: "Resysta stain",
      name: "RESYSTA_STAIN_LITERS",
      value: f(r.RESYSTA_STAIN_LITERS),
      unit: "L",
      formula: "#TOTAL_OF_RESYSTA_STAIN/1000",
    },
  ];

  const powderRows = [
    {
      label: "Powder — Onshape #KG",
      name: "KG",
      value: f(r.KG),
      unit: "",
      formula: "#SQFT/#COVER",
      emphasis: true,
    },
    {
      label: "Powder — Onshape #LBS",
      name: "LBS",
      value: f(r.LBS),
      unit: "",
      formula: "#KG/0.453592",
    },
    {
      label: "Powder required",
      name: "POWDER_LB",
      value: f(r.POWDER_LB),
      unit: "lb",
      formula: "true pounds of powder",
      emphasis: true,
    },
    {
      label: "Powder required",
      name: "POWDER_KG",
      value: f(r.POWDER_KG),
      unit: "kg",
      formula: "true kilograms of powder",
    },
  ];

  const allText = [
    `#SQIN\t${f(r.SQIN)}`,
    `#SQFT\t${f(r.SQFT)}`,
    `#COATS\t${coats}`,
    ...[...stainRows, ...oilRows, ...resystaRows, ...powderRows].map(
      (x) => `#${x.name}\t${x.value}`,
    ),
  ].join("\n");

  const groupText = (rows: { name: string; value: string }[]) =>
    rows.map((x) => `#${x.name}\t${x.value}`).join("\n");

  return (
    <main className="mx-auto w-full max-w-[1500px] px-4 py-4">
      <header className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-baseline gap-3">
          <h1 className="text-lg font-semibold tracking-tight text-white">
            Coating <span className="text-sky-400">Calculator</span>
          </h1>
          <p className="hidden text-[11px] text-zinc-500 sm:block">
            Stain, oil, Resysta and powder quantities from total surface area.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-1.5 text-[11px] text-zinc-500">
            Decimals
            <select
              value={decimals}
              onChange={(e) => setDecimals(Number(e.target.value))}
              className="rounded-lg border border-white/10 bg-black/40 px-1.5 py-1 text-xs text-zinc-200 outline-none focus:border-sky-400/60"
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
                ? "border-sky-500/50 bg-sky-500/15 text-sky-300"
                : "border-white/10 bg-white/5 text-zinc-500 hover:text-zinc-200"
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

      <div className="grid items-start gap-3 md:grid-cols-2 lg:grid-cols-3">
        {/* Inputs */}
        <div className="flex flex-col gap-3">
          <AreaInput sqin={sqin} onChange={setSqin} decimals={decimals} />

          <section className="rounded-xl border border-white/10 bg-zinc-900/50 px-3 py-2">
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <div className="text-[13px] text-zinc-300">Coats</div>
                <div className="font-mono text-[10px] text-zinc-600">#COATS</div>
              </div>
              <div className="flex items-center gap-1">
                <StepButton onClick={() => setCoats(Math.max(1, coats - 1))} label="-" />
                <input
                  type="number"
                  min={1}
                  value={String(coats)}
                  onChange={(e) => setCoats(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="w-14 rounded-lg border border-white/10 bg-black/40 px-2 py-1.5 text-center font-mono text-sm tabular-nums text-white outline-none focus:border-sky-400/60"
                />
                <StepButton onClick={() => setCoats(coats + 1)} label="+" />
              </div>
              <CopyButton value={String(coats)} title={`Copy ${coats}`} />
            </div>
          </section>

          <ConstantsPanel constants={constants} onChange={setConstants} />

          <FitCheck max={maxSize} onMaxChange={setMaxSize} part={part} onPartChange={setPart} />
        </div>

        {/* Stain, oil and Resysta */}
        <div className="flex flex-col gap-3">
          <Section
            title="Stain"
            accent="bg-orange-500"
            action={<CopyButton value={groupText(stainRows)} label="Copy" />}
          >
            {stainRows.map((row) => (
              <ValueRow key={row.name} {...row} showVars={showVars} />
            ))}
          </Section>

          <Section
            title="Oil"
            accent="bg-emerald-500"
            action={<CopyButton value={groupText(oilRows)} label="Copy" />}
          >
            {oilRows.map((row) => (
              <ValueRow key={row.name} {...row} showVars={showVars} />
            ))}
          </Section>

          <Section
            title="Resysta"
            accent="bg-cyan-500"
            action={<CopyButton value={groupText(resystaRows)} label="Copy" />}
          >
            {resystaRows.map((row) => (
              <ValueRow key={row.name} {...row} showVars={showVars} />
            ))}
          </Section>
        </div>

        {/* Powder */}
        <div className="flex flex-col gap-3">
          <Section
            title="Powder"
            accent="bg-sky-500"
            action={<CopyButton value={groupText(powderRows)} label="Copy" />}
            note={
              <>
                #COVER ({r.COVER.toFixed(3)}) is sqft per <em>pound</em>, so Onshape&rsquo;s #KG holds
                pounds and #LBS holds kilograms. The first two rows reproduce those formulas exactly;
                the last two carry the true units.
              </>
            }
          >
            {powderRows.map((row) => (
              <ValueRow key={row.name} {...row} showVars={showVars} />
            ))}
          </Section>

          <footer className="flex items-center justify-between gap-3 px-1 text-[11px] text-zinc-600">
            <span>
              Developed by{" "}
              <a
                href="https://sergioalexo.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-sky-400/90 underline-offset-4 transition-colors hover:text-sky-300 hover:underline"
              >
                Sergio Alexo
              </a>
            </span>
            <a
              href="https://sergioalexo.com"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-zinc-300"
            >
              sergioalexo.com
            </a>
          </footer>
        </div>
      </div>
    </main>
  );
}

function StepButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label === "+" ? "Increase coats" : "Decrease coats"}
      className="h-8 w-8 rounded-lg border border-white/10 bg-white/5 text-sm text-zinc-300 transition-colors hover:bg-white/10 hover:text-white"
    >
      {label}
    </button>
  );
}
