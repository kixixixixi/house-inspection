"use client"

import type { FormEvent } from "react"
import { useEffect, useState } from "react"
import { Button, Field, Input } from "components/elements"
import type { NextPage } from "next"
import { House, Prisma } from "@prisma/client/"
import dynamic from "next/dynamic"
import { useRouter } from "next/navigation"
import { searchAddress } from "@/lib/request"
import { api } from "@/lib/api"
const Map = dynamic(() => import("components/modules/map"), {
  ssr: false,
})

const HouseNewPage: NextPage = () => {
  const router = useRouter()
  const [createInput, setCreateInput] = useState<Prisma.HouseCreateInput>({
    latitude: 35.68,
    longitude: 139.76,
    name: "",
    floorCount: 1,
    roomCount: 1,
    stepCount: 1,
  })
  const [addressText, setAddressText] = useState<string>("")
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const { house } = await (await api())
      .post("/api/house", { json: { ...createInput } })
      .json<{ house: House }>()
    router.push(`/house/${house.id}`)
  }
  const handleSearch = async () => {
    const candidate = await searchAddress({ address: addressText })
    if (candidate) {
      setCreateInput({
        ...createInput,
        latitude: candidate.y,
        longitude: candidate.x,
      })
    }
  }
  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setCreateInput({
        ...createInput,
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      })
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <>
      <section
        style={{
          margin: "auto",
          maxWidth: "64rem",
          padding: "2rem 1rem",
        }}
      >
        <h2>新規作成</h2>
        <Map
          latitude={createInput.latitude}
          longitude={createInput.longitude}
          name={createInput.name.length > 0 ? createInput.name : undefined}
          onChangePosition={(position) =>
            setCreateInput({
              ...createInput,
              latitude: position.lat,
              longitude: position.lng,
            })
          }
        />
        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexFlow: "column",
          }}
        >
          <Field>
            <label>住所から探す</label>
            <div
              style={{
                display: "flex",
                gap: ".5rem",
                justifyContent: "space-between",
              }}
            >
              <Input
                value={addressText}
                onChange={({ target: { value } }) => setAddressText(value)}
                style={{ flexGrow: 2 }}
              />
              <Button
                type="button"
                disabled={addressText.length < 2}
                onClick={handleSearch}
              >
                探す
              </Button>
            </div>
          </Field>
          <Field>
            <label>緯度/経度</label>
            <div
              style={{
                display: "flex",
                gap: ".5rem",
                justifyContent: "space-between",
              }}
            >
              <Input
                readOnly
                value={createInput.latitude}
                style={{ width: "48%" }}
              />
              <Input
                readOnly
                value={createInput.longitude}
                style={{ width: "48%" }}
              />
            </div>
          </Field>
          <Field>
            <label>物件名</label>
            <Input
              required
              value={createInput.name}
              onChange={({ target: { value } }) =>
                setCreateInput({ ...createInput, name: value })
              }
            />
          </Field>
          <Field>
            <label>階数</label>
            <Input
              type="number"
              value={createInput.floorCount}
              onChange={({ target: { value } }) =>
                setCreateInput({ ...createInput, floorCount: parseInt(value) })
              }
            />
          </Field>
          <Field>
            <label>部屋数</label>
            <Input
              type="number"
              value={createInput.roomCount}
              onChange={({ target: { value } }) =>
                setCreateInput({ ...createInput, roomCount: parseInt(value) })
              }
            />
          </Field>
          <Field>
            <label>階段数</label>
            <Input
              type="number"
              value={createInput.stepCount}
              onChange={({ target: { value } }) =>
                setCreateInput({ ...createInput, stepCount: parseInt(value) })
              }
            />
          </Field>
          <Field>
            <Button>作成</Button>
          </Field>
        </form>
      </section>
    </>
  )
}

export default HouseNewPage
