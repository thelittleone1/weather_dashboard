let apiKey = "f2eaafe950454f45ba680cad4e9a2716";
let url1 = "http://api.openweathermap.org/data/2.5/forecast?id=524901&appid=" + apiKey;

let city = [];
let currentCityWeaterEl = document.querySelectorAll("#currentCityWeater");
let currentTemperatureEl = document.querySelectorAll("#currentTemperature");
let currentWindEl = document.querySelectorAll("#currentWind");
let currentHumidityEl = document.querySelectorAll("currentHumidity");
let currentUVIndexEl = document.querySelectorAll("#currentUVIndex");

// Object to hold elements of prime weather container
// intialize objects to null or empty
// update
let currentWeather = {
    city: "",
    currentCityTitle: currentCityWeaterEl,
    temperature: currentTemperatureEl,
    wind: currentWindEl,
    humidity: currentHumidityEl,
    uvIndex: currentUVIndexEl,
}


// Creating the function that will gather the info from the API
function currentCityWeather(request) {
    fetch(request)
    .then(function(response) {
        console.log("Response: ", response)
        return response.json();
    })
    .then(function(data) {
        console.log("Data: ", data);
        if(data) {
            currentWeather.city = data.name
            //callApi(url1); 
        } else {
            alert("City Not found")
        }
    })
}

currentCityWeather(url1);

// function callApi(request2) {
//     fetch(req)
//     .then(function(response1){}) 
//     return response1.json
// }