import { useState, useEffect, useRef } from 'react'
import arrow from './assets/icon-arrow.svg'
import { MapContainer, TileLayer, Marker } from 'react-leaflet'
import L from 'leaflet'
import marker from './assets/icon-location.svg'
import ChangeView from './ChangeView'

function App() {
  const [ipAddress, setIpAddress] = useState("")
  const [location, setLocation] = useState("");
  const [timezone, setTimezone] = useState("")
  const [isp, setIsp] = useState("")
  const [lat, setLat] = useState(0)
  const [long, setLong] = useState(0)
  const inputIpRef = useRef()

  const icon = new L.icon({
    iconUrl: marker,
    iconRetinaUrl: marker,
    popupAnchor: [-0, -0],
    iconSize: [46, 56]
  })

  const fetchClientIpAddress = () => {
    fetch("https://ipapi.co/json/")
      .then((response) => response.json())
      .then((data) => {
        setIpAddress(data.ip)
        inputIpRef.value = data.ip
      })
  }

  const search = (e) => {
    e.preventDefault()
    const inputIp = inputIpRef.current.value
    fetch(`https://geo.ipify.org/api/v2/country,city?apiKey=at_fHcEXJlKvPw5vp6SHEW13xaJFA2md&ipAddress=${inputIp}`)
      .then((response) => response.json())
      .then((data) => {
        setIpAddress(data.ip)
        setLocation(`${data.location.country}, ${data.location.region}`)
        setTimezone(data.location.timezone)
        setIsp(data.isp)
        setLat(data.location.lat)
        setLong(data.location.lng)
      })
      .catch((error) => console.error(error));
  }

  useEffect(() => {
    fetchClientIpAddress()
    fetch(`https://geo.ipify.org/api/v2/country,city?apiKey=at_fHcEXJlKvPw5vp6SHEW13xaJFA2md&ipAddress=${ipAddress}`)
      .then((response) => response.json())
      .then((data) => {
        setLocation(`${data.location.country}, ${data.location.region}`)
        setTimezone(data.location.timezone)
        setIsp(data.isp)
        setLat(data.location.lat)
        setLong(data.location.lng)
      })
      .catch((error) => console.error(error));
  }, []);
  return (
    <>
      <header>
        <h1 className="title">IP Address Tracker</h1>
        <form method="POST" className="ip-search-form" onSubmit={search}>
          <input type="text" placeholder="Search for any IP address or domain" className="ip-search-input" ref={inputIpRef} required />
          <button type="submit" className="ip-search-submit"><img src={arrow} /></button>
        </form>
      </header>
      <main>
        <div className="info-wrapper">
          <div className="info">
            <div className="info-title">IP Address</div>
            <div className="info-text ip">{ipAddress}</div>
          </div>
          <div className="info">
            <div className="info-title">Location</div>
            <div className="info-text location">{location}</div>
          </div>
          <div className="info">
            <div className="info-title">Timezone</div>
            <div className="info-text timezone">UTC {timezone}</div>
          </div>
          <div className="info">
            <div className="info-title">ISP</div>
            <div className="info-text isp">{isp}</div>
          </div>
        </div>
        <div id="map">
          <MapContainer center={{ lat: lat, lng: long, }} zoom={13} scrollWheelZoom={false}>
            <ChangeView center={{ lat: lat, lng: long, }} />
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={{ lat: lat, lng: long, }} icon={icon} />
          </MapContainer>
        </div>
      </main>
    </>
  )
}

export default App
