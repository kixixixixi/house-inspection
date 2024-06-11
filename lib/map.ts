import { LatLng } from "leaflet"
import { useMap } from "react-leaflet"

export const ChangeMapCenter = ({ position }: { position: LatLng }) => {
  const map = useMap()
  map.panTo(position)

  return null
}
