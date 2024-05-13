"use client"

import { useEffect, useState, type ComponentProps, type FC } from "react"
import { MapContainer, TileLayer } from "react-leaflet"
import { LatLng } from "leaflet"
import "leaflet/dist/leaflet.css"

export const Map: FC<
  ComponentProps<"div"> & { latitude: number; longitude: number }
> = ({ latitude, longitude, style, ...props }) => {
  const [position, setPosition] = useState<LatLng>()
  useEffect(() => {
    if (window) setPosition(new LatLng(latitude, longitude))
  }, [latitude, longitude])
  return (
    <div style={{ height: "100vw", maxHeight: "50vh", ...style }} {...props}>
      {position && (
        <MapContainer
          center={position}
          zoom={15}
          style={{
            height: "100%",
          }}
        >
          <TileLayer
            attribution='&copy; <a href="https://maps.gsi.go.jp/development/ichiran.html">国土地理院</a>'
            url="https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png"
          />
        </MapContainer>
      )}
    </div>
  )
}
