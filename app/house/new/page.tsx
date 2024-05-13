"use client"

import type { FormEvent } from "react"
import { useState } from "react"
import { Button, Field, Input } from "components/elements"
import { NextPage } from "next"
import { prisma } from "lib/db"
import { Prisma } from "@prisma/client/"
import { Map } from "components/modules/map"

const HouseNewPage: NextPage = () => {
  const [createInput, setCreateInput] = useState<Prisma.HouseCreateInput>({
    latitude: 0,
    longitude: 0,
    name: "",
    floorCount: 1,
    roomCount: 1,
    stepCount: 1,
  })
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    await prisma.house.create({
      data: {
        ...createInput,
      },
    })
  }
  return (
    <>
      <section
        style={{
          margin: "auto",
          maxWidth: "42rem",
          padding: "4rem 1rem",
        }}
      >
        <h2>新規作成</h2>
        <Map latitude={35.68} longitude={139.76} />
        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexFlow: "column",
          }}
        >
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
