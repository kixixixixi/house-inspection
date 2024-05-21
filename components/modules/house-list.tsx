import { type ComponentProps, type FC } from "react"
import Link from "next/link"
import { House } from "prisma/prisma-client"

export const HouseList: FC<ComponentProps<"div"> & { list: House[] }> = ({
  list,
  ...props
}) => {
  return (
    <div {...props}>
      <table style={{ width: "100%" }}>
        <thead>
          <tr>
            <td>名称</td>
            <td>作成日時/更新日時</td>
          </tr>
        </thead>
        <tbody>
          {list.map((house, i) => (
            <tr
              key={house.id}
              style={{ background: i % 2 == 0 ? "#ececec" : "#e6e6e6" }}
            >
              <th
                style={{
                  padding: ".25rem",
                }}
              >
                <Link href={`/house/${house.id}`}>{house.name}</Link>
              </th>
              <td>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: ".25rem",
                    padding: ".25rem",
                  }}
                >
                  <p>{house.updatedAt.toLocaleString()}</p>
                  <p>{house.createdAt.toLocaleString()}</p>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
