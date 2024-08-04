"use client"

import { NextPage } from "next"
import { useEffect, useState, type ComponentProps, type FC } from "react"
import { HouseDelete } from "@/components/services/house-delete"
import { OuteriorUnits, ResidenceUnits } from "@/lib/constant/unit"
import { UnitLinkButton } from "@/components/modules/unit-link-button"
import { House, Unit, Version } from "@prisma/client"
import ky from "ky"
import { LinkButton } from "@/components/elements/link"
import Link from "next/link"

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

const HouseIdPage: NextPage<{ params: { id: string } }> = ({
  params: { id },
}) => {
  const [house, setHouse] = useState<
    House & { units?: Unit[]; versions?: Version[] }
  >()
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
                <dt>標高</dt>
                <dd>{house.altitude}m</dd>
              </div>
              <div>
                <dt>作成日時</dt>
                <dd>{new Date(house.createdAt.toString()).toLocaleString()}</dd>
              </div>
              <div>
                <dt>更新日時</dt>
                <dd>{new Date(house.updatedAt.toString()).toLocaleString()}</dd>
              </div>
              <div>
                <dt>UID</dt>
                <dd>{house.uid}</dd>
              </div>
            </dl>
            <div
              style={{
                alignItems: "flex-end",
                display: "flex",
                flexFlow: "row",
                flexWrap: "wrap",
                gap: "1rem",
                justifyContent: "space-between",
                padding: "1rem 0",
              }}
            >
              <div>
                <LinkButton
                  href={`/house?latitude=${house.latitude}&longitude=${house.longitude}`}
                >
                  地図を見る
                </LinkButton>
              </div>
              <div>
                <HouseDelete houseId={house.id} />
              </div>
            </div>
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
                {OuteriorUnits.map((unit) => (
                  <UnitLinkButton
                    key={unit.index}
                    unitType="outerior"
                    {...unit}
                    floor={1}
                    house={house}
                  ></UnitLinkButton>
                ))}
              </RowSection>
              <p style={{ borderBottom: "solid 1px #ccc", padding: ".25rem" }}>
                住棟
              </p>
              <RowSection>
                {ResidenceUnits.map((unit) => (
                  <UnitLinkButton
                    key={unit.index}
                    unitType="residence"
                    {...unit}
                    floor={1}
                    house={house}
                  ></UnitLinkButton>
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
                          <UnitLinkButton
                            key={j}
                            unitType="room"
                            index={j}
                            floor={i}
                            house={house}
                          ></UnitLinkButton>
                        ))}
                      {[...Array(house.stepCount).keys()]
                        .map((j) => j + 1)
                        .map((j) => (
                          <UnitLinkButton
                            key={j}
                            unitType="step"
                            index={j}
                            floor={i}
                            house={house}
                          ></UnitLinkButton>
                        ))}
                    </RowSection>
                  </>
                ))}
            </div>
            {house.versions && (
              <div>
                <p>変更履歴</p>
                {house.versions.map((version) => (
                  <Link
                    key={version.id}
                    href={`/house/${house.id}/version/${version.id}`}
                    style={{ display: "block" }}
                  >
                    {new Date(version.createdAt).toLocaleDateString()}&nbsp;
                    {new Date(version.createdAt).toLocaleTimeString()}: &nbsp;
                    {version.text}:{version.reason}({version.code})
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </section>
    </>
  )
}

export default HouseIdPage
