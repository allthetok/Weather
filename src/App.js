/* eslint-disable no-undef */
import React, { useState } from 'react'
import Geocode from 'react-geocode'
import axios from 'axios'
const App = () => {

  const [city, setCity] = useState('')
  const [degree, setDegree] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()

    Geocode.setApiKey(process.env.REACT_APP_GOOGLE_API_KEY)
    Geocode.setLanguage('en')
    Geocode.fromAddress(city).then(
      (response) => {
        const { lat, lng } = response.results[0].geometry.location
        axios.get(`https://api.tomorrow.io/v4/timelines?location=${lat},${lng}&fields=temperature&timesteps=1h&units=metric&apikey=${process.env.REACT_APP_TOMORROW_API_KEY}`).then((res) => {
          setDegree(res.data.data.timelines[0].intervals[0].values.temperature)
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
                <p>Current Temperature in {city} : {degree} °C</p>
      }

      {degree === '' &&
                <p>Enter a city to get realtime weather data!</p>
      }

    </div>
  )
}

export default App