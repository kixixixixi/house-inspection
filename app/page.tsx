"use client"

import { LinkButton } from "@/components/elements/link"
import { NextPage } from "next"
import { HouseList } from "@/components/modules/house-list"
import { useEffect, useState } from "react"
import { House } from "@prisma/client"
import ky from "ky"

const Home: NextPage = () => {
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
          <LinkButton href="/house">閲覧・編集</LinkButton>
        </div>
        <div>
          <HouseList list={houseList} />
        </div>
      </section>
    </>
  )
}

export default Home
