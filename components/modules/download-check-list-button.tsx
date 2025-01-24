"use client"

import { FC } from "react"
import { Button } from "../elements"
import { House, Unit } from "@prisma/client"

export const DownloadCheckListButton: FC<{
  units: Unit[]
  house?: House
}> = ({ units, house }) => {
  const handleDownload = async () => {
    if (units.length == 0) return
    if (!units[0].checkList) return
    const csvHeaders = [
      "ユニット",
      "大項目",
      "中項目",
      "小項目",
      "各部位",
      "部所",
      "ランク",
    ].join(",")
    const csvBody = units
      .map(
        (unit) =>
          unit.checkList &&
          [
            ...unit.checkList.map((row) =>
              [
                unit.name,
                row.largeCategory,
                row.mediumCategory,
                row.smallCategory,
                row.part,
                row.detail,
                row.rank,
              ].join(",")
            ),
          ].join("\n")
      )
      .filter((row) => !!row)
      .join("\n")
    const csv = [csvHeaders, csvBody].join("\n")
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute(
      "download",
      `${house?.name ?? "不明"} ${
        units.length == 1 ? units[0].name : "全体"
      } チェックリスト.csv`
    )
    link.click()
  }
  return <Button onClick={handleDownload}>ダウンロード</Button>
}
