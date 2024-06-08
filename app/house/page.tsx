"use client"

import { NextPage } from "next"
import { prisma } from "@/lib/db"
import { HouseList } from "@/components/modules/house-list"
import { House } from "@prisma/client"
import { useEffect, useState } from "react"
import ky from "ky"
import MultiMarkerMap from "@/components/modules/multi-maker-map"

const HousePage: NextPage = () => {
  const [houseList, setHouseList] = useState<House[]>([])
  const [initialPosition, setInitialPosition] = useState<{
    latitude: number
    longitude: number
  }>({
    latitude: 35.68,
    longitude: 139.76,
  })
  useEffect(() => {
    const fetch = async () => {
      const response = await ky.get(`/api/house`)
      const { houseList } = await response.json<{ houseList: House[] }>()
      setHouseList(houseList)
    }
    fetch()
    navigator.geolocation.getCurrentPosition((position) => {
      setInitialPosition({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      })
    })
  }, [])

  return (
    <>
      <section
        style={{
          height: "100%",
          padding: "2rem",
        }}
      >
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
