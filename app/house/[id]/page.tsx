import { NextPage } from "next"
import { prisma } from "@/lib/db"

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
      </section>
    </>
  )
}

export default HouseIdPage
