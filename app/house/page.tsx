import { Button } from "@/components/elements"
import { LinkButton } from "@/components/elements/link"
import { NextPage } from "next"
import { prisma } from "@/lib/db"
import { HouseList } from "@/components/modules/house-list"

const HousePage: NextPage = async () => {
  const houseList = await prisma.house.findMany({
    orderBy: { createdAt: "desc" },
  })

  return (
    <>
      <section
        style={{
          height: "100%",
          padding: "2rem",
        }}
      >
        <div>
          <HouseList list={houseList} />
        </div>
      </section>
    </>
  )
}

export default HousePage
