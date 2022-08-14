/*

⏰Feature #1
In your project, display the current date and time using JavaScript: Tuesday 16:00

🕵️‍♀️Feature #2
Add a search engine, when searching for a city (i.e. Paris), display the city name on the page
 after the user submits the form.

🙀Bonus Feature
Display a fake temperature (i.e 17) in Celsius and add a link to convert it to Fahrenheit. When clicking on it, it should convert the temperature to Fahrenheit. When clicking on Celsius, it should convert it back to Celsius.
*/

//1

function setCurrentDateTime() {
	let date = new Date();

	let option = { weekday: "long" }; //, year: "numeric", month: "long", day: "numeric" };
	let dateStr = `<strong>${date.toLocaleDateString("en-US", option)}</strong> ${date.toLocaleDateString()} <br />
	${date.toLocaleTimeString([], { timeStyle: "short" })}`;
	document.querySelector("#current-place-date").innerHTML = dateStr;
}
document.addEventListener("DOMContentLoaded", setCurrentDateTime); //on load
setInterval(function () {
	setCurrentDateTime();
}, 30000); // Run every 1/2 minute == 30000; second; 1 second == 1000 milliseconds
//2
function setCity(event) {
	event.preventDefault();

	let searchedCity = document.querySelector("#search");
	document.querySelector("#searched-city").innerHTML = `🌤 ${searchedCity.value}`;
}
let city = document.querySelector("#search_frm");
city.addEventListener("submit", setCity);
//3
let temperature = "20";

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
	let temper = ((parseInt(temperature) * 9) / 5 + 32).toString();
	//console.log(temper, temperature);
	temperatureVal.innerHTML = temper + "° ";
	temperatureC.className = "unactive mark";
	temperatureF.className = "tmpr mark";
}

temperatureC.addEventListener("click", function (event) {
	event.preventDefault();
	setCelsius(temperature);
});
temperatureF.addEventListener("click", function (event) {
	event.preventDefault();
	setFahrenheit(temperature);
});
