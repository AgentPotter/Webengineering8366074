// openweathermap.com API key
var key = "c9ca12883224aaa36b2f89c9db889530"

// add event to input field
const searchbox = document.querySelector('.search-box');
searchbox.addEventListener('keypress', setQuery);

// update weather display when enter is pressed inside the input field
function setQuery(evt) {
  if (evt.keyCode == 13) {
	city = searchbox.value
  weather(city);
  }
}

// show weather of Stuttgart on website load
weather("Stuttgart");

// gets the weather data from the API
function weather(city) {
  // get data from the given URL and parameters and parse it into a json file
	fetch('https://api.openweathermap.org/data/2.5/forecast?q=' + city + '&appid=' + key)
	.then(function(resp) { return resp.json() }) // Convert data to json
	.then(function(data) {
		drawWeather(data);
	})
  // alert if the fetched URL returns an error
	.catch(function() {
		alert("The entered city doesn't exist!");
	});
}

// gets the displayed values from the json file
function drawWeather(d) {

	// determine values for weather at the moment
  var celcius = getTempInDegree(d, 0);
  var description = d.list[0].weather[0].description;
	var iconURL = "http://openweathermap.org/img/wn/" + d.list[0].weather[0].icon + "@2x.png";
	var date = new Date(d.list[0].dt*1000);

  // gifs to be displayed depending on the weather
  // these are used to overwrite the CSS properties
  const rain = 'url("/images/mountain-background.jpg"), url("/images/rain.gif")';
  const cloud = 'url("/images/mountain-background.jpg"), url("/images/clouds.gif")';
  const clear = 'url("/images/mountain-background.jpg"), url("/images/sunny.gif")';
  const snow = 'url("/images/mountain-background.jpg"), url("/images/snow.gif")';
  const thunderstorm = 'url("/images/mountain-background.jpg"), url("/images/thunderstorm.gif")';
  const noDescription = 'url("/images/mountain-background.jpg")';

  // generate <div> IDs with the determined values
	document.getElementById('description').innerHTML = description;
	document.getElementById('temp').innerHTML = celcius + '&deg;';
	document.getElementById('location').innerHTML = "Weather in " + d.city.name + ", " + d.city.country + " on " + dateBuilder(date);
	document.getElementById('icon').innerHTML = "<img src=" + iconURL + ">";

  // change CSS properties depending on the current weather situation
  // this is down by filtering the description by key words
  if( description.indexOf('rain') > 0 ) {
    changeWeatherGIF(rain);
    changeWeatherGIF2(rain);
  } else if( description.indexOf('cloud') > 0 ) {
    changeWeatherGIF(cloud);
    changeWeatherGIF2(cloud);
  } else if( description.indexOf('clear') >= 0 ) {
    changeWeatherGIF(clear);
    changeWeatherGIF2(clear);
  } else if( description.indexOf('snow') > 0 ) {
    changeWeatherGIF(snow);
    changeWeatherGIF2(snow);
  } else if( description.indexOf('thunderstorm') > 0 ) {
    changeWeatherGIF(thunderstorm);
    changeWeatherGIF2(thunderstorm);
  } else {
    changeWeatherGIF(noDescription);
    changeWeatherGIF2(noDescription);
  }

	// determine values the next 5 todays and generate <div> IDS
	document.getElementById('description_day1').innerHTML = d.list[8].weather[0].description;
	document.getElementById('temp_day1').innerHTML = getTempInDegree(d, 8) + '&deg;';
	document.getElementById('icon_day1').innerHTML = getIcon(d, 8);
	document.getElementById('weekday1').innerHTML = getWeekDay(d, 8);

	document.getElementById('description_day2').innerHTML = d.list[16].weather[0].description;
	document.getElementById('temp_day2').innerHTML = getTempInDegree(d, 16) + '&deg;'; + '&deg;';
	document.getElementById('icon_day2').innerHTML = getIcon(d, 16);
	document.getElementById('weekday2').innerHTML = getWeekDay(d, 16);

	document.getElementById('description_day3').innerHTML = d.list[24].weather[0].description;
	document.getElementById('temp_day3').innerHTML = getTempInDegree(d, 24) + '&deg;'; + '&deg;';
	document.getElementById('icon_day3').innerHTML = getIcon(d, 24);
	document.getElementById('weekday3').innerHTML = getWeekDay(d, 24);

	document.getElementById('description_day4').innerHTML = d.list[32].weather[0].description;
	document.getElementById('temp_day4').innerHTML = getTempInDegree(d, 32) + '&deg;'; + '&deg;';
	document.getElementById('icon_day4').innerHTML = getIcon(d, 32);
	document.getElementById('weekday4').innerHTML = getWeekDay(d, 32);
}

// gets json file and integer for date and returns temperature in degree
function getTempInDegree(json, day) {
	return Math.round(parseFloat(json.list[day].main.temp)-273.15);
}

// gets json file and integer for date and returns index of the specific weater icon
function getIcon(json, day) {
	return '<img src="http://openweathermap.org/img/wn/' + json.list[day].weather[0].icon + '@2x.png">';
}

// gets json file and integer for date and returns name of day
function getWeekDay(json, day) {
	var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
	var date = new Date(json.list[day].dt_txt);
	var index = date.getDay();
	return days[index];
}

// overwrites background CSS property for given weather condition
function changeWeatherGIF(cond) {
  var cols = document.getElementsByClassName('parallaxWeather');
  for(i = 0; i < cols.length; i++) {
    cols[i].style.backgroundImage = cond;
  }
}

// this is a workaround cause im not able to put two
// getElementsByClassName into one function and make it work properly :(
function changeWeatherGIF2(cond) {
  var cols = document.getElementsByClassName('parallax-Gap');
  for(i = 0; i < cols.length; i++) {
    cols[i].style.backgroundImage = cond;
  }
}

// gets date and returns formatted date, month and year
function dateBuilder(d) {
	let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  let date = d.getDate();
  let month = months[d.getMonth()];
  let year = d.getFullYear();
  // set th to default
	let ext = "th";

  // determine the extend for the number like st, nd, rd or th
	if (date == 1 || date == 21 || date == 31) {
		ext = "st";
	} else if (date == 2 || date == 22) {
		ext = "nd";
	} else if (date == 3) {
		ext = "rd";
	}

  return `${date}${ext} of ${month} ${year}`;
}
