export const UnitTypes = ["outerior", "room", "step"] as const
export type UnitType = (typeof UnitTypes)[number]
export const OuteriorUnits = [
  {
    index: 1,
    name: "屋根",
  },
  {
    index: 2,
    name: "外壁南面",
  },
  { index: 3, name: "外壁北面" },
  { index: 4, name: "東妻面" },
  { index: 5, name: "西妻面" },
  { index: 6, name: "塗装・設備・外構" },
] as const

export const RankList = ["A", "B", "C", "D1", "D2"] as const
