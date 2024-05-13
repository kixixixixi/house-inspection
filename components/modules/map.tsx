"use client"

import { useEffect, useState, type ComponentProps, type FC } from "react"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import { LatLng, icon } from "leaflet"
import "leaflet/dist/leaflet.css"
import iconImage from "leaflet/dist/images/marker-icon.png"

export const Map: FC<
  ComponentProps<"div"> & {
    latitude: number
    longitude: number
    name?: string
    onChangePosition: (position: LatLng) => void
  }
> = ({ latitude, longitude, name, onChangePosition, style, ...props }) => {
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
          <Marker
            position={position}
            icon={icon({
              iconUrl: iconImage.src,
            })}
            draggable={true}
            eventHandlers={{
              dragend: (event) => {
                const newPosition = event.target.getLatLng()
                setPosition(newPosition)
                onChangePosition(newPosition)
              },
            }}
          >
            <Popup>{name ?? "物件の位置"}</Popup>
          </Marker>
        </MapContainer>
      )}
    </div>
  )
}
