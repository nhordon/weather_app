/*
👨‍🏫 Your task
In your project, when a user searches for a city (example: New York), it should display the name of the city on the result page and the current temperature of the city.

Please note: there's no need to include a temperature conversion at the moment. This will be taught later on in the course.

🙀 Bonus point:
Add a Current Location button. When clicking on it, it uses the Geolocation API to get your GPS coordinates and display and the city and current temperature using the OpenWeather API.
Improve the project including the search engine, API integration,
 unit conversion, wind speed, weather description, and weather icon are mandatory.
  The project should not include the forecast yet.
*/

let temperatureC = document.querySelector("#celsius"); //fahrenheit
let temperatureF = document.querySelector("#fahrenheit");
let temperatureVal = document.querySelector(".tmpr");
function setWeatherH2Dsc(description, icon_src, city) {
	document.querySelector("#searched-city").innerHTML = `<img id="weather_icon" src="${icon_src}" />
	<span id="weather_dsc">${description}</span><br />${city}`; //`🌤 ${response.data.name}`;
}
function setCelsius(temperature) {
	//default

	temperatureVal.innerHTML = temperature + "° ";
	temperatureC.className = "tmpr mark";
	temperatureF.className = "unactive mark";
}
function setFahrenheit(temperature) {
	let temper = Math.round((parseInt(temperature) * 9) / 5 + 32).toString();
	//console.log(temper, temperature);
	temperatureVal.innerHTML = temper + "° ";
	temperatureC.className = "unactive mark";
	temperatureF.className = "tmpr mark";
}
function setTemperature(temperature) {
	temperature = Math.round(temperature);
	//temperatureVal.innerHTML = temperature + "° ";
	setCelsius(temperature);
	temperatureC.addEventListener("click", function (event) {
		event.preventDefault();
		setCelsius(temperature);
	});
	temperatureF.addEventListener("click", function (event) {
		event.preventDefault();
		setFahrenheit(temperature);
	});
}

function setCurrentDateTime() {
	let date = new Date();

	let option = { weekday: "long" }; //, year: "numeric", month: "long", day: "numeric" };
	let dateStr = `<strong>${date.toLocaleDateString("en-US", option)}</strong> ${date.toLocaleDateString()} 
	${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false })}`;
	document.querySelector("#current-place-date").innerHTML = dateStr;
}
function timeConverter(UNIX_timestamp) {
	//JavaScript works in milliseconds, so you'll first have to convert the UNIX timestamp from seconds to milliseconds.

	let a = new Date(UNIX_timestamp * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });

	return a;
}

function setWeatherFeatures(features) {
	let features_str = [" hPa Atmospheric pressure <br />", " % Humidity <br />", " m/s Wind speed <br />", " Sunrise | Sunset"];

	let str = "<br />";
	for (let i = 0; i < Math.min(features_str.length, features.length); i++) {
		str += features[i] + features_str[i];
	}
	document.querySelector("#weather_features").innerHTML = str;
}
function setWeather(response) {
	console.log(response);
	let description = response.data.weather[0].description;
	//http://openweathermap.org/img/wn/10d@2x.png
	let icon_src = `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`;
	let city = response.data.name;
	setWeatherH2Dsc(description, icon_src, city);
	let temperature = response.data.main.temp;
	let features = [
		response.data.main.pressure,
		response.data.main.humidity,
		response.data.wind.speed,
		`${timeConverter(response.data.sys.sunrise)} | ${timeConverter(response.data.sys.sunset)}`,
	];
	setWeatherFeatures(features);
	setTemperature(temperature);
}

let APIkey = "12f9bca0d293ab6474784507bbb9ee8c";
let units = "metric";

function setCity(position) {
	let coords = [position.coords.latitude, position.coords.longitude];

	let weatherAPI = `https://api.openweathermap.org/data/2.5/weather?lat=${coords[0]}&lon=${coords[1]}&appid=${APIkey}&units=${units}`;
	//console.log(weatherAPI);
	axios.get(weatherAPI).then(setWeather);
}
function setLocalCity() {
	navigator.geolocation.getCurrentPosition(setCity);
}

setLocalCity();
let local_btn = document.querySelector("#local_btn");
local_btn.addEventListener("click", setLocalCity);

function setSearchedCity(event) {
	event.preventDefault();

	let searchedCity = document.querySelector("#search").value;
	//document.querySelector("#searched-city").innerHTML = `🌤 ${searchedCity.value}`;
	let weatherAPI = `https://api.openweathermap.org/data/2.5/weather?q=${searchedCity}&appid=${APIkey}&units=${units}`; //console.log(weatherAPI);

	axios.get(weatherAPI).then(setWeather);
}
let city = document.querySelector("#search_frm");
city.addEventListener("submit", setSearchedCity);

document.addEventListener("DOMContentLoaded", setCurrentDateTime); //on load
setInterval(function () {
	setCurrentDateTime();
}, 30000); // Run every 1/2 minute == 30000; second; 1 second == 1000 milliseconds
