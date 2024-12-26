"use client"

import { FC } from "react"
import { Button } from "../elements"
import { House, Unit } from "@prisma/client"

export const DownloadCheckListButton: FC<{
  unit: Unit & { house?: House }
}> = ({ unit }) => {
  const handleDownload = async () => {
    if (!unit.checkList) return
    const csv = [
      ["大項目", "中項目", "小項目", "各部位", "部所", "ランク"].join(","),
      ...unit.checkList.map((row) =>
        [
          row.largeCategory,
          row.mediumCategory,
          row.smallCategory,
          row.part,
          row.detail,
          row.rank,
        ].join(",")
      ),
    ].join("\n")
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute(
      "download",
      `${unit.house?.name ?? "不明"} ${unit.name}　チェックリスト.csv`
    )
    link.click()
  }
  return <Button onClick={handleDownload}>ダウンロード</Button>
}
