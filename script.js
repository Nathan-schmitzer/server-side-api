// create global functions
var APIKey = "4a50a883b83ed4afe5d51c5620f2b0a8";
var time = new Date();
var currentDate = time.getMonth() + 1 + "/" + time.getDate() + "/" + time.getFullYear();
$("#displayDate").text(currentDate);


var cityArr = [];

function renderCities() {
    if (cityArr.length >= 1) {
        $("#searchHistory").empty();
        
        for (var i = 0; i < cityArr.length; i++) {
            var liEl = $("<li>")
            liEl.attr("data-name", cityArr[i]);
            liEl.addClass("city list-group-item");
            if( i === 0){
                liEl.addClass("active");
            }
            liEl.text(cityArr[i]);
            $("#searchHistory").append(liEl);
        }
    } else {
        return;
    }
}

$(document).on("click", ".city", clickCity);



function clickCity(event) {
    event.stopPropagation();
    event.preventDefault();
    var cityVal = event.target.innerHTML;
    var cityValClass = $(this);
    searchCity(cityVal);
    updateClass(cityValClass);
};

// on click render cities you search. if nothing input, put nothing.
$("#search").on("click", function(event) {
    event.preventDefault();
    event.stopPropagation();
    var findNewCity = $("#inputSearch").val().trim();
    console.log(findNewCity);
    if(findNewCity === undefined || findNewCity === NaN || findNewCity === "") {
        return;
    };
    searchCity(findNewCity);
    renderCities();
});



function searchCity(findNewCity) {

    var queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${findNewCity}&units=imperial&appid=${APIKey}`;
    if(findNewCity === undefined || findNewCity === NaN || findNewCity === "") {
        return;
    }
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response){
        console.log(response);

        $("#city").text(findNewCity);
        $("#temp").text("Temperature: " + response.main.temp + "\u00B0F");
        $("#humidity").text("Humidity: " + response.main.humidity + "%");
        $("#windSpeed").text("Windspeed: " + response.wind.speed + " MPH");
        $("#uvIndex").text("UV Index " + "");

        var lat = response.coord.lat;
        var long = response.coord.lon;

        var getCoord = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&units=imperial&appid=${APIKey}`;
        $.ajax({
            url: getCoord,
            method: "GET"
        }).then(function(result){
            $("#forecast").empty();

            let uvIndexVal = result.current.uvi;
            if(uvIndexVal < 4) {
                $("#uvIndex").attr("style", "background-color: green");
            } else if (uvIndexVal > 4 && uvIndexVal < 6) {
                $("#uvIndex").attr("style", "backgorund-color: yellow");
            } else { $("#uvIndex").attr("style", "background-color: red"); };
            $("#uvIndex").text("UV Index: " + uvIndexVal);

            for (var x = 1; x < 6; x++) {
            let fiveDayTemp = result.daily[x].temp.day.toFixed(1);
                let fiveDayHumidity = result.daily[x].humidity;
                let fiveDayDate = result.daily[x].sunrise;
                let fiveDayWind = result.daily[x].wind_speed.toFixed(1);
                let fiveDayPic = result.daily[x].weather[0].icon;
                let fiveDayIcon = "http://openweathermap.org/img/wn/" + fiveDayPic + ".png";
                fiveDayDate = fiveDayDate * 1000;

                let dateObject = new Date(fiveDayDate);
                let humanDate = dateObject.toLocaleDateString();

                let divEl = $("<div>").addClass("card fiveDayCard").attr("style", "background-color: dodgerblue");
                let imageEl = $("<img>").addClass("fiveDayImage").attr("src", fiveDayIcon);
                $(divEl).append("<h5>" + humanDate + "</h5>");
                $(divEl).append(imageEl);
                $(divEl).append("<p>" + "Temp: " + fiveDayTemp + "\u00B0F" + "</p>");
                $(divEl).append("<p>" + "Wind " + fiveDayWind + " MPH" + "</p>");
                $(divEl).append("<p>" + "Humidity: " + fiveDayHumidity + "%" + "</p>");
                $("#forecast").append(divEl);
            };
        })
    })
}
