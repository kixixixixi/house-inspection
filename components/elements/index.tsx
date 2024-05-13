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

export const Input: FC<ComponentProps<"input">> = ({ style, ...props }) => (
  <input
    style={{
      border: "solid 1px #277",
      borderRadius: "1rem",
      color: "#333",
      fontSize: "1rem",
      fontWeight: "bold",
      outline: "none",
      padding: ".5rem 1.5rem",
      ...style,
    }}
    {...props}
  />
)

export const Field: FC<ComponentProps<"fieldset">> = ({ style, ...props }) => (
  <fieldset
    style={{
      border: "none",
      display: "flex",
      flexFlow: "column",
      padding: ".5rem 1.5rem",
      ...style,
    }}
    {...props}
  />
)
