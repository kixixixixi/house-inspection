import { Button } from "@/components/elements"
import { LinkButton } from "@/components/elements/link"
import { NextPage } from "next"
import { prisma } from "@/lib/db"
import { HouseList } from "@/components/modules/house-list"

const Home: NextPage = async () => {
  const houseList = await prisma.house.findMany({
    take: 3,
    orderBy: { createdAt: "desc" },
  })

  return (
    <>
      <section
        style={{
          alignItems: "center",
          display: "flex",
          flexFlow: "column",
          height: "100%",
          justifyContent: "space-evenly",
          padding: "4rem 2rem",
        }}
      >
        <h1
          style={{
            padding: "2rem 0",
          }}
        >
          公共住宅点検アプリ
        </h1>
        <div
          style={{
            display: "flex",
            gap: "1rem",
          }}
        >
          <LinkButton href="/house/new">新規作成</LinkButton>
          <Button>閲覧・編集</Button>
        </div>
        <div>
          <HouseList list={houseList} />
        </div>
      </section>
    </>
  )
}

export default Home
