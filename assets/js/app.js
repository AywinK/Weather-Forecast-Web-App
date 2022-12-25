
// get value from search
var submitBtn = $("#searchContainer");

submitBtn.submit(getsSearchVal);

function getsSearchVal(e) {
    e.preventDefault();
    var userInput = $("input[type=text]");
    var cityVal = userInput.val();
    console.log(cityVal);
    userInput.val(``);
    if (cityVal) {
        getAPIData(getCityInput(cityVal));
    };

};

// filter out city and country

function getCityInput(cityVal) {
    var cityArr = cityVal.split(",");
    console.log(cityArr);
    // if (!cityArr[1]) {
    //     cityArr[1] = "gb";
    // }

    function includesCountry(country) {
        if (country) {
            return country.trim();
        } else if (!country) {
            return ""
        }
    }

    // function capitaliseCity(city) {
    //     return (city[0].toUpperCase() + city.slice(1)).trim()
    // };

    var cityObj = {
        city: cityArr[0].trim(),
        country: includesCountry(cityArr[1])
    }

    return cityObj
};

function getAPIData(cityObj) {
    var baseURL = "https://api.openweathermap.org/data/2.5/";
    var currentURL = baseURL + `weather?appid=${apiKey}&units=metric`;
    var forecastURL = baseURL + `forecast?appid=${apiKey}&units=metric`;
    var iconURL = "https://openweathermap.org/img/w/";
    var cityObj = cityObj;

    (function inputsubmitted() {
        $.get(currentURL + `&q=${cityObj.city},${cityObj.country}`)
            .then(function (currentDataObj) {
                console.log(currentDataObj);
                if (currentDataObj) {
                    generateCurrent(currentDataObj, iconURL);
                    // call function to add to history here
                    addsToHistory(currentDataObj);
                    getForecast(currentDataObj);
                }
            })
    }());

    function getForecast(currentDataObj) {
        $.get(forecastURL + `&lat=${currentDataObj.coord.lat}&lon=${currentDataObj.coord.lon}`)
            .then(function (forecastDataObj) {
                console.log(forecastDataObj);
                if (forecastDataObj) {
                    generateCarousel(forecastDataObj, iconURL);
                }
            })
    };
};

function generateCurrent(currentDataObj, iconURL) {

    var currentSection = $("#currentWeather")
    // HTML includes refresh button that is hidden so OpenWeather API is not spammed with requests
    var currentHTML = `<div class="container-fluid">
    <div class="row">
        <div class="col-10 d-flex my-1 align-items-center">
            <i class="fa-solid fa-location-arrow fs-6 text-center mb-2 mx-1"></i>
            <p id="currentCity">${currentDataObj.name} (${currentDataObj.sys.country})</p>
        </div>
        <button class="col mt-2 p-1 hidden">
        <i class="fa-solid fa-rotate" id="refreshBtn"></i>
        </button>
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
    currentSection.addClass("customBorder")

    // remove hidden class from current section HTML generation on refreshBtn to show btn on app
    $("#refreshBtn").click(function () {
        var cityObj = {
            city: currentDataObj.name,
            country: currentDataObj.sys.country
        }
        getAPIData(cityObj)
    });
};

function generateCarousel(forecastDataObj, iconURL) {
    var forecastSection = $("#fiveDayForecast")
    var carouselHTML = `            
    <div class="carousel d-flex justify-content-center text-center overflow-hiddden mb-2" id="carousel">
    </div> <!-- carousel end closing tag-->

    <div class="d-flex justify-content-center fs-1 mb-2 text-center">
        <i class="fa-solid fa-circle-chevron-left mx-5" id="prev"></i>
        <i class="fa-solid fa-circle-chevron-right mx-5" id="next"></i>
    </div>
    `
    forecastSection.html(carouselHTML);

    function generateSlide(forecastObj) {
        var carouselEl = $("#carousel");
        var slideHTML = `
        <div class="slide d-flex flex-column justify-content-center align-items-center my-3">
            <p>${moment.unix(forecastObj.dt).format("DD/MM[\n]HH:mm")}</p>
            <img src="${iconURL + forecastObj.weather[0].icon}.png" alt="${forecastObj.weather[0].description}">
            <div class="container">
                <p class="square py-2 fs-4">${Math.round(forecastObj.main.temp)}&#176</p>
                <p class="fs-5">${forecastObj.main.humidity}%</p>
            </div>
        </div>
        `
        carouselEl.append(slideHTML);
    };

    for (var forecastObj of forecastDataObj.list) {
        generateSlide(forecastObj);
    };
    forecastSection.addClass("customBorder");


    // carousel logic and initial positioning function call

    var slideWidth = $(".slide").innerWidth();
    var carouselWidth = $(".carousel").innerWidth();
    var hiddenWidth = slideWidth * ($(".slide").length) - carouselWidth;
    var maxRightPosition = hiddenWidth / 2 + slideWidth;
    var maxLeftPosition = maxRightPosition - hiddenWidth;
    var prevBtn = $("#prev");
    var nextBtn = $("#next");

    console.log([slideWidth, carouselWidth, hiddenWidth, maxRightPosition, maxLeftPosition]);

    // call to initial position during carousel generation
    function resetCarouselPositionLeft() {
        $(".carousel").animate({ "right": `${maxLeftPosition}px` }, "fast");
        prevBtn.addClass("hidden");
    };

    resetCarouselPositionLeft();

    function resetCarouselPositionRight() {
        $(".carousel").animate({ "right": `${maxRightPosition}px` }, "fast");
        nextBtn.addClass("hidden");
    }

    function currentPosition() {
        function pxStr2Num(str) {
            return parseFloat(str.split("p")[0])
        };

        return pxStr2Num($(".carousel").css("right"));
    }

    function toPrev() {
        var calculatedPosition = currentPosition() - carouselWidth;
        var invalidPosition = (calculatedPosition <= maxLeftPosition);

        if (invalidPosition) {
            resetCarouselPositionLeft();
        } else if (!invalidPosition) {
            $(".carousel").animate({ "right": `${calculatedPosition + slideWidth}px` }, "fast");
        } if (nextBtn.hasClass("hidden")) {
            nextBtn.removeClass("hidden");
        }
    };

    function toNext() {
        var calculatedPosition = currentPosition() + carouselWidth;
        var invalidPosition = (calculatedPosition >= maxRightPosition);

        if (invalidPosition) {
            resetCarouselPositionRight();
        } else if (!invalidPosition) {
            $(".carousel").animate({ "right": `${calculatedPosition - slideWidth}px` }, "fast");
        } if (prevBtn.hasClass("hidden")) {
            prevBtn.removeClass("hidden");
        }
    };

    $("#prev").click(toPrev);
    $("#next").click(toNext);

};
function getsHistory() {
    return JSON.parse(localStorage.getItem("citiesUserData")) || [];
};

function savesHistory(arr) {
    localStorage.setItem("citiesUserData", JSON.stringify(arr));
};

function addsToHistory(currentDataObj) {
    var citiesUserData = getsHistory();
    var newValidInput = currentDataObj.name + ", " + currentDataObj.sys.country;
    if (!citiesUserData.includes(newValidInput)) {
        citiesUserData.push(newValidInput);
        savesHistory(citiesUserData);
        $("#search[type=text]").autocomplete({
            source: getsHistory().reverse(),
        });
    }
};

$("#search[type=text]").autocomplete({
    source: getsHistory().reverse(),

}, {
    minLength: 0,
    delay: 0
});

$("#search[type=text]").focus(function () {
    $("#search[type=text]").autocomplete("search", "");
});

// maxRight = (21*slide)-carousel/2;
// maxLeft = (-19*slide)+carousel/2;

$("#clearBtn").click(function () {
    setTimeout(function () {
        var userConfirms = confirm("This will clear your search history and reload the page. Press cancel to go back.\nAre you sure?")
        if (userConfirms) {
            localStorage.removeItem("citiesUserData");
            location.reload();
        };
    }, 100);
})