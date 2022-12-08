/* eslint-disable no-undef */
//import './App.css'
import React, { useState } from 'react'
import Geocode from 'react-geocode'
import axios from 'axios'
import Card from 'react-bootstrap/Card'
import 'bootstrap/dist/css/bootstrap.min.css'
import Sunny from './assets/sunny-sky.png'
import Background from './assets/background-image.jpg'


const weatherCode = {
  '0': 'Unknown',
  '1000': 'Clear, Sunny',
  '1100': 'Mostly Clear',
  '1101': 'Partly Cloudy',
  '1102': 'Mostly Cloudy',
  '1001': 'Cloudy',
  '1103': 'Partly Cloudy and Mostly Clear',
  '2100': 'Light Fog',
  '2101': 'Mostly Clear and Light Fog',
  '2102': 'Partly Cloudy and Light Fog',
  '2103': 'Mostly Cloudy and Light Fog',
  '2106': 'Mostly Clear and Fog',
  '2107': 'Partly Cloudy and Fog',
  '2108': 'Mostly Cloudy and Fog',
  '2000': 'Fog',
  '4204': 'Partly Cloudy and Drizzle',
  '4203': 'Mostly Clear and Drizzle',
  '4205': 'Mostly Cloudy and Drizzle',
  '4000': 'Drizzle',
  '4200': 'Light Rain',
  '4213': 'Mostly Clear and Light Rain',
  '4214': 'Partly Cloudy and Light Rain',
  '4215': 'Mostly Cloudy and Light Rain',
  '4209': 'Mostly Clear and Rain',
  '4208': 'Partly Cloudy and Rain',
  '4210': 'Mostly Cloudy and Rain',
  '4001': 'Rain',
  '4211': 'Mostly Clear and Heavy Rain',
  '4202': 'Partly Cloudy and Heavy Rain',
  '4212': 'Mostly Cloudy and Heavy Rain',
  '4201': 'Heavy Rain',
  '5115': 'Mostly Clear and Flurries',
  '5116': 'Partly Cloudy and Flurries',
  '5117': 'Mostly Cloudy and Flurries',
  '5001': 'Flurries',
  '5100': 'Light Snow',
  '5102': 'Mostly Clear and Light Snow',
  '5103': 'Partly Cloudy and Light Snow',
  '5104': 'Mostly Cloudy and Light Snow',
  '5122': 'Drizzle and Light Snow',
  '5105': 'Mostly Clear and Snow',
  '5106': 'Partly Cloudy and Snow',
  '5107': 'Mostly Cloudy and Snow',
  '5000': 'Snow',
  '5101': 'Heavy Snow',
  '5119': 'Mostly Clear and Heavy Snow',
  '5120': 'Partly Cloudy and Heavy Snow',
  '5121': 'Mostly Cloudy and Heavy Snow',
  '5110': 'Drizzle and Snow',
  '5108': 'Rain and Snow',
  '5114': 'Snow and Freezing Rain',
  '5112': 'Snow and Ice Pellets',
  '6000': 'Freezing Drizzle',
  '6003': 'Mostly Clear and Freezing drizzle',
  '6002': 'Partly Cloudy and Freezing drizzle',
  '6004': 'Mostly Cloudy and Freezing drizzle',
  '6204': 'Drizzle and Freezing Drizzle',
  '6206': 'Light Rain and Freezing Drizzle',
  '6205': 'Mostly Clear and Light Freezing Rain',
  '6203': 'Partly Cloudy and Light Freezing Rain',
  '6209': 'Mostly Cloudy and Light Freezing Rain',
  '6200': 'Light Freezing Rain',
  '6213': 'Mostly Clear and Freezing Rain',
  '6214': 'Partly Cloudy and Freezing Rain',
  '6215': 'Mostly Cloudy and Freezing Rain',
  '6001': 'Freezing Rain',
  '6212': 'Drizzle and Freezing Rain',
  '6220': 'Light Rain and Freezing Rain',
  '6222': 'Rain and Freezing Rain',
  '6207': 'Mostly Clear and Heavy Freezing Rain',
  '6202': 'Partly Cloudy and Heavy Freezing Rain',
  '6208': 'Mostly Cloudy and Heavy Freezing Rain',
  '6201': 'Heavy Freezing Rain',
  '7110': 'Mostly Clear and Light Ice Pellets',
  '7111': 'Partly Cloudy and Light Ice Pellets',
  '7112': 'Mostly Cloudy and Light Ice Pellets',
  '7102': 'Light Ice Pellets',
  '7108': 'Mostly Clear and Ice Pellets',
  '7107': 'Partly Cloudy and Ice Pellets',
  '7109': 'Mostly Cloudy and Ice Pellets',
  '7000': 'Ice Pellets',
  '7105': 'Drizzle and Ice Pellets',
  '7106': 'Freezing Rain and Ice Pellets',
  '7115': 'Light Rain and Ice Pellets',
  '7117': 'Rain and Ice Pellets',
  '7103': 'Freezing Rain and Heavy Ice Pellets',
  '7113': 'Mostly Clear and Heavy Ice Pellets',
  '7114': 'Partly Cloudy and Heavy Ice Pellets',
  '7116': 'Mostly Cloudy and Heavy Ice Pellets',
  '7101': 'Heavy Ice Pellets',
  '8001': 'Mostly Clear and Thunderstorm',
  '8003': 'Partly Cloudy and Thunderstorm',
  '8002': 'Mostly Cloudy and Thunderstorm',
  '8000': 'Thunderstorm'
}
const App = () => {

  const [inputCity, setInputCity] = useState('')
  const [weather, setWeather] = useState({ degree: '', appdegree: '', condition: '' })
  //   const [degree, setDegree] = useState('')
  //   const [condition, setCondition] = useState()
  const [name, setName] = useState('')

  Geocode.setApiKey(process.env.REACT_APP_GOOGLE_API_KEY)
  Geocode.setLanguage('en')
  //let sourceStr

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
        // newWeather = {
        //   degree: res.data.data.timelines[0].intervals[0].values.temperature,
        //   appdegree: res.data.data.timelines[0].intervals[0].values.temperatureApparent,
        //   condition: res.data.data.timelines[0].intervals[0].values.weatherCode
        // }
        setWeather(newWeather)

        // setDegree(res.data.data.timelines[0].intervals[0].values.temperature)
        // setCondition(res.data.data.timelines[0].intervals[0].values.weatherCode)
        //console.log(useRegex(condition))
      })
    Geocode.fromLatLng(lat, lng)
      .then((res) => {
        const address = res.results[0].formatted_address
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
        setName(`${city}, ${state}, ${country}`)
        console.log(address)
      })


    //sourceStr = `../assets/small/png/${condition}0_`
    //let path = path.substring(0,path.)
  }

  const condNumToString = (code) => {
    return weatherCode[code]
  }

  //   const useRegex = (input) => {
  //     let regex = /'\.\.\/assets\/small\/png\//i\
  //     return regex.test(input)
  //   }

  return (
    <div style={{ backgroundImage: `url(${Background})`,backgroundRepeat: 'no-repeat',backgroundSize: 'cover', height:'100%',width:'100%' }}>
      <div style={{ margin: 'auto', width: '50%' }}>
        <h2 style={{ margin: 'auto', width: '50%', textAlign: 'center' }}>Weather App</h2>
        <form style={{ margin: 'auto', width: '30%' }} onSubmit={handleSubmit}>
          <label>
                    City:
            <input type="text" onChange={(e) => setInputCity(e.target.value)}/>
            <input type="submit" value="Submit" />
          </label>
        </form>

        {weather.degree !== '' &&
      <>
        {/* <p>Current Temperature in {name} : {Math.floor(weather.degree)}°C and {condNumToString(weather.condition)}. It feels like {Math.floor(weather.appdegree)}°C.</p>
        <img src='../assets/small/png/' /> */}
        <Card style={{ width: '30rem', margin: 'auto' }}>
          <Card.Img variant="top" src={Sunny} />
          {/* <img src={Sunny} /> */}
          <Card.Body>
            <Card.Title>{name}</Card.Title>
            <Card.Text>
                The current temperature in {name} is {Math.floor(weather.degree)} °C and {condNumToString(weather.condition)}. It feels like {Math.floor(weather.appdegree)}°C
            </Card.Text>
          </Card.Body>
        </Card>
      </>
        }

        {weather.degree === '' &&
                <p>Enter a city to get realtime weather data!</p>
        }
      </div>

    </div>
  )
}

export default App