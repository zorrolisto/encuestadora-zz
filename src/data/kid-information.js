const edadesWithoutId = [
  "2 meses",
  "4 meses",
  "6 meses",
  "9 meses",
  "12 meses",
  "15 meses",
  "18 meses",
  "2 años",
  "30 meses",
  "3 años",
  "4 años",
  "5 años",
];
export const edades = edadesWithoutId.map((e, i) => ({
  id: i,
  description: e,
}));

const areasWithoutId = [
  "Social y Emocional",
  "Lenguaje y Comunicación",
  "Cognitivo",
  "Físico y Motor",
];
export const areas = areasWithoutId.map((e, i) => ({ id: i, description: e }));

const competenciasWithoutId = [
  {
    areaId: 1,
    edadId: 1,
    description: "Se calma cuando se le habla o lo alzan",
  },
  {
    areaId: 1,
    edadId: 1,
    description: "Lo mira a la cara",
  },
  {
    areaId: 2,
    edadId: 1,
    description: "Hace sonidos como 'agú', 'aahh'",
  },
  {
    areaId: 3,
    edadId: 1,
    description: "Lo observa mientras usted se mueve",
  },
  {
    areaId: 4,
    edadId: 1,
    description: "Mantiene la cabeza alzada cuando está boca abajo",
  },
  {
    areaId: 1,
    edadId: 2,
    description: "Sonríe solito para llamar su atención",
  },
  {
    areaId: 2,
    edadId: 2,
    description: "Gorjea ('agú', 'aahh')",
  },
  {
    areaId: 3,
    edadId: 2,
    description:
      "Si tiene hambre, abre la boca cuando ve el pecho o el biberón",
  },
  {
    areaId: 4,
    edadId: 2,
    description:
      "Mantiene la cabeza firme, sin apoyo, cuando usted lo tiene en brazos",
  },
];
export const competencias = competenciasWithoutId.map((e, i) => ({
  id: i,
  ...e,
}));

export const ALWAYS = "Siempre";
export const NEVER = "Nunca";
export const SOMETIMES = "A veces";
