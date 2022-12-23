
// get value from search
var submitBtn = $("#searchContainer");

submitBtn.submit(getsSearchVal);

function getsSearchVal(e) {
    e.preventDefault();
    var cityVal = $("input").first().val();
    console.log(cityVal)
    getAPIData(getCityInput(cityVal));
};

// filter out city and country

function getCityInput(cityVal) {
    var cityArr = cityVal.split(",");
    console.log(cityArr);
    if (!cityArr[1]) {
        cityArr[1] = "gb";
    }

    function capitaliseCity(city) {
        return (city[0].toUpperCase() + city.slice(1)).trim()
    };

    var cityObj = {
        city: capitaliseCity(cityArr[0].trim()),
        country: cityArr[1].trim().toUpperCase(),
    }

    return cityObj
};

function getAPIData(cityObj) {
    var baseURL = "https://api.openweathermap.org/data/2.5/";
    var currentURL = baseURL + `weather?appid=${apiKey}&units=metric`;
    var forecastURL = baseURL + `forecast?appid=${apiKey}&units=metric`;
    var iconURL = "https://openweathermap.org/img/w/";
    var cityObj = cityObj;

    var currentDataObj = (function inputsubmitted() {
        $.get(currentURL + `&q=${cityObj.city},${cityObj.country}`)
            .then(function (currentDataObj) {
                console.log(currentDataObj);
                if (currentDataObj) {
                    generateCurrent(currentDataObj, cityObj, iconURL);
                    // call function to add to history here
                    getForecast(currentDataObj);
                }
            })
    }());

    function getForecast(currentDataObj) {
        $.get(forecastURL + `&lat=${currentDataObj.coord.lat}&lon=${currentDataObj.coord.lon}`)
        .then(function (forecastDataObj) {
            console.log(forecastDataObj);
            if (forecastDataObj) {

            }
        })
    };
};

function generateCurrent(currentDataObj, cityObj, iconURL) {
    // var currentCity = $("#currentCity");
    // var currentTemp = $("#currentTemp");
    // var currentHumidity = $("#currentHumidity");
    // var currentWind = $("#currentWind");
    // var currentIcon = $("#currentIcon");
    // var currentDate = $("#currentDate");

    // currentCity.text(cityObj.city + ` (${currentDataObj.sys.country})`);
    // currentTemp.text(Math.round(currentDataObj.main.temp));
    // currentHumidity.text(currentDataObj.main.humidity);
    // currentWind.text(Math.round(currentDataObj.wind.speed));
    // currentIcon.attr({
    //     "src": iconURL + `${currentDataObj.weather[0].icon}.png`,
    //     "alt": `${currentDataObj.weather[0].description}`
    // })
    // currentDate.text(moment().format("Do MMM YY"))

    var currentSection = $("#currentWeather")

    var currentHTML = `<div class="container-fluid">
    <div class="row">
        <div class="col-10 d-flex my-1 align-items-center">
            <i class="fa-solid fa-location-arrow fs-6 text-center mb-2 mx-1"></i>
            <p id="currentCity">${cityObj.city} (${currentDataObj.sys.country})</p>
        </div>
        <i class="fa-solid fa-rotate col mt-2 p-1" id="refreshBtn"></i>
    </div>
    <div class="row d-flex">
        <div class="col d-flex flex-column justify-content-center align-items-center">
            <p>
                <i class="fa-solid fa-temperature-three-quarters"></i>
                <span id="currentTemp">${Math.round(currentDataObj.main.temp)}</span>&#8451
            </p>
            <p>
                <i class="fa-solid fa-droplet"></i>
                <span id="currentHumidity">${currentDataObj.main.humidity}</span>%
            </p>
            <p>
                <i class="fa-solid fa-wind"></i>
                <span id="currentWind">${Math.round(currentDataObj.wind.speed)}</span>kph
            </p>
        </div>
        <div class="col d-flex flex-column align-items-end justify-content-between">
            <img src="${iconURL + currentDataObj.weather[0].icon}.png" alt="${currentDataObj.weather[0].description}" id="currentIcon">
            <p class="text-nowrap" id="currentDate">${moment().format("Do MMM YY")}</p>
        </div>
    </div>
</div>`;
currentSection.html(currentHTML);
}