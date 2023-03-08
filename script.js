  // create a weather app object
const weatherApp = {};

// obtain the api url & api key save in the weather object
weatherApp.apiUrl = "http://dataservice.accuweather.com/currentconditions/v1/topcities/50";
weatherApp.apiKey = "DwK5l1uPAjh4A3DfJSFThmsSvZD1jQKy"

// Make the api call & get the data for the top 50 cities.
weatherApp.getCities = () => {
    weatherApp.url = new URL(weatherApp.apiUrl);
    weatherApp.url.search = new URLSearchParams({
        apikey: weatherApp.apiKey
    });

    fetch(weatherApp.url)
        .then((response) => {
            console.log(response);
            return response.json()
        })
        .then((jsonResult) => {
            console.log(jsonResult);

            //store the jsonResult (which contains all the API data) in the weatherApp object
            weatherApp.weatherData = jsonResult;

            // create an empty array
            weatherApp.cityNames = [];

            // retrive data from the array of object, property "EnglishName"
            jsonResult.forEach(object => {

                // then add each city name to the array
                weatherApp.cityNames.push(object.EnglishName);
            });

            //sort the city names by alphabet
            weatherApp.cityNames.sort();

            //populate the select element with city names alphabetically using weatherApp.cityNames array
            weatherApp.cityNames.forEach(city => { 

                // create child element for city
                const cityElement = document.createElement('option');

                // created a class value so later we cann the user has selected the city 
                cityElement.setAttribute('value', city);
                
                // add city name to the option element
                cityElement.innerText = city;

                // append child to select parent Select element
                weatherApp.dropDown.appendChild(cityElement);
            });
            
        });
    
}

// ** SUBMIT BUTTON EVENT LISTENER ** //

//target the "Submit" button
weatherApp.submitButton = document.querySelector('#submit');

//add event listener to the "Submit" button
weatherApp.submitButton.addEventListener('click', function(){

    //find out which city user has selected
    weatherApp.userCity = weatherApp.dropDown.value;

    //clear the conversion div when user selects new city
    weatherApp.div.innerHTML = "";

    //call the display weather stats function
    weatherApp.displayWeatherStats(weatherApp.userCity); 
  
});

// ** RANDOM BUTTON EVENT LISTENER ** //

// target the 'randon' button
weatherApp.randomButton = document.querySelector('#random');

// create an event listener
weatherApp.randomButton.addEventListener('click', function () {

    // regenerate a random number to select a random city
    weatherApp.randomNum = Math.floor(Math.random() * 50);

    //  saved random city
    weatherApp.randomCity = weatherApp.weatherData[weatherApp.randomNum].EnglishName;

    // clear diversion div when user selects new city
    weatherApp.div.innerHTML = "";

    //call the display weather stats function
    weatherApp.displayWeatherStats(weatherApp.randomCity);

}); 

//this function will display the weather stats for the users selected city
weatherApp.displayWeatherStats = (passedCity) => {

    //loop through the weatherData to find weather data for users city
    //get user City's weather data
    weatherApp.weatherData.forEach(city => {
        if (passedCity === city.EnglishName) {

            //get the city's temperature and the unit unit (C or F)
            weatherApp.currentTemp = `${city.Temperature.Metric.Value} ${city.Temperature.Metric.Unit}`;

            // Rittu's new line get the city's temperature in unit F and store it in variable to be used later
            weatherApp.fahrenheit = `${city.Temperature.Imperial.Value} ${city.Temperature.Imperial.Unit}`;
            console.log(weatherApp.fahrenheit);

            //get the city's weather Text
            weatherApp.currentWeatherText = city.WeatherText;

            //get the city's precipitation type if it has precipitation
            if (city.PrecipitationType !== null) {
                weatherApp.currentPrecipitation = city.PrecipitationType;
            } else {
                weatherApp.currentPrecipitation = "";
            }
            // add name of city to h3
            weatherApp.showCity.innerText = city.EnglishName;

        }
    });
    
    //target the ul
    weatherApp.ul = document.querySelector('#weatherStats');
    
    //clear the ul
    weatherApp.ul.innerHTML = "";
    
    //create child li elements
    weatherApp.tempLi = document.createElement('li')
    weatherApp.weatherTextLi = document.createElement('li')
    weatherApp.precipitationLi = document.createElement('li')
    
    //add class attribute to each li element
    weatherApp.tempLi.setAttribute('class', 'tempLi');
    weatherApp.weatherTextLi.setAttribute('class', 'weatherTextLi');
    weatherApp.precipitationLi.setAttribute('class', 'precipitationLi');
    
    //add the weather data to the list elements
    weatherApp.tempLi.innerText = weatherApp.currentTemp;
    weatherApp.weatherTextLi.innerText = weatherApp.currentWeatherText;
    weatherApp.precipitationLi.innerText = weatherApp.currentPrecipitation;
    
    //append the li elements to the ul
    weatherApp.ul.appendChild(weatherApp.tempLi);
    weatherApp.ul.appendChild(weatherApp.weatherTextLi);
    weatherApp.ul.appendChild(weatherApp.precipitationLi);

    // create a button to convert celsius to fahrenheit
    weatherApp.convertButton = document.createElement('button');

    // add a class & Id attribute, & text to the convertButton
    weatherApp.convertButton.setAttribute('class', 'convert');
    weatherApp.convertButton.setAttribute('id', 'convert');
    weatherApp.convertButton.innerText = "Convert to F";

    // append convert button to parent element (body)
    weatherApp.div.appendChild(weatherApp.convertButton);

    // add an event listener when user clicks on the convert button and 
    // run a function that converts the temp to fahrenheit
    weatherApp.convertButton.addEventListener('click', function (convert) {
    
        //  create paragraph element to display to the temp in F
        weatherApp.paraFahrenheit = document.createElement('p');

        //  add fahrenheit value and unit to the p element
        weatherApp.paraFahrenheit.innerText = weatherApp.fahrenheit;

        // display the fahrenheit temp on the DOM
        weatherApp.div.appendChild(weatherApp.paraFahrenheit);

        // remove the convertButton from the parent node (body)
        weatherApp.div.removeChild(weatherApp.convertButton);
       
    });
}
            
// create an init method
weatherApp.init = () => {

    //call the getCities function to populate the dropdown menu with all the city names
    weatherApp.getCities();

    // target Select element
    weatherApp.dropDown = document.querySelector('select');

    // targeting the h3 element which will display the city name
    weatherApp.showCity = document.querySelector('#cityName') 
    
    // Target the div
    weatherApp.div = document.querySelector('#conversion');

};

// call the init method
weatherApp.init();

         

          