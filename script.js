// create a weather app object
const weatherApp = {};


weatherApp.icons = {
    cloudy: {
        description:`Cloudy`,
        symbol:`./assets/icons8-cloud-30.png`,
        altText: `cloud icon`
    },
    rain: {
        description:`Rain`,
        symbol:`./assets/icon8-rainy-weather-30.png`,
        altText: `rain icon`
    },
    sun: {
        description:`Sunny`,
        symbol: `./assets/icon8-sun-star-48.png`,
        altText: `sun icon`
    }
};

// obtain the api url & api key save in the weather object
weatherApp.apiUrl = "http://dataservice.accuweather.com/currentconditions/v1/topcities/50";
// obtain the api url & api key save in the weather object
weatherApp.apiKey = "iKLTvoFgSq9sc5BKM37ihFtikGNp351H"





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




// ** FUNCTION FOR GETTING ALL COUNTRIES weahterApp.getCountries ** //
weatherApp.getCountries = () => {
    //get all regions of the world first
    fetch("http://dataservice.accuweather.com/locations/v1/regions?apikey=DwK5l1uPAjh4A3DfJSFThmsSvZD1jQKy")
        .then((response) => {
            return response.json();
        })
        .then((jsonResult) => {
                     
            weatherApp.countryNames = [];

            //loop through the regions to get all countries within that region
            jsonResult.forEach(region => {
                fetch(`http://dataservice.accuweather.com/locations/v1/countries/${region.ID}?apikey=DwK5l1uPAjh4A3DfJSFThmsSvZD1jQKy`)
                    .then((res) => {
                        return res.json()
                    })
                        .then((result) => {
                                                       
                            //loop through the result to get all countries
                            result.forEach(country => {
                                weatherApp.countryNames.push(country.EnglishName)
                            })
                        })
            })
        })
}
// ** weatherApp.getCountries FUNCTION ENDS ** //




// ** SUBMIT BUTTON EVENT LISTENER ** //

//target the "Submit" button
weatherApp.submitButton = document.querySelector('#submit');

//add event listener to the "Submit" button
weatherApp.submitButton.addEventListener('click', function(){

    //find out which city user has selected
    weatherApp.userCity = weatherApp.dropDown.value;

    // clear the cityFlag div when user selects new city
    weatherApp.cityFlagDiv.innerHTML = "";

    weatherApp.moreOptions.style.visibility = "visible";
    if (weatherApp.citySearchDiv) {
        weatherApp.citySearchDiv.innerHTML = "";
    }
    
    
    //clear the conversion div when user selects new city
    weatherApp.div.innerHTML = "";

    //call the display weather stats function with the users selected city
    weatherApp.displayWeatherStats(weatherApp.userCity, weatherApp.weatherData); 
});
// ** SUBMIT BUTTON EVENT LISTENER ENDS** //




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

    weatherApp.moreOptions.style.visibility = "visible";
     if (weatherApp.citySearchDiv) {
        weatherApp.citySearchDiv.innerHTML = "";
    }
    //call the display weather stats function with random city
    weatherApp.displayWeatherStats(weatherApp.randomCity, weatherApp.weatherData);
}); 
// ** RANDOM BUTTON EVENT LISTENER ENDS ** //



// ** MORE OPTIONS BUTTON EVENT LISTENER ** //
weatherApp.moreOptions = document.querySelector('.moreOptions')
weatherApp.moreOptions.addEventListener('click', function () {
    weatherApp.countryNames.sort();
    weatherApp.moreOptions.style.visibility = "hidden";

    
    weatherApp.citySearchDiv = document.querySelector('.citySearch');
    weatherApp.citySearchP = document.createElement('p');
    weatherApp.citySearchP.innerText = "Please select a country from the dropdown menu and type a name of a city in the search bar to get weather data for any city in the world";
    weatherApp.citySearchDiv.appendChild(weatherApp.citySearchP);
    weatherApp.countrySelect = document.createElement('select');

    const cityOptionDefault = document.createElement('option');
    cityOptionDefault.innerText = "Please choose a country";
    cityOptionDefault.setAttribute("value", "choose");
    weatherApp.countrySelect.appendChild(cityOptionDefault);
    weatherApp.countryNames.forEach(country => {
        const countryOption = document.createElement('option');
        countryOption.innerText = country;
        countryOption.setAttribute("value", country);
        weatherApp.countrySelect.appendChild(countryOption);
    })
    weatherApp.citySearchDiv.appendChild(weatherApp.countrySelect)
    weatherApp.citySearchLabel = document.createElement('label')
    weatherApp.citySearchLabel.innerText = "Please enter a city name in the search bar:";
    weatherApp.citySearchLabel.setAttribute('for', 'citySearchBar');
    weatherApp.citySearchDiv.appendChild(weatherApp.citySearchLabel);

    weatherApp.citySearchBar = document.createElement('input');
    weatherApp.citySearchBar.setAttribute('id', "citySearchBar");
    weatherApp.citySearchBar.setAttribute('type', "text");
    weatherApp.citySearchBar.setAttribute('placeholder', "City Name");
    weatherApp.citySearchDiv.appendChild(weatherApp.citySearchBar);

    weatherApp.citySearchButton = document.createElement('button');
    weatherApp.citySearchButton.setAttribute('id', 'citySearchButton');
    weatherApp.citySearchButton.innerText = "City Search"
    weatherApp.citySearchDiv.appendChild(weatherApp.citySearchButton);




    // ** CITY SEARCH BUTTON EVENT LISTENER ** //
    weatherApp.citySearchButton.addEventListener('click', function () {
        weatherApp.searchCity(weatherApp.citySearchBar.value, weatherApp.countrySelect.value)
    })
    // ** CITY SEARCH BUTTON EVENT LISTENER ENDS ** //
})
// ** MORE OPTIONS BUTTON EVENT LISTENER ENDS** //



// ** FUNCTION FOR SEARCHING FOR A CITY ** //
weatherApp.searchCity = (city, country) => {
    console.log(city, country)
    weatherApp.searchUrl = "http://dataservice.accuweather.com/locations/v1/cities/search";

    weatherApp.citySearchUrl = new URL(weatherApp.searchUrl);
    weatherApp.citySearchUrl.search = new URLSearchParams({
        apikey: weatherApp.apiKey,
        q:`${city} ${country}`
    });

    fetch(weatherApp.citySearchUrl)
        .then((response) => {
            return response.json()
        })
            .then((result) => {
                if (result.length === 0) {
                    alert("No results found.  Please try again")
                } else if (result.length === 1) {
                    console.log('haha')
                    console.log(result[0].Key)
                    console.log(typeof(result[0].Key))
                }
            })

}



// ** FUNCTION FOR DISPLAYING WEATHER STATS ** //

//this function will display the weather stats for the users selected city or random city
weatherApp.displayWeatherStats = (passedCity, weatherData) => {

    //loop through the weatherData to find weather data for users city
    //get user City's weather data
    weatherData.forEach(city => {
        if (passedCity === city.EnglishName) {

            //get the city's temperature and the unit (C or F)
            weatherApp.currentTemp = `${city.Temperature.Metric.Value} ${city.Temperature.Metric.Unit}`;

            // Rittu's new line get the city's temperature in unit F and store it in variable to be used later
            weatherApp.fahrenheit = `${city.Temperature.Imperial.Value} ${city.Temperature.Imperial.Unit}`;

            //get the city's weather Text
            weatherApp.currentWeatherText = city.WeatherText;
            if (weatherApp.currentWeatherText === 'Cloudy' || weatherApp.currentWeatherText === 'Partly cloudy' || weatherApp.currentWeatherText === 'Mostly cloudy') {
                weatherApp.displayIconSource = weatherApp.icons.cloudy.symbol
                weatherApp.displayIconAlt = weatherApp.icons.cloudy.altText
            }


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
    // create li element for weather icon
    weatherApp.displayIcon = document.createElement('img')
    
    //add class attribute to each li element
    weatherApp.tempLi.setAttribute('class', 'tempLi');
    weatherApp.weatherTextLi.setAttribute('class', 'weatherTextLi');
    weatherApp.precipitationLi.setAttribute('class', 'precipitationLi');
    // create src and alt attribute to the li element for the weather icons 
    weatherApp.displayIcon.setAttribute('src', `${weatherApp.displayIconSource}`)
    weatherApp.displayIcon.setAttribute('alt', `${weatherApp.displayIconAlt}`)
    
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
    
        //  create paragraph element to display to the temp in F
        weatherApp.paraFahrenheit = document.createElement('p');

        //  add fahrenheit value and unit to the p element
        weatherApp.paraFahrenheit.innerText = weatherApp.fahrenheit;

        // display the fahrenheit temp on the DOM
        weatherApp.div.appendChild(weatherApp.paraFahrenheit);

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

    //call the getCountries function
    weatherApp.getCountries();

    // target Select element
    weatherApp.dropDown = document.querySelector('select');

    //targeting the cityFlag div
    weatherApp.cityFlagDiv = document.querySelector(".cityFlag")
    
    // Target the div
    weatherApp.div = document.querySelector('#conversion');

};

// call the init method
weatherApp.init();

         

          