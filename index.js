const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");

const userContainer = document.querySelector(".weather-container");
const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");

const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");
const errorFound = document.querySelector(".err");

let currentTab = userTab;
const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";
currentTab.classList.add("current-tab"); 
getfromSessionStorage();

function switchTab(clickedTab){
    if(clickedTab!==currentTab)
    {
        currentTab.classList.remove("current-tab");        
        currentTab = clickedTab;
        currentTab.classList.add("current-tab");

        if(currentTab===userTab){
            userInfoContainer.classList.remove("active");
            searchForm.classList.remove("active");
            getfromSessionStorage();
        }else{
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
            errorFound.classList.remove('active');
        }
    }
}


userTab.addEventListener('click',()=>{
    switchTab(userTab);
})

searchTab.addEventListener('click',()=>{
    switchTab(searchTab);
})



function getfromSessionStorage(){
    const localCoordinates = sessionStorage.getItem('user-coordinates');
    if(!localCoordinates){
        grantAccessContainer.classList.add("active");
    }else{
        const coordinates = JSON.parse(localCoordinates);   //string to object
        fetchUserWeatherInfo(coordinates);
    }
}



async function fetchUserWeatherInfo(coordinates){
    const {lat,long} = coordinates;

    grantAccessContainer.classList.remove("active");
    loadingScreen.classList.add("active");

    //API Call
    try{
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${API_KEY}&units=metric`
          );
        const data = await response.json();

        loadingScreen.classList.remove('active');
        userInfoContainer.classList.add('active');
        renderWeatherInfo(data);
    }
    catch{
        loadingScreen.classList.remove('active');
        errorFound.classList.add('active');
        userInfoContainer.classList.remove('active');
    }   
}



function renderWeatherInfo(weatherInfo){
    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");


    //fetch values from weatherINfo object and put it UI elements
    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp} °C`;
    windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity}%`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;
}



function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
}

function showPosition(position){
    const userCoordinates = {
        lat: position.coords.latitude,
        long: position.coords.longitude
    }
    sessionStorage.setItem('user-coordinates',JSON.stringify(userCoordinates));
    // fetchUserWeatherInfo(userCoordinates);
    getfromSessionStorage();
}

const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click",getLocation);


const searchInput = document.querySelector("[data-searchInput]");

searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let cityName = searchInput.value;

    if(cityName === "")
        return;
    else 
        fetchSearchWeatherInfo(cityName);
})


async function fetchSearchWeatherInfo(city) {
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
          );
        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err) {
        errorFound.classList.add('active');
        userInfoContainer.classList.remove('active');
    }
}

function getLocation() {
    console.log("Grant button clicked");
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

function getLocation() {
    console.log("Trying to get location...");
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError, {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

function showError(error) {
    console.warn("Geolocation error:", error);
    alert("Failed to fetch location. Using fallback.");

    // fallback to default city (e.g., Delhi)
    const fallbackCoordinates = {
        lat: 	26.9136,
        long: 	75.7858
    };
    sessionStorage.setItem('user-coordinates', JSON.stringify(fallbackCoordinates));
    getfromSessionStorage();
}



