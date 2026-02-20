import { describe, it, expect } from "vitest";
import { formatNumber } from "./formatNumber";

// ─── Attention ça contient un espace insécable ──────────────────────────────────────────────────────────────

describe("contient un espace insécable", () => {
  it("check qu'il s'agit bien d'un espace insécable", () => {
    expect(formatNumber(12, "km")).toBe("12 km");
    expect(formatNumber(12, "km")).not.toBe("12 km");
  });
});

// ─── Cas de base ──────────────────────────────────────────────────────────────

describe("entiers sans décimales", () => {
  it("formate un entier simple avec unité", () => {
    expect(formatNumber(12, "km")).toBe("12 km");
  });

  it("formate zéro", () => {
    expect(formatNumber(0, "m")).toBe("0 m");
  });

  it("formate un grand nombre avec séparateur de milliers français", () => {
    expect(formatNumber(1000, "m")).toBe("1 000 m");
  });

  it("formate sans unité (unit = null)", () => {
    expect(formatNumber(42, null)).toBe("42");
  });
});

// ─── Arrondis ─────────────────────────────────────────────────────────────────

describe("round", () => {
  it("arrondit à 0 décimale par défaut", () => {
    expect(formatNumber(12.6, "km")).toBe("13 km");
  });

  it("round=1 : garde une décimale significative", () => {
    expect(formatNumber(12.4, "km", 1)).toBe("12,4 km");
  });

  it("round=1 : supprime les zéros finaux", () => {
    expect(formatNumber(12.0, "km", 1)).toBe("12 km");
  });

  it("round=2 : deux décimales", () => {
    expect(formatNumber(3.14159, "km", 2)).toBe("3,14 km");
  });

  it("round=2 : supprime les zéros finaux (3.10 → 3,1)", () => {
    expect(formatNumber(3.1, "km", 2)).toBe("3,1 km");
  });

  it("round=2 : supprime les zéros finaux (3.00 → 3)", () => {
    expect(formatNumber(3.0, "km", 2)).toBe("3 km");
  });

  it("round=0 explicite", () => {
    expect(formatNumber(7.9, "m", 0)).toBe("8 m");
  });
});

// ─── Séparateur décimal français ──────────────────────────────────────────────

describe("format français", () => {
  it("utilise la virgule comme séparateur décimal", () => {
    expect(formatNumber(1.5, "km", 1)).toContain(",");
  });

  it("n'utilise pas le point comme séparateur décimal", () => {
    expect(formatNumber(1.5, "km", 1)).not.toMatch(/\d\.\d/);
  });

  it("séparateur de milliers : espace insécable ou espace", () => {
    const result = formatNumber(1500, "m");
    // accepte espace fine insécable (\u202f) ou espace normale selon la locale
    expect(result).toMatch(/1[\s\u202f]500/);
  });
});

// ─── Unités diverses ──────────────────────────────────────────────────────────

describe("unités", () => {
  it("unité 'm'", () => {
    expect(formatNumber(320, "m")).toBe("320 m");
  });

  it("unité 'km'", () => {
    expect(formatNumber(28, "km")).toBe("28 km");
  });

  it("unité 'h'", () => {
    expect(formatNumber(3, "h")).toBe("3 h");
  });

  it("unité null : pas d'espace traînant", () => {
    const result = formatNumber(100, null);
    expect(result).toBe("100");
    expect(result.endsWith(" ")).toBe(false);
  });

  it("unité chaîne vide : pas d'espace traînant", () => {
    // selon usage, unit="" peut arriver
    const result = formatNumber(100, "");
    expect(result.trimEnd()).toBe("100");
  });
});

// ─── Valeurs limites ──────────────────────────────────────────────────────────

describe("valeurs limites", () => {
  it("nombre négatif", () => {
    expect(formatNumber(-5, "m")).toBe("-5 m");
  });

  it("nombre très grand", () => {
    expect(formatNumber(1_000_000, "m")).toBe("1 000 000 m");
  });

  it("valeur proche de zéro avec round=2", () => {
    expect(formatNumber(0.001, "km", 2)).toBe("0 km");
  });

  it("NaN ne plante pas", () => {
    expect(() => formatNumber(NaN, "m")).not.toThrow();
  });

  it("Infinity ne plante pas", () => {
    expect(() => formatNumber(Infinity, "m")).not.toThrow();
  });
});

// ─── Bug connu : if (!b) sans return ─────────────────────────────────────────

describe("bug ligne 7 (if sans return)", () => {
  it("entier sans décimale retourne bien la valeur avec unité", () => {
    // Sans le fix, ce cas tombe sur le chemin `str` qui peut mal se comporter
    expect(formatNumber(671, "m")).toBe("671 m");
  });

  it("round=1 sur un entier : pas de virgule résiduelle", () => {
    const result = formatNumber(100, "m", 1);
    expect(result).not.toMatch(/,/);
    expect(result).toBe("100 m");
  });
});
