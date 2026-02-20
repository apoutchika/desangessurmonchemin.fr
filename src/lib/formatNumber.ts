const SEP = " ";

export function formatNumber(n: number, unit: string | null, round?: number) {
  const pow = Math.pow(10, round ?? 0);
  const v = Math.round(n * pow) / pow;

  const txt = v.toLocaleString("fr-FR").replace(/\./, ",").replace(/ /g, SEP);

  const [a, b] = txt.split(",");

  if (!b)
    return [a, SEP, unit]
      .filter((v) => v !== null)
      .join("")
      .trim();

  const str = txt
    .replace(/0*$/, "")
    .replace(/[,\.]$/, "")
    .replace(/\./, ",");

  return [str, SEP, unit]
    .filter((v) => v !== null)
    .join("")
    .trim()
    .replace(/ /g, SEP);
}
