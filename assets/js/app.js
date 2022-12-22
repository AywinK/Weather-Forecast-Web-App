
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
        return (city[0].toUpperCase() + city.slice(1))
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
    var cityObj = cityObj;

    (function inputsubmitted() {
        $.get(currentURL + `&q=${cityObj.city},${cityObj.country}`)
            .then(function (currentDataObj) {
                console.log(currentDataObj);
                if (currentDataObj) {
                    generateCurrent(currentDataObj, cityObj);
                }
            })
    }());
};

function generateCurrent(currentDataObj, cityObj) {
    var currentCity = $("#currentCity");
    var currentTemp = $("#currentTemp");
    var currentHumidity = $("#currentHumidity");
    var currentWind = $("#currentWind");
    var currentIcon = $("#currentIcon");
    var currentDate = $("#currentDate");

    var currentDataObj = currentDataObj;

    currentCity.text(cityObj.city + ` (${cityObj.country})`);
    currentTemp.text(Math.round(currentDataObj.main.temp));
    currentHumidity.text(currentDataObj.main.humidity);
    currentWind.text(Math.round(currentDataObj.wind.speed));
    currentIcon.attr({
        "src" : `https://openweathermap.org/img/w/${currentDataObj.weather[0].icon}.png`,
        "alt" : `${currentDataObj.weather[0].description}`
    })
    currentDate.text(moment().format("Do MMM YY"))
}