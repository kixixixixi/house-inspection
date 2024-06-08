"use client"

import { useEffect, useState, type ComponentProps, type FC } from "react"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import { LatLng, icon } from "leaflet"
import "leaflet/dist/leaflet.css"
import iconImage from "leaflet/dist/images/marker-icon.png"
import { House } from "@prisma/client"
import Link from "next/link"

const MultiMarkerMap: FC<
  ComponentProps<"div"> & {
    latitude: number
    longitude: number
    markers: House[]
  }
> = ({ latitude, longitude, markers, style, ...props }) => {
  const [position, setPosition] = useState<LatLng>()
  useEffect(() => {
    if (window) {
      const newPosition = new LatLng(latitude, longitude)
      setPosition(newPosition)
    }
  }, [latitude, longitude])
  return (
    <div style={{ height: "100vw", maxHeight: "80vh", ...style }} {...props}>
      {position && (
        <MapContainer
          center={position}
          zoom={14}
          style={{
            height: "100%",
          }}
        >
          <TileLayer
            attribution='&copy; <a href="https://maps.gsi.go.jp/development/ichiran.html">国土地理院</a>'
            url="https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png"
          />
          {markers.map((marker, key) => (
            <Marker
              key={key}
              position={new LatLng(marker.latitude, marker.longitude)}
              icon={icon({
                iconUrl: iconImage.src,
              })}
            >
              <Popup>
                <Link href={`/house/${marker.id}`}>{marker.name}</Link>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      )}
    </div>
  )
}

export default MultiMarkerMap
