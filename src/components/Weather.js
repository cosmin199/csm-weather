//import "./App.css"
import { TextField } from "@material-ui/core"
import { Autocomplete } from "@material-ui/lab"
import { useState, useEffect } from "react"

function Weather() {
  const location = require("../city.list.min.json")
  const [cities, setCities] = useState([])
  const [city, setCity] = useState()
  const [weather, setWeather] = useState({})

  useEffect(() => {
    location.map((loc) => {
      loc.description = `${loc.name.toUpperCase()}${
        loc.state ? `, ${loc.state}` : ""
      }, ${loc.country}`
      return loc
    })
  }, [])

  useEffect(() => {
    if (city) {
      fetch(
        `https://api.openweathermap.org/data/2.5/weather?id=${city.id}&units=metric&appid=${process.env.REACT_APP_API_kEY}`
      )
        .then((response) => response.json())
        .then((result) => {
          setWeather({
            temperature: result.main.temp,
            description: result.weather[0].description,
            icon: result.weather[0].icon,
          })
        })
        .catch((err) => console.log("Error: ", err))
    }
  }, [city])

  return (
    <div className="App">
      <h2 className="search headerApp">how's the weather in your city...</h2>

      <Autocomplete
        freeSolo
        className="search"
        options={cities}
        onSelect={(e) => {
          const value = e.target.value.toUpperCase()
          if (value.length >= 3) {
            const possibleLoc = location
              .filter((loc) => loc.description.includes(value))
              .slice(0, 10)
            setCities(possibleLoc.map((loc) => loc.description))
          }
          const selected = location.find((loc) => loc.description === value)
          setCity(selected)
        }}
        sx={{ width: 300 }}
        renderInput={(params) => <TextField {...params} placeholder="city" />}
      />
      <div hidden={!weather.temperature}>
        <div
          className="temperature"
          style={{ color: weather.temperature <= 0 ? "purple" : "orangered" }}
        >
          {weather.temperature}
          <span>&#176;C</span>
        </div>
        <hr />
        <div className="description">
          {weather.description}
          <img
            alt="weather icon"
            src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
          />
        </div>
      </div>
    </div>
  )
}

export default Weather
