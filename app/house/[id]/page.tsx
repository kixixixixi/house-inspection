import { NextPage } from "next"
import { prisma } from "@/lib/db"
import { Button } from "@/components/elements"
import { type ComponentProps, type FC } from "react"
import { HouseDelete } from "@/components/services/house-delete"
import { LinkButton } from "@/components/elements/link"

export const RowSection: FC<ComponentProps<"section">> = ({
  style,
  ...props
}) => (
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

const HouseIdPage: NextPage<{ params: { id: string } }> = async ({
  params: { id },
}) => {
  const house = await prisma.house.findUniqueOrThrow({
    where: { id: parseInt(id) },
  })
  return (
    <>
      <section
        style={{
          padding: "1rem",
        }}
      >
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
            {[
              "屋根",
              "外壁南面",
              "外壁北面",
              "東妻面",
              "西妻面",
              "塗装・設備・外構",
            ].map((label, i) => (
              <div key={i}>
                <LinkButton
                  href={`/house/${house.id}/unit/new?type=outerior&index=${
                    i + 1
                  }`}
                >
                  {label}
                </LinkButton>
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
                        <LinkButton
                          href={`/house/${house.id}/unit/new?type=room&floor=${i}&index=${j}`}
                        >
                          部屋{j}
                        </LinkButton>
                      </div>
                    ))}
                  {[...Array(house.stepCount).keys()]
                    .map((j) => j + 1)
                    .map((j) => (
                      <div key={j}>
                        <LinkButton
                          href={`/house/${house.id}/unit/new?type=step&floor=${i}&index=${j}`}
                        >
                          階段{j}
                        </LinkButton>
                      </div>
                    ))}
                </RowSection>
              </>
            ))}
        </div>
      </section>
    </>
  )
}

export default HouseIdPage
