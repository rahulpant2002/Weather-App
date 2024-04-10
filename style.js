const yourWeatherTab = document.querySelector('#currWeatherBtn');
const searchWeatherTab = document.querySelector('#searchWeatherBtn');

const weatherContainer = document.querySelector('.weatherContainer');
const grantConatiner = document.querySelector('.grantContainer');
const loadingScreen = document.querySelector('.loadingContainer');
const searchContainer = document.querySelector('.searchConatiner')
const weatherInfo = document.querySelector('.weatherInfo');
const error = document.querySelector('.error');

const impFact = document.querySelector('.impFact');
const cityNameContainer = document.querySelector('.cityNameConatiner');


const APIkey = '6e1e60090fe9f0e32589ea8481579213';
let currTab = yourWeatherTab;
getFromStorage();
currTab.classList.add('current-tab');
currTab.classList.add('active');

function renderWeatherInfo(currentWeather){
    const cityName = document.querySelector('.cityName');
    const flag = document.querySelector('.flag');
    const weatherType = document.querySelector('.weatherType');
    const weatherImg = document.querySelector('.weatherImg');
    const temperature = document.querySelector('.temperature');
    const wsVal = document.querySelector('.wsVal');
    const hdtVal = document.querySelector('.hdtVal');
    const cldVal = document.querySelector('.cldVal');

    cityName.innerText = currentWeather?.name;
    flag.src = `https://flagsapi.com/${currentWeather?.sys?.country}/flat/64.png`
    weatherType.innerText = currentWeather?.weather?.[0]?.description;
    weatherImg.src = `https://openweathermap.org/img/w/${currentWeather?.weather?.[0]?.icon}.png`;
    temperature.innerText = `${currentWeather?.main?.temp} °C`;
    wsVal.innerText = `${currentWeather?.wind?.speed} m/sec`;
    hdtVal.innerText = `${currentWeather?.main?.humidity}%`;
    cldVal.innerText = `${currentWeather?.clouds?.all}%`;
}

async function fetchDetails(coordinates){
    const {lat, long} = coordinates;

    grantConatiner.classList.remove('active');
    loadingScreen.classList.add('active');

    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${APIkey}&units=metric`);
        const result = await response.json();
        if(result.cod=='404'){
            throw new Error('');
        }

        loadingScreen.classList.remove('active');
        error.classList.remove('active');
        weatherInfo.classList.add('active');
        renderWeatherInfo(result);
    }
    catch(e){
        loadingScreen.classList.remove('active');
        weatherInfo.classList.remove('active');
        error.classList.add('active');
    }
}

function getFromStorage(){
    const localCoordinates = sessionStorage.getItem('user-coordinates');
    if(!localCoordinates){
        grantConatiner.classList.add('active');
    }
    else{
        const myCoordinates = JSON.parse(localCoordinates);
        fetchDetails(myCoordinates);
    }
}

function switchTab(clickedTab){
    if(clickedTab==currTab){
        return;
    }

    currTab.classList.remove('current-tab');
    currTab = clickedTab;
    currTab.classList.add('current-tab');
    error.classList.remove('active');

    if(currTab==yourWeatherTab){
        searchContainer.classList.remove('active');
        weatherInfo.classList.remove('active');
        getFromStorage();
    }

    else{
        weatherInfo.classList.remove('active');
        grantConatiner.classList.remove('active'); 
        searchContainer.classList.add('active');
    }
}

yourWeatherTab.addEventListener('click', function(){
    switchTab(yourWeatherTab);
})
searchWeatherTab.addEventListener('click', function(){
    switchTab(searchWeatherTab);
}) 


function showPosition(position){
    const coordinates = {
        lat : position.coords.latitude,
        long: position.coords.longitude,
    }
    sessionStorage.setItem('user-coordinates', JSON.stringify(coordinates));

    fetchDetails(coordinates);
}
function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        alert('Geolocation is not supported by this browser');
    }
}
const grantAccessBtn = document.querySelector('.grantAccessBtn');
grantAccessBtn.addEventListener('click', getLocation)

const city = document.querySelector('.city');
city.addEventListener('keypress', function(e){
    if(e.key==='Enter'){
        myFunction();
    }
});
async function searchCityWeather(city){
    loadingScreen.classList.add('active');
    weatherInfo.classList.remove('active');
    grantConatiner.classList.remove('active');
    error.classList.remove('active');

    try{
        let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIkey}&units=metric`);
        let result = await response.json();

        console.log(result);
        if(result.cod=='404'){
            throw new Error('');
        }

        loadingScreen.classList.remove('active');
        weatherInfo.classList.add('active');
        renderWeatherInfo(result);
    }
    catch(e){
        loadingScreen.classList.remove('active');
        weatherInfo.classList.remove('active');
        error.classList.add('active');
    }
}

function myFunction(){
    let cityName = city.value;
    if(cityName === '') return;

    searchCityWeather(cityName);
}