/* eslint-disable no-undef */
import React, { useState } from 'react'
import Geocode from 'react-geocode'
import axios from 'axios'

const weatherCode = {
  '0': 'Unknown',
  '1000': 'Clear, Sunny',
  '1100': 'Mostly Clear',
  '1101': 'Partly Cloudy',
  '1102': 'Mostly Cloudy',
  '1001': 'Cloudy',
  '2000': 'Fog',
  '2100': 'Light Fog',
  '4000': 'Drizzle',
  '4001': 'Rain',
  '4200': 'Light Rain',
  '4201': 'Heavy Rain',
  '5000': 'Snow',
  '5001': 'Flurries',
  '5100': 'Light Snow',
  '5101': 'Heavy Snow',
  '6000': 'Freezing Drizzle',
  '6001': 'Freezing Rain',
  '6200': 'Light Freezing Rain',
  '6201': 'Heavy Freezing Rain',
  '7000': 'Ice Pellets',
  '7101': 'Heavy Ice Pellets',
  '7102': 'Light Ice Pellets',
  '8000': 'Thunderstorm'
}
const App = () => {

  const [city, setCity] = useState('')
  const [degree, setDegree] = useState('')
  const [condition, setCondition] = useState()

  const handleSubmit = (e) => {
    e.preventDefault()

    Geocode.setApiKey(process.env.REACT_APP_GOOGLE_API_KEY)
    Geocode.setLanguage('en')
    Geocode.fromAddress(city).then(
      (response) => {
        const { lat, lng } = response.results[0].geometry.location
        axios.get(`https://api.tomorrow.io/v4/timelines?location=${lat},${lng}&fields=temperature,weatherCode&timesteps=1h&units=metric&apikey=${process.env.REACT_APP_TOMORROW_API_KEY}`).then((res) => {
          setDegree(res.data.data.timelines[0].intervals[0].values.temperature)
          setCondition(weatherCode[res.data.data.timelines[0].intervals[0].values.weatherCode])
          console.log(condition)
        })
      },
      (error) => {
        console.error(error)
      }
    )

  }

  return (
    <div>
      <h2>Weather App</h2>
      <form onSubmit={handleSubmit}>
        <label>
                    City:
          <input type="text" onChange={(e) => setCity(e.target.value)}/>
          <input type="submit" value="Submit" />
        </label>
      </form>

      {degree !== '' &&
                <p>Current Temperature in {city} : {degree} °C and {condition}</p>
      }

      {degree === '' &&
                <p>Enter a city to get realtime weather data!</p>
      }

    </div>
  )
}

export default App