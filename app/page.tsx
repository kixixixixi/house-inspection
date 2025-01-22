"use client"

import { LinkButton } from "@/components/elements/link"
import { NextPage } from "next"
import { HouseList } from "@/components/modules/house-list"
import { useEffect, useState } from "react"
import { House, Team, User } from "@prisma/client"
import { Button } from "@/components/elements"
import { defaultCheckList } from "@/lib/constant/check-list"
import { api } from "@/lib/api"
import { CheckListImport } from "@/components/modules/check-list-import"

const Home: NextPage = () => {
  const [houseList, setHouseList] = useState<House[]>([])
  const [me, setMe] = useState<User & { team?: Team }>()
  useEffect(() => {
    const fetch = async () => {
      const request = await api()
      const meResponse = await request.get(`/api/user`)
      const { user } = await meResponse.json<{ user: User & { team?: Team } }>()
      setMe(user)

      const houseResponse = await request.get(`/api/house`)
      const { houseList } = await houseResponse.json<{ houseList: House[] }>()
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
          padding: "4rem 1rem",
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
            gap: ".5rem",
            justifyContent: "space-evenly",
            maxWidth: "30rem",
            width: "100%",
          }}
        >
          <dl>
            <dt>組織名</dt>
            <dd>{me?.team?.name}</dd>
          </dl>
          <dl>
            <dt>アカウントメールアドレス</dt>
            <dd>{me?.email}</dd>
          </dl>
        </div>
        <div
          style={{
            display: "flex",
            gap: "1rem",
            padding: "1rem",
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
            padding: "1rem",
          }}
        >
          <Button onClick={downloadCheckList}>リスト出力</Button>
          <CheckListImport onSubmit={() => {}} />
        </div>
      </section>
    </>
  )
}

export default Home
