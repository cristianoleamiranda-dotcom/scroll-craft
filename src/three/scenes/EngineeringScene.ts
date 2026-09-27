/**
 * Technical drawing for an engineering state.
 * Labels come from published ranges. No invented measurements.
 */

export function drawEngineeringDiagram(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  index: number,
  label: string,
) {
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "rgba(255,255,255,0.92)";
  ctx.fillRect(0, 0, width, height);

  ctx.strokeStyle = "rgba(30,115,190,0.18)";
  ctx.lineWidth = 1;
  const step = 24;
  for (let x = 0; x <= width; x += step) {
    ctx.beginPath();
    ctx.moveTo(x + 0.5, 0);
    ctx.lineTo(x + 0.5, height);
    ctx.stroke();
  }
  for (let y = 0; y <= height; y += step) {
    ctx.beginPath();
    ctx.moveTo(0, y + 0.5);
    ctx.lineTo(width, y + 0.5);
    ctx.stroke();
  }

  const freq = 1 + index * 0.35;
  const mid = height * 0.52;

  ctx.beginPath();
  ctx.strokeStyle = "#0085b2";
  ctx.lineWidth = 1;
  for (let x = 0; x <= width; x += 2) {
    const u = x / width;
    const y = mid + Math.sin(u * Math.PI * 2 * freq * 2 + 0.7) * height * 0.12;
    if (x === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();

  ctx.beginPath();
  ctx.strokeStyle = "#1e73be";
  ctx.lineWidth = 1.6;
  for (let x = 0; x <= width; x += 2) {
    const u = x / width;
    const envelope = Math.sin(u * Math.PI);
    const y = mid + Math.sin(u * Math.PI * 2 * freq) * height * 0.28 * envelope;
    if (x === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();

  ctx.fillStyle = "#1e73be";
  ctx.beginPath();
  ctx.arc(width * (0.18 + (index % 5) * 0.14), mid, 3.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#494949";
  ctx.font = "500 11px 'IBM Plex Mono', ui-monospace, monospace";
  ctx.fillText(String(index + 1).padStart(2, "0"), 12, 18);
  const clipped = label.length > 64 ? `${label.slice(0, 61)}…` : label;
  ctx.fillText(clipped, 12, height - 12);
}
