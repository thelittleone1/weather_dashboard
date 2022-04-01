let apiKey = "f2eaafe950454f45ba680cad4e9a2716";
let url1 = "https://api.openweathermap.org/data/2.5/forecast?id=524901&appid=" + apiKey;

let currentCityWeaterEl = document.querySelectorAll("#currentCityWeater");
// let weatherImgageEl = document.querySelectorAll("weatherImage");
let currentTemperatureEl = document.querySelectorAll("#currentTemperature");
let currentWindEl = document.querySelectorAll("#currentWind");
let currentHumidityEl = document.querySelectorAll("currentHumidity");
let currentUVIndexEl = document.querySelectorAll("#currentUVIndex");
// Button to submit
let searchBtn = document.querySelector("#searchBtn");
// The input to search for the city
let searchBar = document.querySelectorAll("#searchBar");
// Search history
let searchedCities = document.querySelectorAll("#searched-cities")
// Array to hold searched cities 
let history = [];

// Holds weather info when loading from local storage 
let weather = {
    city: [],
    lat: [],
    lon: [],
}

// Object to hold elements of prime weather container
// intialize objects to null or empty
// update
let currentWeather = {
    city: "",
    lat: 0,
    lon: 0,
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
        //console.log("Response: ", response)
        return response.json();
    })
    .then(function(data) {
        //console.log("Data: ", data);
        if(data) {
            let latitude = data.coord.lat;
            let longitude = data.coord.lon;
            currentWeather.city = data.name;
            currentWeather.lat = latitude;
            currentWeather.lon = longitude;
            let callWeatherAPI = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`
            callApi(callWeatherAPI); 
        } else {
            alert("City Not found")
        }
    })
}

// Called for debugging purpopses
//currentCityWeather(url1);

function callApi(req) {
    fetch(req)
    .then(function(resp) {
    return resp.json();
})
    .then(function(data) {
        currentWeather.currentCityWeaterEl.textContent = `${currentWeather.city}`;
        currentWeather.temperature.textContent = data.current.temperature;
        currentWeather.wind.textContent = data.current.wind_speed;
        currentWeather.humidity.textContent = data.current.humidity;
        currentWeather.uvIndex.textContent = data.current.uvi;
        // Edit these later
        if(data.current.uvi > 10){
            currentWeather.uvIndex.setAttribute("style","color: #be00be");
        } else if(data.current.uvi > 7){
            currentWeather.uvIndex.setAttribute("style","color: #ff0000");
        } else if(data.current.uvi > 5){
            currentWeather.uvIndex.setAttribute("style","color: #ff9928");
        } else if(data.current.uvi > 2){
            currentWeather.uvIndex.setAttribute("style","color: #ffff00");
        } else if(data.current.uvi >= 1){
            currentWeather.uvIndex.setAttribute("style","color: #99cc00");
        } else{
            currentWeather.uvIndex.setAttribute("style","color: #ffffff");
        }
        updateHistory(date.daily);
    })
}

// Function to add Searched Cities to the history array
function displayHistory() {
    for (var i = 0; i < history.length; i++) {
        searchedCities.append(history[i]);
    }
}

// Takes info in history array and adds it to local storage
function updateHistory(cityName) {
    if(!checkArray(cityName) && cityName !== "") {
        let storedCityName = generateButton(cityName);
        weather.city.unshift(cityName);
        weather.lat.unshift(currentWeather.lat);
        weather.lon.unshift(currentWeather.lon);
        localStorage.setItem("savedCities", JSON.stringify(weather));
        history.unshift(storedCityName);
        if(history.length > 9) {
            history.pop();
        }
        displayHistory();
    }
}

// Parse storage to weather object
function parseStorage() {
    let localVariable = JSON.parse(localStorage.getItem("savedCities"));
    if(localVariable != null) {
        for( var i = 0; i < localVariable.city.length; i++) {
            history.pushS(displayCityNames(localVariable.city[i]));
        }
        if(history.length > 0) {
            weather = localVariable;
            displayHistory();
            currentWeather.city = history[0].textContent;
            callApi(`https://api.openweathermap.org/data/2.5/weather?lat=${history[0].dataset.latitude}&lon=${history[0].dataset.longitude}&appid=${apiKey}`)
        }
    }
}

// Creates button in Search History that can be clicked on 
function displayCityNames(name) {
    let cityDisplay = document.createElement("button");
    cityDisplay.textContent = name;
    cityDisplay.setAttribute("data-cityname", formatName(name));
    cityDisplay.setAttribute("data-latitude", latitude);
    cityDisplay.setAttribute("data-longitude", longitude);
    cityDisplay.addEventListener("click", function(event) {
        event.preventDefault();
        let callWeatherAPI = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;
        currentWeather.city = name;
        callApi(callWeatherAPI);
    });
    return cityDisplay;
}

// Checks Array to make sure same city is not added
function checkArray(city) {
    let cityCheck = false;
    for (var i = 0; i < history.length; i++) {
        if(history[i].textContent === city) {
            cityCheck = true;
        }
    }
    return cityCheck;
}

function formatName(cityFormat) {
    if(cityFormat !== "" || cityFormat != null) {
        //cityFormat = cityFormat.trim();
        //if(cityFormat.includes(" ")) {
          //  cityFormat = cityFormat.replaceAll(" ","+");
        //}
        //if(cityFormat.includes("-")) {
          //  cityFormat = cityFormat.replaceAll("-","+");
        //}
    } else {
        cityFormat = "-1";
    }
    return cityFormat;
}

searchBtn.addEventListener("click", function(event) {
    event.preventDefault();
    let userInput = searchBar.value;
    userInput = formatName(userInput);
    if(userInput !== "-1") {
        let callWeatherAPI = `https://api.openweathermap.org/data/2.5/weather?q=${userInput}&appid={API key}`
        currentCityWeather(callWeatherAPI);
    } else {
        alert("Please enter a valid name");
    }
});

parseStorage();