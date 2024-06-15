"use client"

import { useEffect, useState, type ComponentProps, type FC } from "react"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import { LatLng, icon } from "leaflet"
import "leaflet/dist/leaflet.css"
import iconImage from "leaflet/dist/images/marker-icon.png"
import { House } from "@prisma/client"
import Link from "next/link"
import { ChangeMapCenter } from "@/lib/map"
import { useSearchParams } from "next/navigation"

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
  const searchParams = useSearchParams()
  useEffect(() => {
    const latitude = searchParams.get("latitude")
    const longitude = searchParams.get("longitude")

    if (latitude && longitude) {
      setPosition(new LatLng(Number(latitude), Number(longitude)))
    } else {
      navigator.geolocation.getCurrentPosition((position) => {
        setPosition(
          new LatLng(position.coords.latitude, position.coords.longitude)
        )
      })
    }
  }, [searchParams])
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
                <p>{marker.floorCount}階建て</p>
              </Popup>
            </Marker>
          ))}
          <ChangeMapCenter position={position} />
        </MapContainer>
      )}
    </div>
  )
}

export default MultiMarkerMap
