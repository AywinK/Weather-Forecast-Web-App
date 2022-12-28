// ===========================================GLOBAL FUNCTIONS===================================================================

// gets user input on selection from autocomplete after autocomplete closes (default JQuery behaviour) | ui parameter is just an empty placeholder
function onAutocompleteClose(event, ui) {
    if (event.currentTarget) {
        var currentSection = $("#currentWeather");
        var forecastSection = $("#fiveDayForecast");
        currentSection.html(``);
        forecastSection.html(``);
        getsSearchVal();
    }
}
// gets user input value from search text field
function getsSearchVal(e) {
    // if from submit action
    if (e) {
        e.preventDefault();
    };

    var userInput = $("input[type=text]");
    var cityVal = userInput.val();
    userInput.val(``);
    if (cityVal) {
        getAPIData(getCityInput(cityVal));
    };
    $(':focus').blur();

};

// filter out city and country (tidies up input)
function getCityInput(cityVal) {
    var cityArr = cityVal.split(",");

    function includesCountry(country) {
        if (country) {
            return country.trim();
        } else if (!country) {
            return ""
        }
    }

    var cityObj = {
        city: cityArr[0].trim(),
        country: includesCountry(cityArr[1])
    }

    return cityObj
};

// gets data from API based on user input, and calls functions to add data to webpage and also save to history
function getAPIData(cityObj) {
    var baseURL = "https://api.openweathermap.org/data/2.5/";
    var currentURL = baseURL + `weather?appid=${apiKey}&units=metric`;
    var forecastURL = baseURL + `forecast?appid=${apiKey}&units=metric`;
    var iconURL = "https://openweathermap.org/img/w/";
    var cityObj = cityObj;

    $.get(currentURL + `&q=${cityObj.city},${cityObj.country}`)
        .then(function (currentDataObj) {
            if (currentDataObj) {
                generateCurrent(currentDataObj, iconURL);
                // call function to add to history here
                addsToHistory(currentDataObj);
                getForecast(currentDataObj);
            }
        })
        .fail(function () {
            alert("Unable to find city.");
        });

    // function called after server responds with valid object
    function getForecast(currentDataObj) {
        $.get(forecastURL + `&lat=${currentDataObj.coord.lat}&lon=${currentDataObj.coord.lon}`)
            .then(function (forecastDataObj) {
                if (forecastDataObj) {
                    generateCarousel(forecastDataObj, iconURL);
                }
            })
    };
};

// creates section with current weather. includes refresh button event listener - currently hidden
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
    currentSection.addClass("customBorder") //styling

    // remove hidden class from current section HTML generation on refreshBtn to show btn on app
    $("#refreshBtn").click(function () {
        var cityObj = {
            city: currentDataObj.name,
            country: currentDataObj.sys.country
        }
        getAPIData(cityObj)
    });
};

// generates five day forecast section
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

    // generates individual slides for each data point
    function generateSlide(forecastObj) {
        var carouselEl = $("#carousel");
        var slideHTML = `
        <div class="slide d-flex flex-column justify-content-center align-items-center my-3">
            <p>${moment.unix(forecastObj.dt).format("DD/MM[\n]HH:mm")}</p>
            <img src="${iconURL + forecastObj.weather[0].icon}.png" alt="${forecastObj.weather[0].description}">
            <div class="container">
                <p class="square py-2 fs-4">${Math.round(forecastObj.main.temp)}&#176</p>
                <p class="fs-5 mt-1">${forecastObj.main.humidity}%</p>
                <p class="d-flex justify-content-evenly">
                    <i class="fa-solid fa-wind fs-6 pt-1"></i>
                    <span>${Math.round(forecastObj.wind.speed)}</span>
                </p>
            </div>
        </div>
        `;

        carouselEl.append(slideHTML);
    };

    for (var forecastObj of forecastDataObj.list) {
        generateSlide(forecastObj);
    };

    forecastSection.addClass("customBorder"); // styling


    // carousel logic and initial positioning function call return
    function carouselLogic(e) {
        var slideWidth = $(".slide").innerWidth();
        var carouselWidth = $(".carousel").innerWidth();
        var hiddenWidth = slideWidth * ($(".slide").length) - carouselWidth;
        var maxRightPosition = hiddenWidth / 2 + slideWidth;
        var maxLeftPosition = maxRightPosition - hiddenWidth;
        var prevBtn = $("#prev");
        var nextBtn = $("#next");

        function resetCarouselPositionLeft() {
            $(".carousel").animate({ "right": `${maxLeftPosition}px` }, "fast");
            prevBtn.addClass("hidden");
        };

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

        if (e) {
            if ($(e.target).is("#prev")) {
                toPrev();
            } if ($(e.target).is("#next")) {
                toNext();
            }
        }

        return { resetCarouselPositionLeft: resetCarouselPositionLeft }
    }

    $("#prev, #next").click(carouselLogic);

    // initial positioning of carousel
    carouselLogic().resetCarouselPositionLeft();

};

// gets history from local storage
function getsHistory() {
    return JSON.parse(localStorage.getItem("citiesUserData")) || [];
};

// saves history to local storage
function savesHistory(arr) {
    localStorage.setItem("citiesUserData", JSON.stringify(arr));
};

// adds valid search term to history array
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

// ===========================================EVENT LISTENERS/METHODS ON PAGE LOAD===================================================================

// gets value from form submit
$("#searchContainer").submit(getsSearchVal);

// adds initial autocomplete jquery UI including opening dropdown on textbox focus 
var searchTextBoxEl = $("#search[type=text]");

searchTextBoxEl.autocomplete({
    source: getsHistory().reverse(),
    close: onAutocompleteClose
}, {
    minLength: 0,
    delay: 0
});

searchTextBoxEl.focus(function () {
    searchTextBoxEl.autocomplete("search", "");
});

// clears stored history data
$("#clearBtn").click(function () {
    setTimeout(function () {
        var userConfirms = confirm("This will clear your search history and reload the page. Press cancel to go back.\nAre you sure?")
        if (userConfirms) {
            localStorage.removeItem("citiesUserData");
            location.reload();
        };
    }, 100);
})