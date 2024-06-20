export const UnitTypes = ["outerior", "residence", "room", "step"] as const
export type UnitType = (typeof UnitTypes)[number]
export const OuteriorUnits = [
  {
    index: 1,
    name: "外構",
  },
  {
    index: 2,
    name: "設備等（外構）",
  },
] as const

export const ResidenceUnits = [
  {
    index: 1,
    name: "屋根",
  },
  {
    index: 2,
    name: "外壁（南）",
  },
  {
    index: 3,
    name: "外壁（北）",
  },
  {
    index: 4,
    name: "外壁（東）",
  },
  {
    index: 5,
    name: "外壁（西）",
  },
  { index: 6, name: "設備等（住棟）" },
] as const

export const RankList = ["A", "B", "C", "D1", "D2"] as const
