import { type ComponentProps, type FC } from "react"
import { LinkButton } from "../elements/link"
import { House, Unit } from "@prisma/client"

export const UnitLinkButton: FC<
  ComponentProps<"button"> & {
    unitType: string
    floor: number
    index: number
    house: House & { units?: Unit[] }
    name?: string
  }
> = ({ house, unitType, index, floor, name, style, ...props }) => {
  const unit = house?.units?.find(
    (u) => u.type == unitType && u.index == index && u.floor == (floor ?? 1)
  )
  return (
    <LinkButton
      href={
        unit
          ? `/house/${house.id}/unit/${unit.id}`
          : `/house/${house.id}/unit/new?type=${unitType}&floor=${floor}&index=${index}`
      }
      selected={!!unit}
      style={{
        textWrap: "nowrap",
        width: "auto",
        ...style,
      }}
      {...props}
    >
      {unit?.name ?? name ?? `${unitType == "room" ? "部屋" : "階段"} ${index}`}
    </LinkButton>
  )
}
