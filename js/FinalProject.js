// Obtain references to DOM elements
var description = document.querySelector('.description');
var summaryBox = document.querySelector('.summary');
var summary = document.querySelector('.summary p');
var pressure = document.querySelector('.pressure p');
var humidity = document.querySelector('.humidity p');
var temp = document.querySelector('.temp p');
var temp_max = document.querySelector('.temp_max p');
var temp_min = document.querySelector('.temp_min p');
var input = document.querySelector('.search input[type="text"]');
var form = document.querySelector('form');
var main = document.querySelector('main');
var audioResponse;

// Event handling
form.addEventListener('submit', function (sub) {
    // Prevent default behaviour of browser for submit event (ie: reloading page etc.)
    sub.preventDefault();

    if (input.value) {
        let city = input.value.toLowerCase();
        // Used to obtain weather data, background image asynchronously (XHR or Fetch API).
        getWeatherData(city);
    }
    // clear text field
    input.value = "";
});

function getWeatherData(city) {
    let httpRequest = new XMLHttpRequest();
    if (!httpRequest) {
        console.log('Cannot create XHR instance');
        return false;
    }
    // Specifying an event handler for the 'readystatechange' events fired(for each state change) when response is received from the server.
    // handling the response from the API
    httpRequest.addEventListener('readystatechange', function () {
        try {
            if (httpRequest.readyState === 4) {
                if (httpRequest.status === 200) {
                    // Parse JSON string message received from weather api. Returns a json object.
                    let weatherData = JSON.parse(httpRequest.responseText);
                    // Update the weather information
                    generateWeatherInfo(weatherData);
                    //getBackgroundImage(weatherData.weather[0].main);
                } else {
                    console.log('There was a problem with the request');
                    summary.textContent = `Sorry! weather information unavailable.`;
                    description.style.opacity = 0;
                    summaryBox.style.opacity = 1;
                }
            }
        } catch (e) {
            console.log('Exception:' + e);
        }
    });
    //AJAX
    httpRequest.open('GET', `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=0de4dfcb8ac3dec8fc6c38ebf38ca808&units=metric`);
    httpRequest.send();
}

//https://stackoverflow.com/questions/55150506/how-to-display-an-image-based-on-temperature-range-or-weather-conditions

function generateWeatherInfo(weatherData) {
    // Enabling the visibility of the weather information
    description.style.opacity = 50;
    summaryBox.style.opacity = 50;
    // updating the weather information
    // DOM traversal

    summary.textContent = "The weather forecast for "+weatherData.name+ " is "+weatherData.weather[0].description;
    temp.textContent = "Temperature is "+weatherData.main.temp+ "°C";
    temp_max.textContent = "Max Temperature is "+weatherData.main.temp_max+ "°C";
    temp_min.textContent = "Min Temperature is "+weatherData.main.temp_min+ "°C";
    pressure.textContent = "Pressure is "+weatherData.main.pressure+ "hPa";
    humidity.textContent = "Humidity is "+weatherData.main.humidity+ "%";


    var x = weatherData.main.temp;
    var screen = document.querySelector("main");
    // Example of DOM modification
    switch (true){

      case (x<0):
        alert("freezing");
        screen.style.backgroundImage = "url('css/img/freezing.jpg')";
        break;

      case (x >= 0 && x < 15):
        alert("sunny");
        screen.style.backgroundImage = "url('css/img/Sunny.jpg')";
        break;

      case (x >= 15 && x < 40):
        alert("hot");
        screen.style.backgroundImage = "url('css/img/hot.jpg')";
        break;

        console.log(document.body.style);

    }


    var audioResponse;
    var audioResponse	= "The weather forecast for"+ weatherData.name+ "is"+ weatherData.weather[0].description+"with a maximum temperature of" +weatherData.main.temp_max+ "degree celsius";
    weatherSpoken(audioResponse);
}

function weatherSpoken(audioResponse) {

			// setup synthesis
			var mssg = new SpeechSynthesisUtterance();
			var voices = window.speechSynthesis.getVoices();
			mssg.voice = voices[10];					// Note: some voices don't support altering params
			mssg.voiceURI = 'native';
			mssg.volume = 1;							// 0 to 1
			mssg.rate = 1;							// 0.1 to 10
			mssg.pitch = 2;							// 0 to 2
			mssg.text = audioResponse;
			mssg.lang = 'en-US';

			speechSynthesis.speak(mssg);
		}
