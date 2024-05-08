import type { ComponentProps, FC } from "react"

export const Button: FC<ComponentProps<"button">> = ({ style, ...props }) => (
  <button
    style={{
      background: "#277",
      border: "none",
      borderRadius: "1rem",
      color: "#eee",
      fontSize: "1rem",
      fontWeight: "bold",
      padding: ".5rem 1.5rem",
      ...style,
    }}
    {...props}
  ></button>
)
