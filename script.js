  // create a weather app object
const weatherApp = {};

// obtain the api url & api key save in the weather object
weatherApp.apiUrl = "http://dataservice.accuweather.com/currentconditions/v1/topcities/50";
weatherApp.apiKey = "DwK5l1uPAjh4A3DfJSFThmsSvZD1jQKy"

// Make the api call & get the data for the top 50 cities.
weatherApp.getCities = () => {
    const url = new URL(weatherApp.apiUrl);
    url.search = new URLSearchParams({
        apikey: weatherApp.apiKey


    });

    fetch(url)
        .then((response) => {
            console.log(response);
            return response.json()
        })
        .then((jsonResult) => {
            // console.log(jsonResult);
            // create an empty array
        
            // retrive data from the array of object, property "EnglishName
            jsonResult.forEach(object => {
                // then add each city name to the array
                // console.log(object.EnglishName)
                // create child element for city
                const city = document.createElement('option');
                city.setAttribute('value', object.EnglishName);
                // add city name to the option element
                city.innerText = object.EnglishName;
                // target parent element
                const parentSelect = document.querySelector('select');
               // append child to select parent element
                parentSelect.appendChild(city);
               });
            })
    
}



   // create an init method
weatherApp.init = () => {
    weatherApp.getCities()
};
 
   
weatherApp.init(); // call the init method
 

            
            
            // create a drop menu
            // instructions for the user to select the city and click the submit button (add an event listener).
            // when the user clicks we get what city he has selected
            // go through the api data to display the temperature in celsius, weather text, has precipation and type of precipitation below the display button
            // if the user selects another city, the data below will cleared and new data will appear of the weather conditions of that chosen city
         

          