"use client"

import { NextPage } from "next"
import { HouseList } from "@/components/modules/house-list"
import { House } from "@prisma/client"
import { FormEvent, useEffect, useState } from "react"
import ky from "ky"
import dynamic from "next/dynamic"
import { Button, Input } from "@/components/elements"
import { searchAddress } from "@/lib/request"

const MultiMarkerMap = dynamic(
  () => import("components/modules/multi-maker-map"),
  {
    ssr: false,
  }
)

const HousePage: NextPage = () => {
  const [houseList, setHouseList] = useState<House[]>([])
  const [initialPosition, setInitialPosition] = useState<{
    latitude: number
    longitude: number
  }>({
    latitude: 35.68,
    longitude: 139.76,
  })
  const [address, setAddress] = useState<string>("")
  useEffect(() => {
    const fetch = async () => {
      const response = await ky.get(`/api/house`)
      const { houseList } = await response.json<{ houseList: House[] }>()
      setHouseList(houseList)
    }
    fetch()
  }, [])

  const handleSearch = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const candidate = await searchAddress({ address })
    if (candidate) {
      setInitialPosition({
        latitude: candidate.y,
        longitude: candidate.x,
      })
    }
  }

  return (
    <>
      <section
        style={{
          height: "100%",
          padding: "2rem",
        }}
      >
        <form
          style={{
            display: "flex",
            gap: ".5rem",
            justifyContent: "space-between",
            padding: ".5rem",
          }}
          onSubmit={handleSearch}
        >
          <Input
            value={address}
            onChange={({ target: { value } }) => setAddress(value)}
            style={{ flexGrow: 2 }}
            placeholder="住所で探す"
          />
          <Button disabled={address.length < 2}>探す</Button>
        </form>
        <MultiMarkerMap
          latitude={initialPosition.latitude}
          longitude={initialPosition.longitude}
          markers={houseList}
        />
        <div
          style={{
            padding: "2rem 0",
          }}
        >
          <HouseList list={houseList} />
        </div>
      </section>
    </>
  )
}

export default HousePage
