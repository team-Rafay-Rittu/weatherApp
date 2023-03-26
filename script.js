/// create a weather app object
const weatherApp = {};


//creating an api Url for weather data for top 50 cities
// obtain the api url & api key save in the weather object
weatherApp.apiUrl = "http://dataservice.accuweather.com/currentconditions/v1/topcities/50";
weatherApp.apiKey = "DwK5l1uPAjh4A3DfJSFThmsSvZD1jQKy"



// ** ----------FUNCTION TO GET WEATHER DATA FOR TOP 50 CITIES----------** //
weatherApp.getCities = () => {
    weatherApp.url = new URL(weatherApp.apiUrl);
    weatherApp.url.search = new URLSearchParams({
        apikey: weatherApp.apiKey
    });

    fetch(weatherApp.url)
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error(error);
            }
        })

        .then((jsonResult) => {
            //store the jsonResult (which contains all the weather data for top 50 cities) in the weatherApp object
            weatherApp.weatherData = jsonResult;

            // creating new array filling it from json reault object of country names
            weatherApp.cityNames = jsonResult.map(object => {
                return object.EnglishName;
            });
        
            //sort the city names by alphabet
            weatherApp.cityNames.sort();
            
            //populate the select element with city names alphabetically using weatherApp.cityNames array
            weatherApp.cityNames.forEach(city => {

                // create an option element for each city and attach it to the select element
                const cityElement = document.createElement('option');
                cityElement.setAttribute('value', city);
                cityElement.innerText = city;

                weatherApp.dropDown.appendChild(cityElement);
            });
        })
        .catch((error) => {
            if (error.message === "Not Found") {
                alert("");
            } else {
                console.log(error.Dtatus)
                alert("We apologize! WeatherApp is currently down. Please return after 24 hours!");
            }
        });
}
// ** ----------getCities FUNCTION ENDS----------** //


// ** ---------FUNCTION FOR GETTING ALL COUNTRIES weahterApp.getCountries ---------** //
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
// ** ---------weatherApp.getCountries FUNCTION ENDS ---------** //





// ** ---------FUNCTION FOR SEARCHING FOR A CITY ---------** //
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
            //response is location data for a city or multiple cities 
            return response.json()
        })

            .then((citySearchResult) => {
               console.log(citySearchResult)
                //3 possibilits exist when searching for a city.  The city doesn't exist so the result will have a lenght of 0
                if (citySearchResult.length === 0) {
                    alert("No such city exists in the specified country.  Please check the spelling and try again")
                //if there is only 1 city that matches the search, call the getCityWeatherfunction and pass in the location data
                } else if (citySearchResult.length === 1) {
                    weatherApp.getCityWeather(citySearchResult[0]);
                //if there are multiple cities that match the search
                } else if (citySearchResult.length > 1) {
                    
                    weatherApp.allRadioButtons = document.createElement('div');
                    weatherApp.allRadioButtons.setAttribute('class', 'allRadioButtonsContainer')
                    
                    //loop through the result which contains location data for multiple cities
                    citySearchResult.forEach(city => {
                        //create a div that contains radio button and an associated label for each city
                        weatherApp.radioDiv = document.createElement('div');
                        weatherApp.radioDiv.setAttribute('class', 'singleRadioContainer');
                        const cityLabel = document.createElement('label');
                        cityLabel.setAttribute('for', `${city.Key}`);
                        cityLabel.innerText = `${city.EnglishName}, ${city.AdministrativeArea.EnglishName}, ${city.Country.EnglishName}, ${city.PrimaryPostalCode}`; 
                        
                        const cityRadio = document.createElement('input');
                        cityRadio.setAttribute('type', 'radio');
                        cityRadio.setAttribute('name', 'multipleCities');
                        cityRadio.setAttribute('value', `${city.Key}`);
                        cityRadio.setAttribute('id', `${city.Key}`);

                        weatherApp.radioDiv.appendChild(cityRadio);
                        weatherApp.radioDiv.appendChild(cityLabel);
                        
                        weatherApp.allRadioButtons.appendChild(weatherApp.radioDiv);
                        
                    })

                    weatherApp.citySearchDiv.appendChild(weatherApp.allRadioButtons);
                    
                    //group all the radio buttons together in the variable radioGroup
                    const radioGroup = document.querySelectorAll('input[name="multipleCities"]')
                    
                    //add eventListener to each radio button
                    //when a change is detected, call getCityWeather function and pass in the location data for the city which the user selected with a radio button
                    for (let i = 0; i < radioGroup.length; i++) {
                        radioGroup[i].addEventListener('change', function () {
                            weatherApp.getCityWeather(citySearchResult[i]);
                        })
                    }

                }
            })
}
// ** ---------FUNCTION FOR SEARCHING FOR A CITY ENDS ---------** //




// **---------FUNCTION TO GET THE WEATHER DATA OF A SEARCHED CITY--------- ** //
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
// **---------FUNCTION TO GET THE WEATHER DATA OF A CITY ENDS --------- ** //



// ** ---------FUNCTION FOR DISPLAYING WEATHER STATS ---------** //
//this function will display the weather stats for the users selected city or random city
weatherApp.displayWeatherStats = (passedCity, weatherData) => {
   
    //clear existing data and show the MORE OPTIONS button
    weatherApp.cityFlagDiv.innerHTML = "";
    weatherApp.div.innerHTML = "";
    if (weatherApp.citySearchDiv) {
        weatherApp.citySearchDiv.innerHTML = "";
    }

    weatherApp.moreOptions.style.display = "block";
    
    //loop through the weatherData to find weather data for users selected city
    weatherData.forEach(city => {
        if (passedCity === city.EnglishName) {

            //get the city's weather data and store it in the weatherApp object
            weatherApp.currentTemp = `${city.Temperature.Metric.Value} ${city.Temperature.Metric.Unit}`;
            weatherApp.fahrenheit = `${city.Temperature.Imperial.Value} ${city.Temperature.Imperial.Unit}`;
            weatherApp.currentWeatherText = city.WeatherText;
            weatherApp.weatherIcon = city.WeatherIcon;

            //get the city's geographical information
            weatherApp.cityName = city.EnglishName;
            weatherApp.countryName = city.Country.EnglishName;
            weatherApp.countryId = city.Country.ID;        
        }
    });
   
    //target the ul which will display weather information and clear it
    weatherApp.ul = document.querySelector('#weatherStats');
    weatherApp.ul.innerHTML = "";
   
    //create child li elements for displaying weather data
    weatherApp.tempLi = document.createElement('li');
    weatherApp.weatherTextLi = document.createElement('li');
    weatherApp.precipitationLi = document.createElement('li');
    
    // create img element for weather icon
    weatherApp.displayIcon = document.createElement('img');
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

    // append convert button
    weatherApp.div.appendChild(weatherApp.convertButton);

    // add an event listener when user clicks on the convert button and
    // run a function that converts the temp to fahrenheit
    weatherApp.convertButton.addEventListener('click', function (convert) {

        //// **-------This line is redundant.  weatherApp.ul has already been targeted on line 223
        // new line added by Rittu. Target the ul #weatherStats as we now want to display F temp in that ul.
        // weatherApp.ul = document.querySelector('#weatherStats');

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


    //create img element for country flag using the flagsapi website and add it to the page
    weatherApp.flag = document.createElement('img')
    weatherApp.flag.setAttribute('src', `https://flagsapi.com/${weatherApp.countryId}/shiny/64.png`)
    weatherApp.flag.setAttribute('alt', `Flag of ${weatherApp.countryName}`)

    weatherApp.cityFlagDiv.appendChild(weatherApp.flag);

     //create a h3 element which will display city name and add it to the page
    weatherApp.nameOfCity = document.createElement('h3');
    weatherApp.nameOfCity.innerText = weatherApp.cityName;

    weatherApp.cityFlagDiv.appendChild(weatherApp.nameOfCity);

}





//** --------- ATTACHED ALL THE EVENT LISTENERS TO THIS FUNCTION BELOW ---------**//

weatherApp.allEventListeners = () => {
    // ** ---------SUBMIT BUTTON EVENT LISTENER ---------** //

    //target the "Submit" button
    weatherApp.submitButton = document.querySelector('#submit');

    //add event listener to the "Submit" button
    weatherApp.submitButton.addEventListener('click', function () {

        //find out which city user has selected
        weatherApp.userCity = weatherApp.dropDown.value;

        //clear existing data and show the MORE OPTIONS button
        weatherApp.cityFlagDiv.innerHTML = "";
        weatherApp.div.innerHTML = "";
        if (weatherApp.citySearchDiv) {
            weatherApp.citySearchDiv.innerHTML = "";
        }

        weatherApp.moreOptions.style.display = "block";
        
        //call the display weather stats function with the users selected city
        //if they haven't chosen a city, alert the user to select a city
        if (weatherApp.userCity === "choose") {
            alert("Please select a city from the dropdown menu");
        } else {
            weatherApp.displayWeatherStats(weatherApp.userCity, weatherApp.weatherData);
        }
    });
    // ** ---------SUBMIT BUTTON EVENT LISTENER ENDS---------** //



    // **--------- RANDOM BUTTON EVENT LISTENER  ---------**//

    // target the 'random' button
    weatherApp.randomButton = document.querySelector('#random');

    // create an event listener
    weatherApp.randomButton.addEventListener('click', function () {

        //generate a random number to select a random city from the list of 50 cities
        weatherApp.randomNum = Math.floor(Math.random() * 50);

        //select a random city based on the random number
        weatherApp.randomCity = weatherApp.weatherData[weatherApp.randomNum].EnglishName;

        ///clear existing data and show the MORE OPTIONS button
        weatherApp.cityFlagDiv.innerHTML = "";
        weatherApp.div.innerHTML = "";
        if (weatherApp.citySearchDiv) {
            weatherApp.citySearchDiv.innerHTML = "";
        }

        weatherApp.moreOptions.style.display = "block";

        //call the display weather stats function with random city
        weatherApp.displayWeatherStats(weatherApp.randomCity, weatherApp.weatherData);
    });



// **--------- RANDOM BUTTON EVENT LISTENER ENDS--------- ** //



// **--------- MORE OPTIONS BUTTON EVENT LISTENER--------- ** //
    
    // target the 'More Options' button
    weatherApp.moreOptions = document.querySelector('.moreOptions')
    
    // create an event listener
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

// **--------- MORE OPTIONS BUTTON EVENT LISTENER ENDS---------** //


        // **--------- CITY SEARCH BUTTON EVENT LISTENER--------- ** //
        weatherApp.citySearchButton.addEventListener('click', function () {
            //get the city name from the input and the country name from the dropdown menu and call the searchCity function
            //if either the country name is not selected or city name is not entered, alert the user to do so
            if (weatherApp.citySearchBar.value === "") {
                alert("Please enter a city name in the search bar");
            } else if (weatherApp.countrySelect.value === "choose") {
                alert("Please select a country from the dropdown menu");
            } else {
                if (weatherApp.allRadioButtons) {
                    weatherApp.allRadioButtons.innerHTML = "";
                    weatherApp.searchCity(weatherApp.citySearchBar.value, weatherApp.countrySelect.value)
                } else {
                weatherApp.searchCity(weatherApp.citySearchBar.value, weatherApp.countrySelect.value)
                }
            }
        })
        // **--------- CITY SEARCH BUTTON EVENT LISTENER ENDS--------- ** //
    })

}

// **---------END OF ALL THE EVENT LISTENERS FUNCTION ---------**//


// create an init method
weatherApp.init = () => {

    //call the getCities function to populate the dropdown menu with all the city names
    weatherApp.getCities();

    //call the getCountries function and get all countries
    weatherApp.getCountries();

    // target Select city element
    weatherApp.dropDown = document.querySelector('select');

    //targeting the cityFlag div
    weatherApp.cityFlagDiv = document.querySelector(".cityFlag")
   
    // Target the convert to F div
    weatherApp.div = document.querySelector('#conversion');

    //call this function to enable all Event Listeners
    weatherApp.allEventListeners();

};

// call the init method
weatherApp.init();


