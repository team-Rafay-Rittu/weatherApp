/// create a weather app object
const weatherApp = {};


//creating an api Url for weather data for top 50 cities

// obtain the api url & api key save in the weather object
weatherApp.apiUrl = "http://dataservice.accuweather.com/currentconditions/v1/topcities/50";
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
            //store the jsonResult (which contains all the weather data for top 50 cities) in the weatherApp object
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
    //get all regions of the world first with this api call
    fetch("http://dataservice.accuweather.com/locations/v1/regions?apikey=DwK5l1uPAjh4A3DfJSFThmsSvZD1jQKy")
        .then((response) => {
            return response.json();
        })
        .then((jsonResult) => {
                     
            weatherApp.countryNames = [];

            //loop through the regions to get all countries within that region
            jsonResult.forEach(region => {
                //get all countries in a region with this api call
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

    weatherApp.moreOptions.style.display = "block";
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

    weatherApp.moreOptions.style.display = "block";
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
    //sort countryNames which we got using getCountries function
    weatherApp.countryNames.sort();
    
    //when More Options button is clicked, it will be hidden
    weatherApp.moreOptions.style.display = "none";

   
    //create a paragraph with instructions, a dropdown menu with all the countries
    //and an input with type text for user to enter a city name and click the City Search button
    //target the citySearch div element to contain the above elements
    weatherApp.citySearchDiv = document.querySelector('.citySearch');
    
    //paragraph element creation and appending
    weatherApp.citySearchP = document.createElement('p');
    weatherApp.citySearchP.innerText = "Please select a country from the dropdown menu and type a name of a city in the search bar to get weather data for any city in the world.";
    weatherApp.citySearchP.setAttribute('class', 'searchInstructions');
    weatherApp.citySearchDiv.appendChild(weatherApp.citySearchP);

    
    //select element creation with a "Please choose country " option element appending
    weatherApp.countrySelect = document.createElement('select');
    const cityOptionDefault = document.createElement('option');
    cityOptionDefault.innerText = "Please choose a country";
    cityOptionDefault.setAttribute("value", "choose");
    weatherApp.countrySelect.appendChild(cityOptionDefault);
    
    //looping through the country names and creating an option element for each country and appending it to the select element
    weatherApp.countryNames.forEach(country => {
        const countryOption = document.createElement('option');
        countryOption.innerText = country;
        countryOption.setAttribute("value", country);
        weatherApp.countrySelect.appendChild(countryOption);
    })

    //append the select element to the parent div
    weatherApp.citySearchDiv.appendChild(weatherApp.countrySelect)

    //create and append a label for the input search bar
    weatherApp.citySearchLabel = document.createElement('label')
    weatherApp.citySearchLabel.innerText = "Please enter a city name in the search bar:";
    weatherApp.citySearchLabel.setAttribute('for', 'citySearchBar');
    weatherApp.citySearchDiv.appendChild(weatherApp.citySearchLabel);

    //create and apppend the input search bar
    weatherApp.citySearchBar = document.createElement('input');
    weatherApp.citySearchBar.setAttribute('id', "citySearchBar");
    weatherApp.citySearchBar.setAttribute('type', "text");
    weatherApp.citySearchBar.setAttribute('placeholder', "City Name");
    weatherApp.citySearchDiv.appendChild(weatherApp.citySearchBar);

    //create a search button and append it to the div
    weatherApp.citySearchButton = document.createElement('button');
    weatherApp.citySearchButton.setAttribute('id', 'citySearchButton');
    weatherApp.citySearchButton.innerText = "City Search"
    weatherApp.citySearchDiv.appendChild(weatherApp.citySearchButton);




    // ** CITY SEARCH BUTTON EVENT LISTENER ** //
    weatherApp.citySearchButton.addEventListener('click', function () {
        //get the city name from the input and the country name from the dropdown menu and call the searchCity function
        weatherApp.searchCity(weatherApp.citySearchBar.value, weatherApp.countrySelect.value)
    })
    // ** CITY SEARCH BUTTON EVENT LISTENER ENDS ** //
})
// ** MORE OPTIONS BUTTON EVENT LISTENER ENDS** //



// ** FUNCTION FOR SEARCHING FOR A CITY ** //
weatherApp.searchCity = (city, country) => {
    //api call for searching for a city. Search parameters are "city country"
    weatherApp.searchUrl = "http://dataservice.accuweather.com/locations/v1/cities/search";

    weatherApp.citySearchUrl = new URL(weatherApp.searchUrl);
    weatherApp.citySearchUrl.search = new URLSearchParams({
        apikey: weatherApp.apiKey,
        q:`${city} ${country}`
    });

    fetch(weatherApp.citySearchUrl)
        .then((response) => {
            //response is location data 
            return response.json()
        })
            .then((result) => {
                //3 possibilits exist when searching for a city.  The city doesn't exist so the result will have a lenght of 0
                if (result.length === 0) {
                    alert("No results found.  Please try again")
                //if there is only 1 city that matches the search, call the getCityWeatherfunction and pass in the location data
                } else if (result.length === 1) {
                    weatherApp.getCityWeather(result[0]);
                //if there are multiple cities that match the search
                } else if (result.length > 1) {
                    //loop through the result which contains location data for multiple cities
                    result.forEach(city => {
                        //create a div that contains radio button and an associated label for each city
                        const radioDiv = document.createElement('div')
                        radioDiv.setAttribute('class', 'radioDivContainer')
                        const cityLabel = document.createElement('label')
                        cityLabel.setAttribute('for', `${city.Key}`)
                        cityLabel.innerText = `${city.EnglishName}, ${city.AdministrativeArea.EnglishName}, ${city.Country.EnglishName}`
                        
                        const cityRadio = document.createElement('input')
                        cityRadio.setAttribute('type', 'radio');
                        cityRadio.setAttribute('name', 'multipleCities');
                        cityRadio.setAttribute('value', `${city.Key}`);
                        cityRadio.setAttribute('id', `${city.Key}`);

                        radioDiv.appendChild(cityRadio);
                        radioDiv.appendChild(cityLabel);
                        
                        weatherApp.citySearchDiv.appendChild(radioDiv);
                        
                    })

                    //group all the radio buttons together in the variable radioGroup
                    const radioGroup = document.querySelectorAll('input[name="multipleCities"]')
                    
                    //add eventListener to each radio button
                    //when a change is detected, call getCityWeather function and pass in the location data for the city which the user selected with a radio button
                    for (let i = 0; i < radioGroup.length; i++) {
                        radioGroup[i].addEventListener('change', function () {
                            weatherApp.getCityWeather(result[i]);
                        })
                    }

                }
            })
}





//getCityWeather Function starts
weatherApp.getCityWeather = (cityData) => {
    console.log(cityData);
    //get the location data which was passed into this function when called and get the location Key
    //make the API call for weather data for a particular city with the location Key
    fetch(`http://dataservice.accuweather.com/currentconditions/v1/${cityData.Key}?apikey=DwK5l1uPAjh4A3DfJSFThmsSvZD1jQKy`)
        .then((response) => {
            return response.json();
        })
            .then((cityWeather) => {
                //the API result contains weatherData, we have to attach city name and country information to the weatherData
                cityWeather[0].Country = cityData.Country;
                cityWeather[0].EnglishName = cityData.EnglishName;
                //call the displayWeatherStats with the city name and weather data
                weatherApp.displayWeatherStats(cityData.EnglishName, cityWeather);
            })
}
//getCityWeather Function ends



// ** FUNCTION FOR DISPLAYING WEATHER STATS ** //

//this function will display the weather stats for the users selected city or random city
weatherApp.displayWeatherStats = (passedCity, weatherData) => {
   
    //clear the cityFlag div when random button is clicked
    weatherApp.cityFlagDiv.innerHTML = "";

    //clear conversion div when random button is clicked
    weatherApp.div.innerHTML = "";

    weatherApp.moreOptions.style.visibility = "visible";
    if (weatherApp.citySearchDiv) {
        weatherApp.citySearchDiv.innerHTML = "";
    }
    //loop through the weatherData to find weather data for users city
    //get user City's weather data
    weatherData.forEach(city => {
        if (passedCity === city.EnglishName) {

            console.log(city.EnglishName)
            //get the city's temperature and the unit (C or F)
            weatherApp.currentTemp = `${city.Temperature.Metric.Value} ${city.Temperature.Metric.Unit}`;

            // Rittu's new line get the city's temperature in unit F and store it in variable to be used later
            weatherApp.fahrenheit = `${city.Temperature.Imperial.Value} ${city.Temperature.Imperial.Unit}`;

            //get the city's weather Text and store in a variable to be used later
            weatherApp.currentWeatherText = city.WeatherText;

            //get the city name
            weatherApp.cityName = city.EnglishName;

            //get the city's country ID
            weatherApp.countryId = city.Country.ID;

            //get the city's country name
            weatherApp.countryName = city.Country.EnglishName;

            // get the city's weatherIcon value 
            weatherApp.weatherIcon = city.WeatherIcon;
        
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


   
    
   

    // create src and alt attribute to the li element for the weather icons 
    weatherApp.displayIcon.setAttribute('src', `./assets/${weatherApp.weatherIcon}.png`);
    weatherApp.displayIcon.setAttribute('alt', `Weather is ${weatherApp.currentWeatherText} icon`);
    
    
    //add the weather data to the list elements
    weatherApp.tempLi.innerText = weatherApp.currentTemp;
    weatherApp.weatherTextLi.innerText = weatherApp.currentWeatherText;

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