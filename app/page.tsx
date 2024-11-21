"use client"

import { LinkButton } from "@/components/elements/link"
import { NextPage } from "next"
import { HouseList } from "@/components/modules/house-list"
import { useEffect, useState } from "react"
import { House } from "@prisma/client"
import ky from "ky"
import { Button } from "@/components/elements"
import { defaultCheckList } from "@/lib/constant/check-list"

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

  const downloadCheckList = () => {
    const csv = [
      ["大項目,中項目,小項目,各部位,部所"].join(","),
      ...defaultCheckList.map((row) =>
        [
          row.largeCategory,
          row.mediumCategory,
          row.smallCategory,
          row.part,
          row.detail,
        ].join(",")
      ),
    ].join("\n")
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", "チェックリスト.csv")
    link.click()
  }

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
        <div
          style={{
            display: "flex",
            gap: "1rem",
          }}
        >
          <Button onClick={downloadCheckList}>チェックリスト出力</Button>
        </div>
      </section>
    </>
  )
}

export default Home
