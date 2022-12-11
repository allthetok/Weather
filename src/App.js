/* eslint-disable no-undef */
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import React, { useState } from 'react'
import Geocode from 'react-geocode'
import axios from 'axios'
import { Card } from 'react-bootstrap'

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

  const [inputCity, setInputCity] = useState('')
  const [weather, setWeather] = useState({ degree: '', appdegree: '', condition: '' })
  const [name, setName] = useState('')
  const [time, setTime] = useState()

  Geocode.setApiKey(process.env.REACT_APP_GOOGLE_API_KEY)
  Geocode.setLanguage('en')

  const handleSubmit = (e) => {
    e.preventDefault()
    Geocode.fromAddress(inputCity).then(
      (response) => {
        getWeatherData(response)
      },
      (error) => {
        console.log(error)
      }
    )
  }


  const getWeatherData = async (response) => {
    const { lat, lng } = response.results[0].geometry.location
    await axios.get(`https://api.tomorrow.io/v4/timelines?location=${lat},${lng}&fields=temperature,temperatureApparent,weatherCode&timesteps=1h&units=metric&apikey=${process.env.REACT_APP_TOMORROW_API_KEY}`)
      .then((res) => {
        let newWeather = { ...weather, degree: res.data.data.timelines[0].intervals[0].values.temperature,
          appdegree: res.data.data.timelines[0].intervals[0].values.temperatureApparent,
          condition: res.data.data.timelines[0].intervals[0].values.weatherCode  }
        setWeather(newWeather)
      })
    Geocode.fromLatLng(lat, lng)
      .then((res) => {
        let city, state, country
        for (let i = 0; i < res.results[0].address_components.length; i++) {
          for (let j = 0; j < res.results[0].address_components[i].types.length; j++) {
            switch (res.results[0].address_components[i].types[j]) {
            case 'locality':
              city = res.results[0].address_components[i].long_name
              break
            case 'administrative_area_level_1':
              state = res.results[0].address_components[i].long_name
              break
            case 'country':
              country = res.results[0].address_components[i].long_name
              break
            }
          }
        }
        if (city === undefined) {
          setName(`${state}, ${country}`)
        }
        else {
          setName(`${city}, ${state}, ${country}`)
        }
        getCurrentTime()
      })

  }

  const condNumToString = (code) => {
    return weatherCode[code]
  }

  const getCurrentTime = () => {
    Geocode.fromAddress(inputCity).then((res) => {
      const { lat, lng } = res.results[0].geometry.location
      axios.get(`http://api.timezonedb.com/v2.1/get-time-zone?key=${process.env.REACT_APP_TIMEZONEDB_API_KEY}&format=json&by=position&lat=${lat}&lng=${lng}`)
        .then((res) => {
          console.log(res.data.formatted)
          let timeStamp = new Date(res.data.formatted)
          console.log(timeStamp.getMinutes() + ':' + timeStamp.getSeconds())
          timeStamp.setSeconds(timeStamp.getSeconds() + 1)
          console.log(timeStamp.toLocaleTimeString())
          setTime(timeStamp.toLocaleTimeString())
        })
    })

  }

  const getAssetPath = (code) => {
    return `/color/${code}.svg`
  }

  return (
    <div className='background'>
      <div className='content-wrap'>
        <h2>Weather App</h2>
        <form onSubmit={handleSubmit}>
          <label>
            <input className='search' type="text" placeholder='Enter a city' onChange={(e) => setInputCity(e.target.value)}/>
            <input type="submit" value="Find"/>
          </label>
        </form>

        {weather.degree !== '' &&
      <>
        {/* <p>Current Temperature in {name} : {Math.floor(weather.degree)}°C and {condNumToString(weather.condition)}. It feels like {Math.floor(weather.appdegree)}°C.</p>
        <img src='../assets/small/png/' /> */}
        <Card style={{ width: '30rem', margin: 'auto' }}>
          <img className='weather-code' src={getAssetPath(weather.condition)}/>
          <Card.Body>
            <Card.Title>{name}</Card.Title>
            <Card.Text>
                The current temperature in {name} is {Math.floor(weather.degree)} °C and {condNumToString(weather.condition)}. It feels like {Math.floor(weather.appdegree)}°C.
              {time}
            </Card.Text>
          </Card.Body>
        </Card>
      </>
        }
      </div>

    </div>
  )
}

export default App