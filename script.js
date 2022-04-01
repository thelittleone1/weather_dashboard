let apiKey = "f2eaafe950454f45ba680cad4e9a2716";
let url1 = "https://api.openweathermap.org/data/2.5/forecast?id=524901&appid=" + apiKey;

//let currentCityWeatherEl = document.querySelectorAll("#currentCityWeather");
// let weatherImgageEl = document.querySelectorAll("weatherImage");
//let currentTemperatureEl = document.querySelectorAll("#currentTemperature");
//let currentWindEl = document.querySelectorAll("#currentWind");
//let currentHumidityEl = document.querySelectorAll("currentHumidity");
//let currentUVIndexEl = document.querySelectorAll("#currentUVIndex");
// Button to submit
let searchBtn = document.querySelector("#searchBtn");
// The input to search for the city
let searchBar = document.querySelector("#searchBar");
// Search history
let searchedCities = document.querySelector("#searched-cities")
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
    currentCityTitle: document.querySelector("#currentCityWeather"),
    weatherPicture: document.querySelector("#weatherIcon"),
    temperature: document.querySelector("#currentTemperature"),
    wind: document.querySelector("#currentWind"),
    humidity: document.querySelector("currentHumidity"),
    uvIndex: document.querySelector("#currentUVIndex"),
}


// Creating the function that will gather the info from the API
function currentCityWeather(request) {
    fetch(request)
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        if(data) {
            let latitude = data.coord.lat;
            let longitude = data.coord.lon;
            currentWeather.city = data.name;
            currentWeather.lat = latitude;
            currentWeather.lon = longitude;
            let callWeatherAPI = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=minutely,hourly&limit=6&units=imperial&appid=` + apiKey;
            onecallApi(callWeatherAPI); 
        } else {
            alert("City Not found")
        }
    })
}

// Called for debugging purpopses
//currentCityWeather(url1);

//  oneCallAPI handles current weather 
function onecallApi(req) {
    fetch(req)
    .then(function(resp) {
    return resp.json();
})
    .then(function(data) {
        currentWeather.currentCityTitle.textContent = `${currentWeather.city} ${moment().format("MMM Do YY")}`;
        currentWeather.temperature.textContent = data.current.temp;
        currentWeather.wind.textContent = data.current.wind_speed;
        // Uncaught Cannot Set Property of Null (Setting TextContent)
        //currentWeather.humidity.textContent = data.current.humidity;
        currentWeather.uvIndex.textContent = data.current.uvi;
        if(data.current.uvi > 10){
            currentWeather.uvIndex.setAttribute("style","color: #be0000");
        } else if(data.current.uvi > 5){
            currentWeather.uvIndex.setAttribute("style","color: #ff9928");
        } else if(data.current.uvi >= 1){
            currentWeather.uvIndex.setAttribute("style","color: #33cc00");
        } else{
            currentWeather.uvIndex.setAttribute("style","color: #ffffff");
        }
        updateHistory(currentWeather.city);
    })
}

// Displays the 5 day forecast
function dailyForecast(forecast) {
    for (var i = 0; i < 5; i++) {
        let date = document.querySelector(`#date-${i-1}`);
        let temp = document.querySelector(`#temp-${i-1}`);
        let windspeed = document.querySelector(`#windspeed-${i-1}`);
        let humid = document.querySelector(`#hum-${i-1}`);
        date.textContent = `${moment().format("MMM Do YY")}`;
        temp.textContent = forecast[i].temp.day + "Degrees";
        windspeed.textContent = forecast[i].windspeed + "MPH";
        humid.textContent = forecast[i].humid; 
    }
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
        let storedCityName = displayCityNames(cityName, currentWeather.lat, currentWeather.lon);
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
            history.push(displayCityNames(localVariable.city[i],localVariable.lat[i],localVariable.lon[i]));
        }
        if(history.length > 0) {
            weather = localVariable;
            displayHistory();
            currentWeather.city = history[0].textContent;
            callApi(`https://api.openweathermap.org/data/2.5/onecall?lat=${history[0].dataset.latitude}&lon=${history[0].dataset.longitude}&exclude=minutely,hourly&limit=6&units=imperial&appid=` + apiKey);
        }
    }
}

// Creates button in Search History that can be clicked on 
function displayCityNames(name, latitude, longitude) {
    let cityDisplay = document.createElement("button");
    cityDisplay.textContent = name;
    cityDisplay.setAttribute("data-cityname", formatName(name));
    cityDisplay.setAttribute("data-latitude", latitude);
    cityDisplay.setAttribute("data-longitude", longitude);
    cityDisplay.addEventListener("click", function(event) {
        event.preventDefault();
        let callWeatherAPI = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=minutely,hourly&limit=6&units=imperial&appid=` + apiKey;
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
        cityFormat = cityFormat.trim();
        if(cityFormat.includes(" ")) {
           cityFormat = cityFormat.replaceAll(" ","+");
        }
        if(cityFormat.includes("-")) {
           cityFormat = cityFormat.replaceAll("-","+");
        }
    } else {
        cityFormat = "-1";
    }
    return cityFormat;
}

searchBtn.addEventListener("click", function(event) {
    event.preventDefault();
    let userInput = searchBar.value;
    userInput = formatName(userInput);
    let callWeatherAPI = `https://api.openweathermap.org/data/2.5/weather?q=${userInput}&appid=` + apiKey;
    currentCityWeather(callWeatherAPI);
    if(userInput !== "-1") {
        let callWeatherAPI = `https://api.openweathermap.org/data/2.5/weather?q=${userInput}&appid={API key}`;
        currentCityWeather(callWeatherAPI);
    } else {
        alert("Please enter a valid name");
    }
});

parseStorage();