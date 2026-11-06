// Ticket building from the POS (bk-menu-app/src/utils/printing). The command
// set, padLine and the IVA split are the production ones; the demo stops short
// of device.transferOut() and shows the bytes instead.

const ESC = 0x1b;
const GS = 0x1d;

const cmd = {
  init: () => new Uint8Array([ESC, 0x40]),
  alignLeft: () => new Uint8Array([ESC, 0x61, 0x00]),
  alignCenter: () => new Uint8Array([ESC, 0x61, 0x01]),
  boldOn: () => new Uint8Array([ESC, 0x45, 0x01]),
  boldOff: () => new Uint8Array([ESC, 0x45, 0x00]),
  feedLines: (n: number) => new Uint8Array([ESC, 0x64, n]),
  cutPaper: () => new Uint8Array([GS, 0x56, 0x41, 0x03]),
  text: (str: string) => new TextEncoder().encode(str + "\n"),
};

export function padLine(left: string, right: string, width = 32) {
  return left + " ".repeat(Math.max(1, width - left.length - right.length)) + right;
}

export function splitIva(total: number) {
  const safeTotal = isNaN(total) ? 0 : total;
  const subtotalSinIva = Math.round((safeTotal / 1.16) * 100) / 100;
  const ivaAmount = Math.round((safeTotal - subtotalSinIva) * 100) / 100;
  const ivaCheck = Math.round((subtotalSinIva + ivaAmount) * 100) / 100;
  const iva = Math.round((ivaAmount + (safeTotal - ivaCheck)) * 100) / 100;
  return { subtotalSinIva, iva };
}

export type TicketLine = { name: string; qty: number; price: number };

export function buildReceipt(lines: TicketLine[]) {
  const total = lines.reduce((sum, l) => sum + l.qty * l.price, 0);
  const { subtotalSinIva, iva } = splitIva(total);
  return {
    total,
    rows: lines.map((l) => padLine(`${l.qty} ${l.name}`.slice(0, 23), `$${(l.qty * l.price).toFixed(2)}`)),
    subtotal: padLine("Subtotal", `$${subtotalSinIva.toFixed(2)}`),
    iva: padLine("IVA 16%", `$${iva.toFixed(2)}`),
    totalRow: padLine("TOTAL", `$${total.toFixed(2)}`),
  };
}

// A run of bytes, tagged so the demo can tell commands from text.
export type ByteRun = { kind: "cmd" | "text"; label?: string; bytes: Uint8Array };

export function receiptBytes(lines: TicketLine[]): ByteRun[] {
  const r = buildReceipt(lines);
  const run = (label: string, bytes: Uint8Array): ByteRun => ({ kind: "cmd", label, bytes });
  const text = (str: string): ByteRun => ({ kind: "text", bytes: cmd.text(str) });
  return [
    run("init", cmd.init()),
    run("center", cmd.alignCenter()),
    run("bold", cmd.boldOn()),
    text("NATIVA"),
    run("bold off", cmd.boldOff()),
    run("left", cmd.alignLeft()),
    ...r.rows.map(text),
    text(r.subtotal),
    text(r.iva),
    run("bold", cmd.boldOn()),
    text(r.totalRow),
    run("bold off", cmd.boldOff()),
    run("feed 3", cmd.feedLines(3)),
    run("cut", cmd.cutPaper()),
  ];
}

export const toHex = (bytes: Uint8Array) =>
  Array.from(bytes, (b) => b.toString(16).padStart(2, "0").toUpperCase()).join(" ");
