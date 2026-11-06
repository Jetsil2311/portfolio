// Ring up an order at Nativa and watch the thermal ticket feed out. Items and
// prices are from the live menu. The columns, IVA split and ESC/POS commands
// come from the POS; the "To the printer" tab shows the exact bytes it would
// hand to WebUSB for this order.

"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { Minus, Plus } from "lucide-react";
import { buildReceipt, receiptBytes, toHex, type TicketLine } from "@/app/_lib/escpos";

const MENU = [
  { id: "chai", name: "Dirty Chai", price: 70, image: "/work/nat-chai.webp", station: "Bar" },
  { id: "moca", name: "Moca", price: 65, image: "/work/nat-moca.webp", station: "Bar" },
  { id: "caramel", name: "Caramel Macchiato", price: 65, image: "/work/nat-caramel.webp", station: "Bar" },
  { id: "latte", name: "Latte", price: 70, image: "/work/nat-latte.webp", station: "Bar" },
  { id: "burger", name: "Hamburguesa Nativa", price: 125, image: "/work/nat-burger.webp", station: "Kitchen" },
  { id: "sopa", name: "Sopa Azteca", price: 65, image: "/work/nat-sopa.webp", station: "Kitchen" },
];

type View = "receipt" | "kitchen" | "bytes";
const VIEWS: { id: View; label: string }[] = [
  { id: "receipt", label: "Receipt" },
  { id: "kitchen", label: "Kitchen" },
  { id: "bytes", label: "To the printer" },
];

export default function TicketPrinter() {
  const [qty, setQty] = useState<Record<string, number>>({ chai: 1, burger: 1 });
  const [view, setView] = useState<View>("receipt");
  const [feed, setFeed] = useState(0);

  const lines: TicketLine[] = useMemo(
    () => MENU.filter((m) => qty[m.id]).map((m) => ({ name: m.name, qty: qty[m.id], price: m.price })),
    [qty],
  );
  const receipt = buildReceipt(lines);
  const bytes = useMemo(() => receiptBytes(lines), [lines]);
  const byteCount = bytes.reduce((sum, run) => sum + run.bytes.length, 0);
  const empty = lines.length === 0;

  function change(id: string, delta: number) {
    setQty((q) => ({ ...q, [id]: Math.max(0, (q[id] ?? 0) + delta) }));
    if (delta > 0) setFeed((n) => n + 1);
  }

  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
      {/* the menu, set like a printed one */}
      <div className="lg:col-span-7">
        <h3 className="font-nat text-3xl font-bold sm:text-4xl">Ring up an order</h3>
        <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
          {MENU.map((item) => {
            const count = qty[item.id] ?? 0;
            return (
              <li key={item.id} className="glass-panel group flex flex-col overflow-hidden rounded-2xl">
                <button
                  type="button"
                  onClick={() => change(item.id, 1)}
                  aria-label={`Add ${item.name}, $${item.price}`}
                  className="relative aspect-square w-full overflow-hidden bg-[#1a4d5c] focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-[#fdf3dc]"
                >
                  <Image src={item.image} alt="" fill sizes="(min-width: 640px) 20vw, 45vw" className="object-cover transition-transform duration-500 ease-out-expo group-hover:scale-105" />
                </button>
                <div className="flex flex-1 flex-col gap-2 p-3">
                  <p className="font-nat text-[0.9375rem] leading-tight font-bold">{item.name}</p>
                  <div className="mt-auto flex items-center justify-between gap-2">
                    <span className="font-nat text-lg font-bold">${item.price}</span>
                    <div className="flex items-center gap-1">
                      {count > 0 && (
                        <>
                          <button
                            type="button"
                            onClick={() => change(item.id, -1)}
                            aria-label={`Remove one ${item.name}`}
                            className="glass glass-faux flex size-8 items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#0f4358]"
                          >
                            <Minus className="size-3.5" aria-hidden />
                          </button>
                          <span className="w-5 text-center font-nat font-bold tabular-nums" aria-live="polite">{count}</span>
                        </>
                      )}
                      <button
                        type="button"
                        onClick={() => change(item.id, 1)}
                        aria-label={`Add one ${item.name}`}
                        className="glass glass-faux glass-tint flex size-8 items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#0f4358]"
                      >
                        <Plus className="size-3.5" aria-hidden />
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {/* the printer */}
      <div className="lg:sticky lg:top-20 lg:col-span-5 lg:self-start">
        <div role="tablist" aria-label="Ticket view" className="glass glass-static mb-4 inline-flex flex-wrap gap-1 rounded-full p-1 font-mono text-xs">
          {VIEWS.map((v) => (
            <button
              key={v.id}
              type="button"
              role="tab"
              aria-selected={view === v.id}
              onClick={() => setView(v.id)}
              className={`min-h-9 rounded-full px-3.5 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#0f4358] ${view === v.id ? "glass glass-faux glass-tint" : "transition-colors duration-200 hover:bg-[#0f43581a]"}`}
            >
              {v.label}
            </button>
          ))}
        </div>

        <div className="relative mx-auto max-w-md">
          {/* printer mouth */}
          <div className="glass glass-faux glass-tint glass-static z-10 h-5 rounded-xl" />
          <div className="relative mx-3 -mt-1.5 overflow-hidden pt-1.5">
            <div
              key={feed}
              className="paper-feed relative bg-[#fffdf6] px-4 pt-5 pb-7 font-mono text-[0.71rem] leading-[1.55] text-[#1b1c1e] shadow-[0_18px_40px_-20px_#0f4358aa] sm:px-5 sm:text-xs"
              style={{ clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 7px), 96% 100%, 92% calc(100% - 7px), 88% 100%, 84% calc(100% - 7px), 80% 100%, 76% calc(100% - 7px), 72% 100%, 68% calc(100% - 7px), 64% 100%, 60% calc(100% - 7px), 56% 100%, 52% calc(100% - 7px), 48% 100%, 44% calc(100% - 7px), 40% 100%, 36% calc(100% - 7px), 32% 100%, 28% calc(100% - 7px), 24% 100%, 20% calc(100% - 7px), 16% 100%, 12% calc(100% - 7px), 8% 100%, 4% calc(100% - 7px), 0 100%)" }}
            >
              {empty ? (
                <p className="py-10 text-center text-[#6b6c6e]">Tap a dish to print a ticket.</p>
              ) : view === "receipt" ? (
                <div>
                  <p className="mb-3 text-center text-sm font-bold">NATIVA</p>
                  <pre className="mx-auto w-[32ch] max-w-full overflow-hidden font-mono whitespace-pre">{receipt.rows.join("\n")}</pre>
                  <pre className="mx-auto mt-3 w-[32ch] max-w-full overflow-hidden border-t border-dashed border-[#1b1c1e55] pt-3 font-mono whitespace-pre">{`${receipt.subtotal}\n${receipt.iva}`}</pre>
                  <pre className="mx-auto mt-1 w-[32ch] max-w-full overflow-hidden font-mono font-bold whitespace-pre">{receipt.totalRow}</pre>
                  <p className="mt-4 text-center text-[#6b6c6e]">¡Gracias por tu visita!</p>
                </div>
              ) : view === "kitchen" ? (
                <div>
                  <p className="mb-3 text-center text-sm font-bold">COMANDA</p>
                  {["Kitchen", "Bar"].map((station) => {
                    const items = MENU.filter((m) => m.station === station && qty[m.id]);
                    if (!items.length) return null;
                    return (
                      <div key={station} className="mb-3 last:mb-0">
                        <p className="border-b border-dashed border-[#1b1c1e55] pb-1 font-bold">{station}</p>
                        <ul className="mt-1 text-[0.9375rem] leading-snug font-medium">
                          {items.map((m) => (
                            <li key={m.id}>{qty[m.id]} x {m.name}</li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div>
                  <p className="mb-3 text-[#6b6c6e]">{byteCount} bytes for device.transferOut()</p>
                  <p className="leading-[1.7] break-words">
                    {bytes.map((run, i) =>
                      run.kind === "cmd" ? (
                        <span key={i} className="mr-1.5 inline-block rounded-sm bg-[#0f607a] px-1 font-medium text-[#fdf3dc]" title={run.label}>
                          {toHex(run.bytes)}
                        </span>
                      ) : (
                        <span key={i} className="mr-1.5 text-[#55565a]">
                          {toHex(run.bytes.slice(0, 10))}…
                        </span>
                      ),
                    )}
                  </p>
                  <p className="mt-3 text-[#6b6c6e]">
                    <span className="mr-1 inline-block rounded-sm bg-[#0f607a] px-1 text-[#fdf3dc]">blue</span>
                    printer commands: init, align, bold, feed, cut. Grey is the ticket text.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
