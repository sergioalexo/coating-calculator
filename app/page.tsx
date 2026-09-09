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
  const [constants, setConstants] = useStickyState<Constants>("pc.constants", DEFAULT_CONSTANTS);
  const [maxSize, setMaxSize] = useStickyState<MaxSize>("pc.maxSize", DEFAULT_MAX_SIZE);
  const [part, setPart] = useState<MaxSize>({ W: 0, H: 0, L: 0 });

  const sqft = sqin / SQ_IN_PER_SQ_FT;
  const r = useMemo(() => calculate(sqft, coats, constants), [sqft, coats, constants]);
  const f = (n: number) => n.toFixed(decimals);

  const stainRows = [
    {
      name: "GALLONS_OF_STAIN_REQUIRED",
      value: f(r.GALLONS_OF_STAIN_REQUIRED),
      unit: "gal",
      formula: "(#SQFT/#STAIN)*#COATS",
      emphasis: true,
    },
    {
      name: "AMOUNT_STAIN_OF_5_GALLON_NEEDED",
      value: f(r.AMOUNT_STAIN_OF_5_GALLON_NEEDED),
      unit: "pails",
      formula: `#GALLONS_OF_STAIN_REQUIRED/${constants.PAIL}`,
    },
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
  ];

  const oilRows = [
    {
      name: "GALLONS_OF_OIL_REQUIRED",
      value: f(r.GALLONS_OF_OIL_REQUIRED),
      unit: "gal",
      formula: "(#SQFT/#OIL)*#COATS",
      emphasis: true,
    },
    {
      name: "AMOUNT_OIL_OF_5_GALLON_NEEDED",
      value: f(r.AMOUNT_OIL_OF_5_GALLON_NEEDED),
      unit: "pails",
      formula: `#GALLONS_OF_OIL_REQUIRED/${constants.PAIL}`,
    },
  ];

  const resystaRows = [
    {
      name: "TOTAL_OF_RESYSTA_PRIMER",
      value: f(r.RESYSTA_PRIMER_MILLILITERS),
      unit: "ml",
      formula: `(#SQFT/${constants.RESYSTA_PRIMER_ML})*#COATS`,
      emphasis: true,
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
    {
      name: "TOTAL_OF_RESYSTA_STAIN",
      value: f(r.RESYSTA_STAIN_MILLILITERS),
      unit: "ml",
      formula: `(#SQFT/${constants.RESYSTA_STAIN_ML})*#COATS`,
      emphasis: true,
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
  ];

  const powderRows = [
    { name: "KG", value: f(r.KG), unit: "", formula: "#SQFT/#COVER", emphasis: true },
    { name: "LBS", value: f(r.LBS), unit: "", formula: "#KG/0.453592" },
  ];

  const allText = [
    `#SQIN\t${f(r.SQIN)}`,
    `#SQFT\t${f(r.SQFT)}`,
    `#COATS\t${coats}`,
    ...[...stainRows, ...oilRows, ...resystaRows, ...powderRows].map(
      (x) => `#${x.name}\t${x.value}`,
    ),
    `POWDER_LB\t${f(r.POWDER_LB)}`,
    `POWDER_KG\t${f(r.POWDER_KG)}`,
  ].join("\n");

  const groupText = (rows: { name: string; value: string }[]) =>
    rows.map((x) => `#${x.name}\t${x.value}`).join("\n");

  return (
    <main className="mx-auto min-h-screen w-full max-w-5xl px-4 py-8 sm:px-6">
      <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-white">
            Coating <span className="text-sky-400">Calculator</span>
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Stain, oil, Resysta and powder quantities from total surface area. Click any value to copy it.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-[11px] text-zinc-500">
            Decimals
            <select
              value={decimals}
              onChange={(e) => setDecimals(Number(e.target.value))}
              className="rounded-lg border border-white/10 bg-black/40 px-2 py-1.5 text-xs text-zinc-200 outline-none focus:border-sky-400/60"
            >
              {DECIMAL_OPTIONS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </label>
          <CopyButton value={allText} label="Copy all" className="px-3 py-2" title="Copy every value" />
        </div>
      </header>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="flex flex-col gap-4">
          <AreaInput sqin={sqin} onChange={setSqin} decimals={decimals} />

          <section className="rounded-xl border border-white/10 bg-zinc-900/50 p-4">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="font-mono text-[11px] text-zinc-400">#COATS</div>
                <div className="text-[10px] text-zinc-600">Number of coats applied</div>
              </div>
              <div className="flex items-center gap-1">
                <StepButton onClick={() => setCoats(Math.max(1, coats - 1))} label="-" />
                <input
                  type="number"
                  min={1}
                  value={String(coats)}
                  onChange={(e) => setCoats(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="w-16 rounded-lg border border-white/10 bg-black/40 px-2 py-2 text-center font-mono text-sm tabular-nums text-white outline-none focus:border-sky-400/60"
                />
                <StepButton onClick={() => setCoats(coats + 1)} label="+" />
              </div>
              <CopyButton value={String(coats)} title={`Copy ${coats}`} />
            </div>
          </section>

          <ConstantsPanel constants={constants} onChange={setConstants} />

          <FitCheck max={maxSize} onMaxChange={setMaxSize} part={part} onPartChange={setPart} />
        </div>

        <div className="flex flex-col gap-4">
          <Section
            title="Stain"
            accent="bg-orange-500"
            action={<CopyButton value={groupText(stainRows)} label="Copy group" />}
          >
            {stainRows.map((row) => (
              <ValueRow key={row.name} {...row} />
            ))}
          </Section>

          <Section
            title="Oil"
            accent="bg-emerald-500"
            action={<CopyButton value={groupText(oilRows)} label="Copy group" />}
          >
            {oilRows.map((row) => (
              <ValueRow key={row.name} {...row} />
            ))}
          </Section>

          <Section
            title="Resysta"
            accent="bg-cyan-500"
            action={<CopyButton value={groupText(resystaRows)} label="Copy group" />}
            note={
              <>
                Primer {constants.RESYSTA_PRIMER_ML} sqft/ml ({constants.RESYSTA_PRIMER_GAL} sqft/US gal),
                stain {constants.RESYSTA_STAIN_ML} sqft/ml ({constants.RESYSTA_STAIN_GAL} sqft/US gal).
                Multiplied by #COATS.
              </>
            }
          >
            {resystaRows.map((row) => (
              <ValueRow key={row.name} {...row} />
            ))}
          </Section>

          <Section
            title="Powder"
            accent="bg-sky-500"
            action={<CopyButton value={groupText(powderRows)} label="Copy group" />}
            note={
              <>
                <span className="text-zinc-400">Unit note:</span> #COVER (
                {r.COVER.toFixed(3)}) is square feet per <em>pound</em> — 192.3 / (GRAV x THICKNESS) x
                EFFIC — so the Onshape #KG value is actually pounds and #LBS is kilograms. The values
                above reproduce your formulas exactly; the true units are below.
              </>
            }
          >
            {powderRows.map((row) => (
              <ValueRow key={row.name} {...row} />
            ))}
            <div className="mt-1 border-t border-white/10 pt-1">
              <ValueRow name="POWDER_LB" value={f(r.POWDER_LB)} unit="lb" formula="true pounds of powder" />
              <ValueRow name="POWDER_KG" value={f(r.POWDER_KG)} unit="kg" formula="true kilograms of powder" />
            </div>
          </Section>
        </div>
      </div>

      <footer className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-5 text-xs text-zinc-500">
        <span>
          Developed by{" "}
          <a
            href="https://sergioalexo.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-sky-400 underline-offset-4 transition-colors hover:text-sky-300 hover:underline"
          >
            Sergio Alexo
          </a>
        </span>
        <a
          href="https://sergioalexo.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-zinc-600 transition-colors hover:text-zinc-300"
        >
          sergioalexo.com
        </a>
      </footer>
    </main>
  );
}

function StepButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label === "+" ? "Increase coats" : "Decrease coats"}
      className="h-9 w-9 rounded-lg border border-white/10 bg-white/5 text-sm text-zinc-300 transition-colors hover:bg-white/10 hover:text-white"
    >
      {label}
    </button>
  );
}
