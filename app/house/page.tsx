"use client"

import { NextPage } from "next"
import { prisma } from "@/lib/db"
import { HouseList } from "@/components/modules/house-list"
import { House } from "@prisma/client"
import { useEffect, useState } from "react"
import ky from "ky"

const HousePage: NextPage = () => {
  const [houseList, setHouseList] = useState<House[]>([])
  useEffect(() => {
    const fetch = async () => {
      const response = await ky.get(`/api/house`)
      const { houseList } = await response.json<{ houseList: House[] }>()
      setHouseList(houseList)
    }
    fetch()
  }, [])

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
