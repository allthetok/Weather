import React, { useState } from 'react'
import Geocode from 'react-geocode'
const App = () => {

    const [city, setCity] = useState('')
    
    const handleSubmit = (e) => {
        e.preventDefault()

        Geocode.setApiKey(process.env.REACT_APP_GOOGLE_API_KEY)
        Geocode.setLanguage("en")
        
        Geocode.fromAddress(city).then(
            (response) => {
                const { lat, lng } = response.results[0].geometry.location
                console.log(lat, lng)
            },
            (error) => {
                console.error(error)
            }
        )
        console.log(city)
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
            Current Temperature at {city} : 
        </div>
    )
}

export default App