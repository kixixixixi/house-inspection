"use client"

import { useState, type ComponentProps, type FC } from "react"

export const Container: FC<ComponentProps<"div">> = ({ style, ...props }) => (
  <div
    style={{ height: "100%", margin: "auto", maxWidth: "64rem", ...style }}
    {...props}
  />
)

export const Button: FC<ComponentProps<"button"> & { selected?: boolean }> = ({
  selected,
  style,
  ...props
}) => {
  const [tintColor, setTintColor] = useState<string>("#277")
  return (
    <button
      style={{
        background: selected ? "transparent" : tintColor,
        border: "solid 2px",
        borderColor: tintColor,
        borderRadius: "2rem",
        color: selected ? tintColor : "#eee",
        cursor: "pointer",
        fontSize: "1rem",
        fontWeight: "bold",
        maxHeight: "2.5rem",
        padding: ".4rem 1.5rem",
        transition: ".2s",
        ...style,
      }}
      onMouseEnter={() => setTintColor("#355")}
      onMouseOut={() => setTintColor("#277")}
      {...props}
    ></button>
  )
}

export const Input: FC<ComponentProps<"input">> = ({ style, ...props }) => (
  <input
    style={{
      border: "solid 1px #277",
      borderRadius: "1rem",
      color: "#333",
      fontSize: "1rem",
      fontWeight: "bold",
      outline: "none",
      padding: ".5rem 1rem",
      ...style,
    }}
    {...props}
  />
)

export const MultiLineInput: FC<ComponentProps<"textarea">> = ({
  style,
  ...props
}) => (
  <textarea
    style={{
      border: "solid 1px #277",
      borderRadius: "1rem",
      color: "#333",
      flexGrow: 1,
      fontSize: "1rem",
      fontWeight: "bold",
      outline: "none",
      padding: ".5rem 1rem",
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
      padding: ".5rem",
      ...style,
    }}
    {...props}
  />
)
