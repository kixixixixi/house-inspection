"use client"

import { NextPage } from "next"
import { useEffect, useState, type ComponentProps, type FC } from "react"
import { OuteriorUnits, ResidenceUnits } from "@/lib/constant/unit"
import { UnitLinkButton } from "@/components/modules/unit-link-button"
import { House, Unit, Version } from "@prisma/client"
import { api } from "@/lib/api"

const RowSection: FC<ComponentProps<"section">> = ({ style, ...props }) => (
  <section
    style={{
      display: "flex",
      gap: ".25rem",
      overflowX: "scroll",
      overflowY: "hidden",
      padding: ".5rem 0",
      ...style,
    }}
    {...props}
  />
)

const HouseIdVersionPage: NextPage<{
  params: { id: string; versionId: string }
}> = ({ params: { id, versionId } }) => {
  const [version, setVersion] = useState<Version & { house: House }>()
  const [units, setUnits] = useState<Unit[]>()
  useEffect(() => {
    const fetch = async () => {
      const response = await (await api()).get(`/api/version/${versionId}`)
      const { version, units } = await response.json<{
        version: Version & { house: House }
        units?: Unit[]
      }>()
      setVersion(version)
      setUnits(units)
    }
    fetch()
  }, [versionId])
  return (
    <>
      <section
        style={{
          padding: "1rem",
        }}
      >
        {version && (
          <>
            <hgroup style={{ padding: "1rem 0" }}>
              <h1>{version.house.name}</h1>
              <p>履歴</p>
              <p>
                {version.reason}({version.code})
              </p>
              <p>
                {new Date(version.createdAt).toLocaleDateString()}&nbsp;
                {new Date(version.createdAt).toLocaleTimeString()}
              </p>
            </hgroup>
            <div
              style={{
                display: "flex",
                flexFlow: "column",
                gap: ".25rem",
                padding: "1rem 0",
              }}
            >
              <p style={{ borderBottom: "solid 1px #ccc", padding: ".25rem" }}>
                外構
              </p>
              <RowSection>
                {units
                  ?.filter((unit) => unit.type == "outerior")
                  .map((unit) => (
                    <UnitLinkButton
                      key={unit.id}
                      unitType="outerior"
                      {...unit}
                      id={`${unit.id}`}
                      type="button"
                      floor={1}
                      house={version.house}
                    ></UnitLinkButton>
                  ))}
              </RowSection>
              <p style={{ borderBottom: "solid 1px #ccc", padding: ".25rem" }}>
                住棟
              </p>
              <RowSection>
                {units
                  ?.filter((unit) => unit.type == "residence")
                  .map((unit) => (
                    <UnitLinkButton
                      key={unit.id}
                      unitType="residence"
                      {...unit}
                      id={`${unit.id}`}
                      type="button"
                      floor={1}
                      house={version.house}
                    ></UnitLinkButton>
                  ))}
              </RowSection>
              <p style={{ borderBottom: "solid 1px #ccc", padding: ".25rem" }}>
                ユニット
              </p>
              {[...Array(version.house.floorCount).keys()]
                .map((i) => version.house.floorCount - i)
                .map((i) => (
                  <>
                    <div>{i}階</div>
                    <RowSection key={i}>
                      {units
                        ?.filter(
                          (unit) => unit.type == "room" && unit.floor == i
                        )
                        .map((unit) => (
                          <UnitLinkButton
                            key={unit.id}
                            unitType="room"
                            {...unit}
                            id={`${unit.id}`}
                            type="button"
                            floor={i}
                            index={unit.index}
                            house={version.house}
                          ></UnitLinkButton>
                        ))}
                      {units
                        ?.filter(
                          (unit) => unit.type == "step" && unit.floor == i
                        )
                        .map((unit) => (
                          <UnitLinkButton
                            key={unit.id}
                            unitType="step"
                            {...unit}
                            id={`${unit.id}`}
                            type="button"
                            floor={i}
                            index={unit.index}
                            house={version.house}
                          ></UnitLinkButton>
                        ))}
                    </RowSection>
                  </>
                ))}
            </div>
          </>
        )}
      </section>
    </>
  )
}

export default HouseIdVersionPage
