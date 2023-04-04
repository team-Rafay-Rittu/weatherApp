// create a weather app object
const weatherApp = {};

// store the api Key
weatherApp.apiKey = "DwK5l1uPAjh4A3DfJSFThmsSvZD1jQKy" 
// weatherApp.apiKey = "iKLTvoFgSq9sc5BKM37ihFtikGNp351H" Rafay's back up key


// ** ----------FUNCTION TO GET WEATHER DATA FOR TOP 50 CITIES----------** //
weatherApp.getCities = () => {
    // api url to get top 50 cities weather data
    weatherApp.topFiftyUrl = new URL("https://dataservice.accuweather.com/currentconditions/v1/topcities/50");
    weatherApp.topFiftyUrl.search = new URLSearchParams({
        apikey: weatherApp.apiKey
    });
    
    fetch(weatherApp.topFiftyUrl)
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                // error handling
                throw new Error(error);
            }
        })
        .then((jsonResult) => {
            // store the jsonResult data (which contains all the weather data for top 50 cities) in the weatherApp object
            weatherApp.weatherData = jsonResult;

            // creating new array filling it from json result object of country names
            weatherApp.cityNames = jsonResult.map(object => {
                return object.EnglishName;
            });
        
            // sort the city names by alphabet order
            weatherApp.cityNames.sort();
            
            // populate the citySelect element with city names alphabetically using weatherApp.cityNames array
            weatherApp.cityNames.forEach(city => {

                // create an option element for each city and attach it to the citySelect element
                const cityElement = document.createElement('option');
                cityElement.setAttribute('value', city);
                cityElement.innerText = city;

                weatherApp.dropDown.appendChild(cityElement);
            });
        })
        // error handling
        .catch((error) => {
            weatherApp.errorHandler(error);
        });
}
// ** ----------getCities FUNCTION ENDS----------** //


// ** ---------FUNCTION FOR GETTING ALL COUNTRIES weahterApp.getCountries ---------** //
weatherApp.getCountries = () => {

    //get all regions of the world FIRST with this api call
    weatherApp.regionsURL = new URL("https://dataservice.accuweather.com/locations/v1/regions");
    weatherApp.regionsURL.search = new URLSearchParams ({
        apikey: weatherApp.apiKey
    })

    fetch(weatherApp.regionsURL)
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                //error handling
                throw new Error(error);
            }
        })
        .then((jsonResult) => {
            
            // create an empty array which will store all the countries
            weatherApp.countryNames = [];

            // loop through the regions to get all countries within that region
            jsonResult.forEach(region => {

                // get all countries in a region with this api call
                weatherApp.countriesURL = new URL(`https://dataservice.accuweather.com/locations/v1/countries/${region.ID}`);
                weatherApp.countriesURL.search = new URLSearchParams ({
                    apikey: weatherApp.apiKey
                })
                
                fetch(weatherApp.countriesURL)
                    .then((res) => {
                        if (res.ok) {
                            return res.json();
                         } else {
                            // error handling
                            throw new Error(error);
                        }
                    })
                    .then((result) => {
                                                
                        // loop through the result to get all countries
                        result.forEach(country => {
                            weatherApp.countryNames.push(country.EnglishName)
                        })

                        // sort countryNames alphabetically
                        weatherApp.countryNames.sort();
                    })
                    // error handling
                    .catch((error) => {
                        weatherApp.errorHandler(error);
                    });
                        
            })
        })
        // error handling
        .catch((error) => {
            weatherApp.errorHandler(error);
        });

}
// ** ---------weatherApp.getCountries FUNCTION ENDS ---------** //


// ** ---------FUNCTION FOR SEARCHING FOR A CITY ---------** //
weatherApp.searchCity = (city, country) => {
    // api call for searching for a city. Search parameters are "city country"
    weatherApp.searchUrl = "https://dataservice.accuweather.com/locations/v1/cities/search";

    weatherApp.citySearchUrl = new URL(weatherApp.searchUrl);
    weatherApp.citySearchUrl.search = new URLSearchParams({
        apikey: weatherApp.apiKey,
        q:`${city} ${country}`
    });

    fetch(weatherApp.citySearchUrl)
        .then((response) => {
            // response is location data for a city or multiple cities 
            if (response.ok) {
                return response.json();
            } else {
                // error handling
                throw new Error(error);
            }
        })
        .then((citySearchResult) => {
            // 3 possibilities exist when searching for a city.  The city doesn't exist so the result will have a length of 0
            if (citySearchResult.length === 0) {
                alert("No such city exists in the specified country.  Check the spelling and try again")
            // if there is only 1 city that matches the search, call the getCityWeather function and pass in the location data
            } else if (citySearchResult.length === 1) {
                weatherApp.getCityWeather(citySearchResult[0]);
            // if there are multiple cities that match the search
            } else if (citySearchResult.length > 1) {
                // container for radio buttons for multiple cities with the same name
                weatherApp.allRadioButtons = document.createElement('div');
                weatherApp.allRadioButtons.setAttribute('class', 'allRadioButtonsContainer')
                
                // loop through the result which contains location data for multiple cities with the same name
                citySearchResult.forEach(city => {
                    // create a div that contains radio button and an associated label for each city
                    const radioDiv = document.createElement('div');
                    radioDiv.setAttribute('class', 'singleRadioContainer');
                    const cityLabel = document.createElement('label');
                    cityLabel.setAttribute('for', `${city.Key}`);
                    cityLabel.innerText = `${city.EnglishName}, ${city.AdministrativeArea.EnglishName}, ${city.Country.EnglishName}, ${city.PrimaryPostalCode}`; 
                    
                    const cityRadio = document.createElement('input');
                    cityRadio.setAttribute('type', 'radio');
                    cityRadio.setAttribute('name', 'multipleCities');
                    cityRadio.setAttribute('value', `${city.Key}`);
                    cityRadio.setAttribute('id', `${city.Key}`);

                    radioDiv.appendChild(cityRadio);
                    radioDiv.appendChild(cityLabel);
                    
                    weatherApp.allRadioButtons.appendChild(radioDiv);
                })

                weatherApp.citySearchDiv.appendChild(weatherApp.allRadioButtons);
                
                // group all the radio buttons together in the variable radioGroup
                const radioGroup = document.querySelectorAll('input[name="multipleCities"]')

                // when Enter key is pressed call getCityWeather function and pass in the location data for the city which the user selected with a radio button
                for (let i = 0; i < radioGroup.length; i++) {
                    // created event listener for each radio button that will prevent the default submit action when the enter key was press
                    radioGroup[i].addEventListener('keypress', function (event) {
                        if (event.keyCode === 13) {

                            event.preventDefault();
                            weatherApp.getCityWeather(citySearchResult[i]);
                        }  
                    }) 
                    // created another event listener when user selects radio button, getCityWeather will run.
                    radioGroup[i].addEventListener('change', function () {
                        weatherApp.getCityWeather(citySearchResult[i]);
                    })   
                }

            }
        })
        // error handling
        .catch((error) => {
            weatherApp.errorHandler(error);
        });
}
// ** ---------FUNCTION FOR SEARCHING FOR A CITY ENDS ---------** //


// **---------FUNCTION TO GET THE WEATHER DATA OF A SEARCHED CITY--------- ** //
weatherApp.getCityWeather = (cityData) => {
    // get the location data which was passed into this function when called and get the location Key
    // make the API call for weather data for a particular city with the location Key
    weatherApp.cityWeatherURL = new URL(`https://dataservice.accuweather.com/currentconditions/v1/${cityData.Key}`);
    weatherApp.cityWeatherURL.search = new URLSearchParams ({
        apikey: weatherApp.apiKey
    })

    fetch(weatherApp.cityWeatherURL)
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                // error handling
                throw new Error(error);
            }
        })
        .then((cityWeather) => {
            // the API result contains weatherData, we have to attach city name and country information to the weatherData
            cityWeather[0].Country = cityData.Country;
            cityWeather[0].EnglishName = cityData.EnglishName;

            // call the displayWeatherStats with the city name and weather data
            weatherApp.displayWeatherStats(cityData.EnglishName, cityWeather);
        })
        // error handling
        .catch((error) => {
            weatherApp.errorHandler(error);
        });
}
// **---------FUNCTION TO GET THE WEATHER DATA OF A CITY ENDS --------- ** //


// ** ---------FUNCTION FOR DISPLAYING WEATHER STATS ---------** //
// this function will display the weather stats for the users selected city or random city or their searched city
weatherApp.displayWeatherStats = (passedCity, weatherData) => {
   
    // clear existing data and show the MORE OPTIONS button
    weatherApp.clearData()
    
    // loop through the weatherData to find weather data for users selected city
    weatherData.forEach(city => {
        if (passedCity === city.EnglishName) {

            // get the city's weather data and store it in the weatherApp object
            weatherApp.currentTemp = `${city.Temperature.Metric.Value} ${city.Temperature.Metric.Unit}`;
            weatherApp.fahrenheit = `${city.Temperature.Imperial.Value} ${city.Temperature.Imperial.Unit}`;
            weatherApp.currentWeatherText = city.WeatherText;
            weatherApp.weatherIcon = city.WeatherIcon;

            // get the city's geographical information
            weatherApp.cityName = city.EnglishName;
            weatherApp.countryName = city.Country.EnglishName;
            weatherApp.countryId = city.Country.ID;        
        }
    });
   
    // target the ul which will display weather information and clear it
    weatherApp.ul = document.querySelector('#weatherStats');
    weatherApp.ul.innerHTML = "";
   
    // create child li elements for displaying weather data
    weatherApp.tempLi = document.createElement('li');
    const weatherTextLi = document.createElement('li');
    const precipitationLi = document.createElement('li');
    
    // create img element for weather icon
    const displayIcon = document.createElement('img');
    displayIcon.setAttribute('src', `./assets/${weatherApp.weatherIcon}.png`);
    displayIcon.setAttribute('alt', `Weather is ${weatherApp.currentWeatherText} icon`);
    
    // add the weather data to the list elements
    weatherApp.tempLi.innerText = weatherApp.currentTemp;
    weatherTextLi.innerText = weatherApp.currentWeatherText;

    // append the li elements to the ul
    weatherApp.ul.appendChild(weatherApp.tempLi);
    weatherApp.ul.appendChild(weatherTextLi);
    weatherApp.ul.appendChild(precipitationLi);
    precipitationLi.appendChild(displayIcon);
   
    // create a button to convert celsius to fahrenheit
    weatherApp.convertButton = document.createElement('button');

    // add a class & Id attribute, & text to the convertButton
    weatherApp.convertButton.setAttribute('class', 'convert');
    weatherApp.convertButton.setAttribute('id', 'convert');
    weatherApp.convertButton.innerText = "Convert to ℉";

    // append convert button
    weatherApp.div.appendChild(weatherApp.convertButton);

    // add an event listener when user clicks on the convert button and
    // run a function that converts the temp to fahrenheit
    weatherApp.convertButton.addEventListener('click', function (event) {

        event.preventDefault();
        // Changing the temperature from celsius to fahrenheit
        weatherApp.tempLi.innerText = weatherApp.fahrenheit;
            // text on button will change to "convert to c" when user clicks on the "convert to F" button and will change to imperial value and back to metric
        if (weatherApp.convertButton.innerText === "Convert to ℉") {
            weatherApp.convertButton.innerText = "Convert to ℃";
        } else {
            weatherApp.convertButton.innerText = "Convert to ℉";
            weatherApp.tempLi.innerText = weatherApp.currentTemp;
        };
    });

    // create img element for country flag using the flagsapi website and add it to the page
    const flag = document.createElement('img')
    flag.setAttribute('src', `https://flagsapi.com/${weatherApp.countryId}/shiny/64.png`)
    flag.setAttribute('alt', `Flag of ${weatherApp.countryName}`)

    weatherApp.cityFlagDiv.appendChild(flag);

    // create a h3 element which will display city name and add it to the page
    const nameOfCity = document.createElement('h3');
    nameOfCity.innerText = weatherApp.cityName;

    weatherApp.cityFlagDiv.appendChild(nameOfCity);

    //makes the weather stats scroll in to view
    weatherApp.cityFlagDiv.scrollIntoView();

}
// ** ---------FUNCTION FOR DISPLAYING WEATHER STATS ENDS ---------** //


// ** ---------FUNCTION THAT CLEARS DATA FROM THE PAGE ---------** //
weatherApp.clearData = () => {
    // clear existing data and show the MORE OPTIONS button
    weatherApp.cityFlagDiv.innerHTML = "";
    weatherApp.div.innerHTML = "";
    if (weatherApp.citySearchDiv) {
        weatherApp.citySearchDiv.innerHTML = "";
    }

    weatherApp.moreOptions.style.display = "block";
}
// ** ---------FUNCTION THAT CLEARS DATA FROM THE PAGE ENDS ---------** //


// ** ---------ERROR HANDLING FUNCTION STARTS ---------** //
// this function handles potential errors
weatherApp.errorHandler = (error) => {
    if (error.name === "TypeError") {
        alert("We apologize! WeatherApp is currently down. Try again after 24 hours!");
    } else {
        alert("Oops! We apologize, something went wrong! Try again later");
    }
}
// ** ---------ERROR HANDLING FUNCTION ENDS ---------** //


//** --------- ATTACHED ALL THE EVENT LISTENERS TO THIS FUNCTION BELOW ---------**//

weatherApp.allEventListeners = () => {
    // ** ---------SUBMIT BUTTON EVENT LISTENER ---------** //

    // target the "Submit" button
    const submitButton = document.querySelector('#submit');

    // add event listener to the "Submit" button
    submitButton.addEventListener('click', function (event) {

        event.preventDefault();
        
        // clear existing data and show the MORE OPTIONS button
        weatherApp.clearData();
        
        // find out which city user has selected from drop down menu
        weatherApp.userCity = weatherApp.dropDown.value;

        // call the display weather stats function with the users selected city
        // if they haven't chosen a city, alert the user to select a city
        if (weatherApp.userCity === "choose") {
            alert("Select a city from the dropdown menu");
        } else {
            weatherApp.displayWeatherStats(weatherApp.userCity, weatherApp.weatherData);
        }
    });
    // ** ---------SUBMIT BUTTON EVENT LISTENER ENDS---------** //


    // **--------- RANDOM BUTTON EVENT LISTENER  ---------**//

    // target the 'random' button
    const randomButton = document.querySelector('#random');

    // create an event listener
    randomButton.addEventListener('click', function (event) {
        
        event.preventDefault();
        
        // clear existing data and show the MORE OPTIONS button
        weatherApp.clearData();
        
        // generate a random number to select a random city from the list of 50 cities
        weatherApp.randomNum = Math.floor(Math.random() * 50);

        // select a random city based on the random number
        weatherApp.randomCity = weatherApp.weatherData[weatherApp.randomNum].EnglishName;

        // when user clicks on random button, city select drop down should return to default
        weatherApp.dropDown.value = "choose";

        // call the display weather stats function with random city
        weatherApp.displayWeatherStats(weatherApp.randomCity, weatherApp.weatherData);
    });
// **--------- RANDOM BUTTON EVENT LISTENER ENDS--------- ** //
  

// **--------- MORE OPTIONS BUTTON EVENT LISTENER--------- ** //
    
    // target the 'More Options' button
    weatherApp.moreOptions = document.querySelector('.moreOptions')
    
    // create an event listener
    weatherApp.moreOptions.addEventListener('click', function (event) {

        event.preventDefault();

        // when More Options button is clicked, it will be hidden
        weatherApp.moreOptions.style.display = "none";

        // create a paragraph with instructions, a dropdown menu with all the countries
        // and an input with type text for user to enter a city name and click the City Search button
        // target the citySearch div element to contain the above elements
        weatherApp.citySearchDiv = document.querySelector('.citySearch');

        // paragraph element creation and appending
        const citySearchP = document.createElement('p');
        
        citySearchP.innerText = "Type the name of a city in the search bar below and select a country from the dropdown menu to get the weather forecast for any city in the world.";

        citySearchP.setAttribute('class', 'searchInstructions');
        weatherApp.citySearchDiv.appendChild(citySearchP);


        // select element creation with a "Choose country " option element appending
        weatherApp.countrySelect = document.createElement('select');
        const cityOptionDefault = document.createElement('option');
        cityOptionDefault.innerText = "Choose a country";
        cityOptionDefault.setAttribute("value", "choose");
        weatherApp.countrySelect.appendChild(cityOptionDefault);

        // looping through the country names and creating an option element for each country and appending it to the select element
        weatherApp.countryNames.forEach(country => {
            const countryOption = document.createElement('option');
            countryOption.innerText = country;
            countryOption.setAttribute("value", country);
            weatherApp.countrySelect.appendChild(countryOption);
        })

        // create and append a label for the input search bar
        const citySearchLabel = document.createElement('label')
        citySearchLabel.innerText = "Enter a city name in the search bar:";
        citySearchLabel.setAttribute('for', 'citySearchBar');
        weatherApp.citySearchDiv.appendChild(citySearchLabel);

        // create and apppend the input search bar
        weatherApp.citySearchBar = document.createElement('input');
        weatherApp.citySearchBar.setAttribute('id', "citySearchBar");
        weatherApp.citySearchBar.setAttribute('type', "text");
        weatherApp.citySearchBar.setAttribute('placeholder', "City Name");
        weatherApp.citySearchDiv.appendChild(weatherApp.citySearchBar);

        // append the select element to the parent div
        weatherApp.citySearchDiv.appendChild(weatherApp.countrySelect)

        // create a city search button and append it to the div
        weatherApp.citySearchButton = document.createElement('button');
        weatherApp.citySearchButton.setAttribute('id', 'citySearchButton');
        weatherApp.citySearchButton.setAttribute('type', 'submit');
        weatherApp.citySearchButton.innerText = "City Search"
        weatherApp.citySearchDiv.appendChild(weatherApp.citySearchButton);

// **--------- MORE OPTIONS BUTTON EVENT LISTENER ENDS---------** //

    // **---------INPUT EVENT LISTENER STARTS---------** //
        weatherApp.citySearchBar.addEventListener('keypress', function (event) {
            // this listener will run when "Enter" key is pressed
            if (event.keyCode === 13) {
                
                event.preventDefault();
                // making sure the user selects a country and enters a city name in the input field
                if (weatherApp.citySearchBar.value === "") {
                    alert("Enter a city name in the search bar");
                } else if (weatherApp.countrySelect.value === "choose") {
                    alert("Select a country from the dropdown menu");
                } else {
                    // clear any radio buttons if they exist and call the citySearch function
                    if (weatherApp.allRadioButtons) {
                        weatherApp.allRadioButtons.innerHTML = "";
                        weatherApp.searchCity(weatherApp.citySearchBar.value, weatherApp.countrySelect.value)
                    } else {
                        weatherApp.searchCity(weatherApp.citySearchBar.value, weatherApp.countrySelect.value)
                    }
                }
                
            }
        });
    // **---------INPUT LISTENER ENDS---------** //

    // **--------- CITY SEARCH BUTTON EVENT LISTENER STARTS--------- ** //
        weatherApp.citySearchButton.addEventListener('click', function (event) {

            event.preventDefault();

            // get the city name from the input and the country name from the dropdown menu and call the searchCity function
            // if either the country name is not selected or city name is not entered, alert the user to do so
            if (weatherApp.citySearchBar.value === "") {
                alert("Enter a city name in the search bar");
            } else if (weatherApp.countrySelect.value === "choose") {
                alert("Select a country from the dropdown menu");
            } else {
                // clear any radio buttons if they exist and call the citySearch function
                if (weatherApp.allRadioButtons) {
                    weatherApp.allRadioButtons.innerHTML = "";
                    weatherApp.searchCity(weatherApp.citySearchBar.value, weatherApp.countrySelect.value)
                } else {
                    weatherApp.searchCity(weatherApp.citySearchBar.value, weatherApp.countrySelect.value)
                }
            }

            // when user clicks on city search button, city select drop down should return to default
            weatherApp.dropDown.value = "choose";
        })
        // **--------- CITY SEARCH BUTTON EVENT LISTENER ENDS--------- ** //
    })

}

// **---------END OF ALL THE EVENT LISTENERS FUNCTION ---------**//


// create an init method
weatherApp.init = () => {

    //call the getCities function to populate the dropdown menu with all the city names
    weatherApp.getCities();

    //call the getCountries function to get all countries
    weatherApp.getCountries();

    // target city select element
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