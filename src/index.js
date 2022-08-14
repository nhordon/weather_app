/*
👨‍🏫 Your task
In your project, when a user searches for a city (example: New York), it should display the name of the city on the result page and the current temperature of the city.

Please note: there's no need to include a temperature conversion at the moment. This will be taught later on in the course.

🙀 Bonus point:
Add a Current Location button. When clicking on it, it uses the Geolocation API to get your GPS coordinates and display and the city and current temperature using the OpenWeather API.*/

let temperatureC = document.querySelector("#celsius"); //fahrenheit
let temperatureF = document.querySelector("#fahrenheit");
let temperatureVal = document.querySelector(".tmpr");
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

function setWeather(response) {
	let temperature = response.data.main.temp;

	temperature = Math.round(temperature);

	document.querySelector("#searched-city").innerHTML = `🌤 ${response.data.name}`;
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
