// create a weather app object
const weatherApp = {};

weatherApp.icons = {
    cloudy: {
        description: [`Cloudy`, `Partly cloudy`, `Mostly cloudy`, `Overcast`],
        symbol:`./assets/icons8-cloud-30.png`,
        altText: `cloud icon`
    },
    rain: {
        description: [`Rain`, `Drizzle`, `Light rain`],
        symbol:`./assets/icons8-rainy-weather-30.png`,
        altText: `rain icon`
    },
    sun: {
        description:`Sunny`,
        symbol: `./assets/icons8-sun-star-48.png`,
        altText: `sun icon`
    },
    partialSun: {
        description: `Partly Sunny`,
        symbol: `./assets/icons8-partly-cloudy-day-48.png`,
        altText: `partly sunny and cloudy icon`
    },
    snow: {
        description: `snow`,
        symbol:`./assets/icons8-snow-40.png`,
        altText: `snow icon`
    }
};

//creating an api Url for weather data for top 50 cities

// obtain the api url & api key save in the weather object
weatherApp.apiUrl = "http://dataservice.accuweather.com/currentconditions/v1/topcities/50";
// obtain the api url & api key save in the weather object
weatherApp.apiKey = "DwK5l1uPAjh4A3DfJSFThmsSvZD1jQKy"





// ** FUNCTION FOR INITIAL API CALL ** //

// Make the api call & get the data for the top 50 cities.
weatherApp.getCities = () => {
    weatherApp.url = new URL(weatherApp.apiUrl);
    weatherApp.url.search = new URLSearchParams({
        apikey: weatherApp.apiKey
    });

    fetch(weatherApp.url)
        .then((response) => {
            return response.json()
        })
        .then((jsonResult) => {
            //store the jsonResult (which contains all the weather data) in the weatherApp object
            weatherApp.weatherData = jsonResult;
            console.log(jsonResult);

            // create an empty array for sorting city names by alphabet
            weatherApp.cityNames = [];

            // loop through the weatherData to store all city names
            jsonResult.forEach(object => {
                // then add each city name to the array
                weatherApp.cityNames.push(object.EnglishName);
            });

            //sort the city names by alphabet
            weatherApp.cityNames.sort();

            //populate the select element with city names alphabetically using weatherApp.cityNames array
            weatherApp.cityNames.forEach(city => { 

                // create an option element for city
                const cityElement = document.createElement('option');

                // created a value attribute and set it to the city name 
                cityElement.setAttribute('value', city);
                
                // add city name to the option element
                cityElement.innerText = city;

                // append child option element to parent Select element
                weatherApp.dropDown.appendChild(cityElement);
            });
        });
}
// ** weatherApp.getCities FUNCTION ENDS ** //





// ** SUBMIT BUTTON EVENT LISTENER ** //

//target the "Submit" button
weatherApp.submitButton = document.querySelector('#submit');

//add event listener to the "Submit" button
weatherApp.submitButton.addEventListener('click', function(){

    //find out which city user has selected
    weatherApp.userCity = weatherApp.dropDown.value;

    // clear the cityFlag div when user selects new city
    weatherApp.cityFlagDiv.innerHTML = "";
    
    //clear the conversion div when user selects new city
    weatherApp.div.innerHTML = "";

    //call the display weather stats function with the users selected city
    weatherApp.displayWeatherStats(weatherApp.userCity); 
});





// ** RANDOM BUTTON EVENT LISTENER ** //

// target the 'random' button
weatherApp.randomButton = document.querySelector('#random');

// create an event listener
weatherApp.randomButton.addEventListener('click', function () {

    //generate a random number to select a random city
    weatherApp.randomNum = Math.floor(Math.random() * 50);

    //select a random city based on the random number
    weatherApp.randomCity = weatherApp.weatherData[weatherApp.randomNum].EnglishName;

    //clear the cityFlag div when random button is clicked
    weatherApp.cityFlagDiv.innerHTML = "";

    //clear conversion div when random button is clicked
    weatherApp.div.innerHTML = "";

    //call the display weather stats function with random city
    weatherApp.displayWeatherStats(weatherApp.randomCity);
}); 





// ** FUNCTION FOR DISPLAYING WEATHER STATS ** //

//this function will display the weather stats for the users selected city or random city
weatherApp.displayWeatherStats = (passedCity) => {

    //loop through the weatherData to find weather data for users city
    //get user City's weather data
    weatherApp.weatherData.forEach(city => {
        if (passedCity === city.EnglishName) {

            //get the city's temperature and the unit (C or F)
            weatherApp.currentTemp = `${city.Temperature.Metric.Value} ${city.Temperature.Metric.Unit}`;

            // Rittu's new line get the city's temperature in unit F and store it in variable to be used later
            weatherApp.fahrenheit = `${city.Temperature.Imperial.Value} ${city.Temperature.Imperial.Unit}`;

            //get the city's weather Text and store in a variable to be used later
            weatherApp.currentWeatherText = city.WeatherText;
            if (weatherApp.currentWeatherText === 'Cloudy' || weatherApp.currentWeatherText === 'Partly cloudy' || weatherApp.currentWeatherText === 'Mostly cloudy' || weatherApp.currentWeatherText === 'Overcast' || weatherApp.currentWeatherText === 'Some clouds') {
                console.log("it's cloudy!");
                weatherApp.displayIconSource = weatherApp.icons.cloudy.symbol;
                weatherApp.displayIconAlt = weatherApp.icons.cloudy.altText;

            } else if (weatherApp.currentWeatherText === 'Rain' || weatherApp.currentWeatherText === 'Drizzle' || weatherApp.currentWeatherText === 'Light rain' || weatherApp.currentWeatherText === 'Showers')
            { 
                console.log("its raining");
                weatherApp.displayIconSource = weatherApp.icons.rain.symbol;
                weatherApp.displayIconAlt = weatherApp.icons.rain.altText;

            } else if (weatherApp.currentWeatherText === 'Sunny' || weatherApp.currentWeatherText === 'Clear' || weatherApp.currentWeatherText === 'Mostly Sunny') 
            {
                console.log("it's sunny");
                weatherApp.displayIconSource = weatherApp.icons.sun.symbol;
                weatherApp.displayIconAlt = weatherApp.icons.sun.altText;

            } else if (weatherApp.currentWeatherText === 'Partly sunny' || weatherApp.currentWeatherText === 'Clouds and sun')
             {
                console.log("it's partly sunny");
                weatherApp.displayIconSource = weatherApp.icons.partialSun.symbol;
                weatherApp.displayIconAlt = weatherApp.icons.partialSun.altText;

            } else if (weatherApp.currentWeatherText === 'Snowing' || weatherApp.currentWeatherText === 'Sleet' || weatherApp.currentWeatherText === 'Snow showers' || weatherApp.currentWeatherText === 'Snow')
             {
                console.log("it's snowing");
                weatherApp.displayIconSource = weatherApp.icons.snow.symbol;
                weatherApp.displayIconAlt = weatherApp.icons.snow.altText;
            };


            //get the city's precipitation type if it has precipitation
            if (city.PrecipitationType !== null) {
                weatherApp.currentPrecipitation = city.PrecipitationType;
            } else {
                weatherApp.currentPrecipitation = "";
            }
            //get the city name
            weatherApp.cityName = city.EnglishName;

            //get the city's country ID
            weatherApp.countryId = city.Country.ID;

            //get the city's country name
            weatherApp.countryName = city.Country.EnglishName;
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
    // create img element for weather icon
    weatherApp.displayIcon = document.createElement('img')

    
    //add class attribute to each li element
    weatherApp.tempLi.setAttribute('class', 'tempLi');
    weatherApp.weatherTextLi.setAttribute('class', 'weatherTextLi');
    weatherApp.precipitationLi.setAttribute('class', 'precipitationLi');
    // create src and alt attribute to the li element for the weather icons 
    weatherApp.displayIcon.setAttribute('src', `${weatherApp.displayIconSource}`);
    weatherApp.displayIcon.setAttribute('alt', `${weatherApp.displayIconAlt}`);
    
    
    //add the weather data to the list elements
    weatherApp.tempLi.innerText = weatherApp.currentTemp;
    weatherApp.weatherTextLi.innerText = weatherApp.currentWeatherText;
    weatherApp.precipitationLi.innerText = weatherApp.currentPrecipitation;
    
    
    //append the li elements to the ul
    weatherApp.ul.appendChild(weatherApp.tempLi);
    weatherApp.ul.appendChild(weatherApp.weatherTextLi);
    weatherApp.ul.appendChild(weatherApp.precipitationLi);
    weatherApp.precipitationLi.appendChild(weatherApp.displayIcon);
   

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

        // new line added by Rittu. Target the ul #weatherStats as we now want to display F temp in that ul.
        weatherApp.ul = document.querySelector('#weatherStats');
    
        //  create paragraph element to display to the temp in F
        // weatherApp.paraFahrenheit = document.createElement('p');

        // new line added by Rittu. Create li elment to display F temp
        weatherApp.displayFahrenheit = document.createElement('li');

        //  add fahrenheit value and unit to the p element
        // weatherApp.paraFahrenheit.innerText = weatherApp.fahrenheit;
        // new line added by Rittu. Add the F value to the li element
        weatherApp.displayFahrenheit.innerText = weatherApp.fahrenheit;

        // display the fahrenheit temp on the DOM
        // weatherApp.div.appendChild(weatherApp.paraFahrenheit);
        // new line added by Rittu. Display the F temp on the ul parent
        weatherApp.ul.appendChild(weatherApp.displayFahrenheit);

        // remove the convertButton from the parent node (body)
        weatherApp.div.removeChild(weatherApp.convertButton);
       
    });


    //create img element for country flag
    weatherApp.flag = document.createElement('img')
    //set the src of the img element
    weatherApp.flag.setAttribute('src', `https://flagsapi.com/${weatherApp.countryId}/shiny/64.png`)
    //set the alt text of the img element
    weatherApp.flag.setAttribute('alt', `Flag of ${weatherApp.countryName}`)

    //append the img element to the cityFlag div
    weatherApp.cityFlagDiv.appendChild(weatherApp.flag);

     //create a h3 element which will display city name
    weatherApp.nameOfCity = document.createElement('h3');

    //add the city name inside the h3 element
    weatherApp.nameOfCity.innerText = weatherApp.cityName;

    //append the h3 element to the cityFlag div
    weatherApp.cityFlagDiv.appendChild(weatherApp.nameOfCity);

}
            
// create an init method
weatherApp.init = () => {

    //call the getCities function to populate the dropdown menu with all the city names
    weatherApp.getCities();

    // target Select element
    weatherApp.dropDown = document.querySelector('select');

    //targeting the cityFlag div
    weatherApp.cityFlagDiv = document.querySelector(".cityFlag")
    
    // Target the div
    weatherApp.div = document.querySelector('#conversion');

};

// call the init method
weatherApp.init();

         

          