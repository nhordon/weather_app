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
let APIkey = "12f9bca0d293ab6474784507bbb9ee8c";
let units = "metric";
const days = 5;
function setWeatherH2Dsc(description, icon_src, city) {
	document.querySelector("#searched-city").innerHTML = `<img id="weather_icon" src="${icon_src}" />
	<span id="weather_dsc">${description}</span><br />${city}`; //`🌤 ${response.data.name}`;
}
function setCelsius(temperature, temperatureVal, temperatureC, temperatureF) {
	//default

	temperatureVal.innerHTML = temperature + "° ";
	temperatureC.className = "tmpr mark";
	temperatureF.className = "unactive mark";
}
function setFahrenheit(temperature, temperatureVal, temperatureC, temperatureF) {
	let temper = Math.round((parseInt(temperature) * 9) / 5 + 32).toString();
	//console.log(temper, temperature);
	temperatureVal.innerHTML = temper + "° ";
	temperatureC.className = "unactive mark";
	temperatureF.className = "tmpr mark";
}

function setTemperature(temperature, i = "") {
	let temperatureC = document.querySelector("#celsius" + i); //fahrenheit
	let temperatureF = document.querySelector("#fahrenheit" + i);
	let temperatureVal = document.querySelector("#city_tmpr" + i);
	temperature = Math.round(temperature);
	//temperatureVal.innerHTML = temperature + "° ";
	setCelsius(temperature, temperatureVal, temperatureC, temperatureF);
	temperatureC.addEventListener("click", function (event) {
		event.preventDefault();
		setCelsius(temperature, temperatureVal, temperatureC, temperatureF);
	});
	temperatureF.addEventListener("click", function (event) {
		event.preventDefault();
		setFahrenheit(temperature, temperatureVal, temperatureC, temperatureF);
	});
}

function dateTimeConverter(UNIX_timestamp, zone) {
	let date = new Date(UNIX_timestamp * 1000);
	let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

	let option = { weekday: "long" }; //, year: "numeric", month: "long", day: "numeric" };
	let d = new Date((UNIX_timestamp + zone) * 1000);
	let dayOfWeek = days[d.getUTCDay()];
	return [
		{
			weekday: date.toLocaleDateString([], option),
			full_date: date.toLocaleDateString([], { year: "numeric", month: "2-digit", day: "numeric" }),
			time: date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false }),
		},
		{
			weekday: dayOfWeek,
			full_date: `${String(d.getUTCDate()).padStart(2, "0")}:${String(d.getUTCMonth() + 1).padStart(2, "0")}:${d.getUTCFullYear()}`,
			time: `${String(d.getUTCHours()).padStart(2, "0")}:${String(d.getUTCMinutes()).padStart(2, "0")}`,
		},
	];
}
function setDateTime(UNIX_timestamp, zone, local, city) {
	let date = dateTimeConverter(UNIX_timestamp, zone);
	let dateStr = ` Local <strong>${date[0].weekday}</strong> ${date[0].full_date} ${date[0].time}`;
	if (local === false) dateStr += `<br/>In ${city} <strong>${date[1].weekday}</strong> ${date[1].full_date} ${date[1].time}`;
	document.querySelector("#current-place-date").innerHTML = dateStr;
}
function setWeatherFeatures(features) {
	let features_str = [" hPa Atmospheric pressure <br />", " % Humidity <br />", " m/s Wind speed <br />", " Sunrise | Sunset"];

	let str = "<br />";
	for (let i = 0; i < Math.min(features_str.length, features.length); i++) {
		str += features[i] + features_str[i];
	}
	document.querySelector("#weather_features").innerHTML = str;
}

function setForecast(response) {
	console.log(response.data);
	let zone = response.data.timezone_offset;
	let weather_arr = response.data.daily; //[]

	let strForecast = "";
	for (let i = 1; i < days; i++) {
		let d = dateTimeConverter(weather_arr[i].dt, zone)[0];
		let imgStr = `<img src="http://openweathermap.org/img/wn/${weather_arr[i].weather[0].icon}@2x.png" alt=""  width="24"
        "/>`;
		//console.log(imgStr);
		strForecast += `<div class="weekday">
		<div class="day">
			<strong>${d.weekday}</strong>
		</div>
		<div class="day-inf">
			<p>
				<span class="date">${imgStr}${weather_arr[i].weather[0].main} ${d.full_date}</span>
				<span class="tmpr" id="city_tmpr${i}">20°</span><a href="#" class="tmpr mark" id="celsius${i}"> C </a> | <a href="#" class="unactive mark" id="fahrenheit${i}"> F </a> Temperature <br />
				${weather_arr[i].humidity}% Humidity <br />
			</p>
		</div>
	</div>;`;
	}
	let hourly = response.data.hourly;

	document.querySelector("#forecast").innerHTML = strForecast;
	for (let i = 1; i < days; i++) setTemperature(weather_arr[i].temp.day, i);

	let tdVals = document.querySelectorAll("#precipitation tr");
	let h = "";
	let clouds, rain, snow;
	for (let i = 1; i < 3; i++) {
		if (i == 2) h = "+ hour";

		clouds = typeof hourly[i - 1].clouds !== "undefined" ? hourly[i - 1].clouds : 0;
		rain = typeof hourly[i - 1].rain !== "undefined" ? hourly[i - 1].rain : 0;
		snow = typeof hourly[i - 1].snow !== "undefined" ? hourly[i - 1].snow : 0;
		tdVals[i].innerHTML = `<td>current <br />${h}</td>
								<td>${clouds}</td>
								<td>${rain}</td>
								<td>${snow}</td>`;
	}
}
function forecast(coordinates) {
	let forecastAPI = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${APIkey}&units=${units}`;
	axios.get(forecastAPI).then(setForecast);
}
function setWeather(response, local) {
	//console.log(response);
	let description = response.data.weather[0].description;
	//http://openweathermap.org/img/wn/10d@2x.png
	let icon_src = `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`;
	let city = response.data.name;

	let temperature = response.data.main.temp;
	let sunrise_time = dateTimeConverter(response.data.sys.sunrise)[0].time;
	let sunset_time = dateTimeConverter(response.data.sys.sunset)[0].time;
	let features = [response.data.main.pressure, response.data.main.humidity, response.data.wind.speed, `${sunrise_time} | ${sunset_time}`];
	let coordinates = response.data.coord;
	let UNIX_timestamp = response.data.dt;
	let zone = response.data.timezone;
	//console.log(zone);
	setWeatherH2Dsc(description, icon_src, city);
	setTemperature(temperature);
	setWeatherFeatures(features);
	//console.log(local);
	setDateTime(UNIX_timestamp, zone, local, city);
	forecast(coordinates);
}

function setCity(position) {
	let coords = [position.coords.latitude, position.coords.longitude];

	let weatherAPI = `https://api.openweathermap.org/data/2.5/weather?lat=${coords[0]}&lon=${coords[1]}&appid=${APIkey}&units=${units}`;
	//console.log(weatherAPI);
	axios.get(weatherAPI).then(function () {
		setWeather(arguments[0], true);
	});
}
function setLocalCity() {
	navigator.geolocation.getCurrentPosition(setCity);
}

function setSearchedCity(event) {
	event.preventDefault();

	let searchedCity = document.querySelector("#search").value;
	//document.querySelector("#searched-city").innerHTML = `🌤 ${searchedCity.value}`;
	let weatherAPI = `https://api.openweathermap.org/data/2.5/weather?q=${searchedCity}&appid=${APIkey}&units=${units}`; //console.log(weatherAPI);

	//axios.get(weatherAPI).then(setWeather, arguments[0], false);// function() {
	axios.get(weatherAPI).then(function () {
		setWeather(arguments[0], false);
	});
}
//setLocalCity();
window.addEventListener("DOMContentLoaded", setLocalCity);
let local_btn = document.querySelector("#local_btn");
local_btn.addEventListener("click", setLocalCity);
let city = document.querySelector("#search_frm");
city.addEventListener("submit", setSearchedCity);
