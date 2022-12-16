/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import React, { useEffect, useState } from 'react'
import Geocode from 'react-geocode'
import axios from 'axios'
import suncalc from 'suncalc'
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

const Timer = ({ startingTime }) => {
  const timestamp = startingTime.timestamp
  const dst = startingTime.dst
  const [format, setFormat] = useState('')
  const [clock, setClock] = useState((timestamp - dst * 3600) * 1000)

  useEffect(() => {
    setTimeout(() => {
      const date = new Date(clock)
      setFormat(getFormattedTime(date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds()))
      setClock(clock + 1000)
    }, 1000)
  },[clock])

  const getFormattedTime = (hours, min, sec) => {
    if (min < 10) {
      min = `0${min}`
    }
    if (sec < 10) {
      sec = `0${sec}`
    }
    if (hours >= 12) {
      return `${hours - 12}:${min}:${sec} PM`
    }
    return `${hours}:${min}:${sec} AM`
  }
  return (
    <div className='time'>
      {format}
    </div>
  )
}
const App = () => {

  const [inputCity, setInputCity] = useState('')
  const [weather, setWeather] = useState({ degree: '', appdegree: '', condition: '', sunrise: '', sunset: '' })
  const [name, setName] = useState('')
  const [time, setTime] = useState('')
  const [showDet, setShowDet] = useState()

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
          condition: res.data.data.timelines[0].intervals[0].values.weatherCode,
          sunrise: getDuskAndDawn(lat, lng, 'sunrise'),
          sunset: getDuskAndDawn(lat, lng, 'sunset') }
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

  const getCurrentTime = async () => {

    Geocode.fromAddress(inputCity).then((res) => {
      const { lat, lng } = res.results[0].geometry.location
      axios.get(`http://api.timezonedb.com/v2.1/get-time-zone?key=${process.env.REACT_APP_TIMEZONEDB_API_KEY}&format=json&by=position&lat=${lat}&lng=${lng}`)
        .then((res) => {
          setTime({
            timestamp: parseInt(res.data.timestamp),
            gmtOffset: parseInt(res.data.gmtOffset),
            dst: parseInt(res.data.dst)
          })
        })
    })
  }

  const getAssetPath = (code) => `/color/${code}.svg`

  const getDuskAndDawn = (lat, lng, pref) => {
    const suncalcObj = suncalc.getTimes(new Date(), lat, lng)
    if (pref === 'sunrise') {
      if (suncalcObj.sunrise.getHours() < 12) {
        return `${suncalcObj.sunrise.getHours()}:${suncalcObj.sunrise.getMinutes()<10?'0':''}${suncalcObj.sunrise.getMinutes()} AM`
      }
      else if (suncalcObj.sunrise.getHours() === 0) {
        return `12:${suncalcObj.sunrise.getMinutes()<10?'0':''}${suncalcObj.sunrise.getMinutes()} AM`
      }
      else if (suncalcObj.sunrise.getHours() === 12) {
        return `${suncalcObj.sunrise.getHours()}:${suncalcObj.sunrise.getMinutes()<10?'0':''}${suncalcObj.sunrise.getMinutes()} PM`
      }
      else {
        return `${suncalcObj.sunrise.getHours() - 12 }:${suncalcObj.sunrise.getMinutes()<10?'0':''}${suncalcObj.sunrise.getMinutes()} PM`
      }
    }
    if (suncalcObj.sunset.getHours() < 12) {
      return `${suncalcObj.sunset.getHours()}:${suncalcObj.sunset.getMinutes()<10?'0':''}${suncalcObj.sunset.getMinutes()} AM`
    }
    else if (suncalcObj.sunset.getHours() === 0) {
      return `12:${suncalcObj.sunset.getMinutes()<10?'0':''}${suncalcObj.sunset.getMinutes()} AM`
    }
    else if (suncalcObj.sunset.getHours() === 12) {
      return `${suncalcObj.sunset.getHours()}:${suncalcObj.sunset.getMinutes()<10?'0':''}${suncalcObj.sunset.getMinutes()} PM`
    }
    else {
      return `${suncalcObj.sunset.getHours() - 12 }:${suncalcObj.sunset.getMinutes()<10?'0':''}${suncalcObj.sunset.getMinutes()} PM`
    }
  }

  return (
    <div className='background'>
      <div className='content-wrap'>
        <h2>Weatherify</h2>
        <form onSubmit={handleSubmit}>
          <label>
            <input className='search' type="text" placeholder='Enter a city' onChange={(e) => setInputCity(e.target.value)}/>
            <input type="submit" value="Find"/>
          </label>
        </form>

        {weather.degree !== '' &&
      <>
        <Card style={{ width: '30rem', margin: 'auto', display: 'block' }}>
          <p className='inline degree'>{Math.floor(weather.degree)}°C</p>
          <img className='inline weather-code' src={getAssetPath(weather.condition)}/>
          <Card.Body>
            <Card.Title style={{ paddingBottom: '15px' }}>{name}</Card.Title>
            <button className='moreinfo' onClick={() => setShowDet(!showDet)}>More Info</button>
            {showDet &&
            <>
              <Card.Text className='moreinfotxt'>
                It is currently {condNumToString(weather.condition)} in {name.substr(0, name.indexOf(','))} and feels like {Math.floor(weather.appdegree)}°C.
              </Card.Text>
              <div>
                <div className='inline box sunrise'>
                  <img className='suntimes' src={getAssetPath('1000')} /> {weather.sunrise}
                </div>
                <div className='inline box2'>
                  <img className='suntimes' src={getAssetPath('clear night')} /> {weather.sunset}
                </div>
              </div>
              <Timer startingTime={time}/>
            </>
            }
          </Card.Body>
        </Card>
      </>
        }
      </div>

    </div>
  )
}

export default App