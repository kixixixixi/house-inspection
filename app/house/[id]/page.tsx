import { NextPage } from "next"
import { prisma } from "@/lib/db"
import { Button } from "@/components/elements"

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
          }}
        >
          {[...Array(house.floorCount).keys()]
            .map((i) => house.floorCount - i)
            .map((i) => (
              <div
                key={i}
                style={{ display: "flex", gap: ".25rem", padding: ".5rem" }}
              >
                <div>{i}階</div>
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
              </div>
            ))}
        </div>
      </section>
    </>
  )
}

export default HouseIdPage
