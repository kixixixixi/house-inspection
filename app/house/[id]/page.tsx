import { NextPage } from "next"
import { prisma } from "@/lib/db"
import { Button } from "@/components/elements"
import type { ComponentProps, FC } from "react"

export const RowSection: FC<ComponentProps<"section">> = ({
  style,
  ...props
}) => (
  <section
    style={{
      display: "flex",
      flexWrap: "wrap",
      gap: ".25rem",
      padding: ".5rem",
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
          padding: "4rem 1rem",
        }}
      >
        <hgroup>
          <h1>{house.name}</h1>
          <p>最終更新: {house.updatedAt.toLocaleString()}</p>
        </hgroup>
        <dl
          style={{
            display: "flex",
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
        </dl>
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
                <Button>{label}</Button>
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
                        <Button>部屋{j}</Button>
                      </div>
                    ))}
                  {[...Array(house.stepCount).keys()]
                    .map((j) => j + 1)
                    .map((j) => (
                      <div key={j}>
                        <Button>階段{j}</Button>
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
