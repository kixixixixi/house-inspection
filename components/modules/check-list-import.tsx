import { FC, useState } from "react"
import { CsvImportInput } from "../forms/csv-import-input"
import { generateIdFromCheck } from "@/lib/text"
import { Dialog } from "../elements/dialog"
import { Button } from "../elements"

export const CheckListImport: FC<{
  onSubmit: (data: PrismaJson.CheckTemplateList) => void
}> = ({ onSubmit }) => {
  const [template, setTemplate] = useState<PrismaJson.CheckTemplateList>()
  const onImport = (data: { [key: string]: string }[]) => {
    setTemplate(
      data
        .map((row) => ({
          largeCategory: row["大項目"],
          mediumCategory: row["中項目"],
          smallCategory: row["小項目"],
          part: row["各部位"],
          detail: row["部所"],
        }))
        .map((row) => ({
          ...row,
          id: generateIdFromCheck(row),
        }))
    )
  }
  return (
    <>
      <CsvImportInput onImport={onImport}>リスト取込</CsvImportInput>
      {template && (
        <>
          <Dialog open={true}>
            <div>
              <h2>チェックリスト取込確認</h2>
              <div
                style={{
                  display: "flex",
                  gap: ".5rem",
                  padding: ".5rem 0",
                }}
              >
                <Button
                  onClick={async () => {
                    await onSubmit(template)

                    setTemplate(undefined)
                  }}
                >
                  取込
                </Button>
                <Button onClick={() => setTemplate(undefined)}>
                  キャンセル
                </Button>
              </div>
              <table>
                <thead>
                  <tr>
                    <td>大項目</td>
                    <td>中項目</td>
                    <td>小項目</td>
                    <td>各部位</td>
                    <td>部所</td>
                  </tr>
                </thead>
                <tbody>
                  {template.map((row) => (
                    <tr key={row.id}>
                      <td>{row.largeCategory}</td>
                      <td>{row.mediumCategory}</td>
                      <td>{row.smallCategory}</td>
                      <td>{row.part}</td>
                      <td>{row.detail}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Dialog>
        </>
      )}
    </>
  )
}
