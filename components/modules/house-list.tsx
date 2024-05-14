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
        <tbody>
          {list.map((house) => (
            <tr key={house.id}>
              <th
                style={{
                  padding: "1rem",
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
