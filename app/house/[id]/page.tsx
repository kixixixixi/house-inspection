"use client"

import { NextPage } from "next"
import { useEffect, useState, type ComponentProps, type FC } from "react"
import { HouseDelete } from "@/components/services/house-delete"
import { OuteriorUnits } from "@/lib/constant/unit"
import { UnitLinkButton } from "@/components/modules/unit-link-button"
import { House, Unit } from "@prisma/client"
import ky from "ky"

const RowSection: FC<ComponentProps<"section">> = ({ style, ...props }) => (
  <section
    style={{
      display: "flex",
      flexWrap: "wrap",
      gap: ".25rem",
      padding: ".5rem 0",
      ...style,
    }}
    {...props}
  />
)

const HouseIdPage: NextPage<{ params: { id: string } }> = ({
  params: { id },
}) => {
  const [house, setHouse] = useState<House & { units?: Unit[] }>()
  useEffect(() => {
    const fetch = async () => {
      const response = await ky.get(`/api/house/${id}`)
      const { house } = await response.json<{
        house: House & { units?: Unit[] }
      }>()
      setHouse(house)
    }
    fetch()
  }, [id])
  return (
    <>
      <section
        style={{
          padding: "1rem",
        }}
      >
        {house && (
          <>
            <hgroup style={{ padding: "1rem 0" }}>
              <h1>{house.name}</h1>
            </hgroup>
            <div
              style={{
                alignItems: "flex-end",
                display: "flex",
                flexFlow: "row",
                flexWrap: "wrap",
                gap: "1rem",
                justifyContent: "space-between",
              }}
            >
              <dl
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "1rem",
                }}
              >
                <div>
                  <dt>緯度</dt>
                  <dd>{house.latitude}</dd>
                </div>
                <div>
                  <dt>経度</dt>
                  <dd>{house.longitude}</dd>
                </div>
                <div>
                  <dt>作成日時</dt>
                  <dd>{house.createdAt.toLocaleString()}</dd>
                </div>
                <div>
                  <dt>更新日時</dt>
                  <dd>{house.updatedAt.toLocaleString()}</dd>
                </div>
              </dl>
              <div>
                <HouseDelete houseId={house.id} />
              </div>
            </div>
            <div
              style={{
                display: "flex",
                flexFlow: "column",
                gap: ".25rem",
                padding: "2rem 0",
              }}
            >
              <p style={{ borderBottom: "solid 1px #ccc", padding: ".25rem" }}>
                外形・外構
              </p>
              <RowSection>
                {OuteriorUnits.map((unit) => (
                  <div key={unit.index}>
                    <UnitLinkButton
                      unitType="outerior"
                      {...unit}
                      floor={1}
                      house={house}
                    ></UnitLinkButton>
                  </div>
                ))}
              </RowSection>
              <p style={{ borderBottom: "solid 1px #ccc", padding: ".25rem" }}>
                ユニット
              </p>
              {[...Array(house.floorCount).keys()]
                .map((i) => house.floorCount - i)
                .map((i) => (
                  <>
                    <div>{i}階</div>
                    <RowSection key={i}>
                      {[...Array(house.roomCount).keys()]
                        .map((j) => j + 1)
                        .map((j) => (
                          <div key={j}>
                            <UnitLinkButton
                              unitType="room"
                              index={j}
                              floor={i}
                              house={house}
                            ></UnitLinkButton>
                          </div>
                        ))}
                      {[...Array(house.stepCount).keys()]
                        .map((j) => j + 1)
                        .map((j) => (
                          <div key={j}>
                            <UnitLinkButton
                              unitType="step"
                              index={j}
                              floor={i}
                              house={house}
                            ></UnitLinkButton>
                          </div>
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

export default HouseIdPage
