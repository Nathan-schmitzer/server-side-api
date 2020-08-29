// create global functions
var APIKey = "4a50a883b83ed4afe5d51c5620f2b0a8";
var time = new Date();
var currentDate = time.getMonth() + 1 + "/" + time.getDate() + "/" + time.getFullYear();
$("#displayDate").text(currentDate);


var cityArr = [];

function renderCities(cityArr) {
    // if (cityArr.length >= 1) {
        $("#searchHistory").empty();
        
        for (var i = 0; i < cityArr.length; i++) {
            var liEl = $("<li>")
            liEl.attr("data-name", cityArr[i]);
            liEl.addClass("city list-group-item");
            // if( i === 0){
            //     liEl.addClass("active");
            // }
            liEl.text(cityArr[i]);
            $("#searchHistory").append(liEl);
        // }
    } 
}

$(document).on("click", ".city", clickCity);



function clickCity(event) {
    event.stopPropagation();
    event.preventDefault();
    var cityVal = event.target.innerHTML;
   
    searchCity(cityVal);
    
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
    cityArr.unshift(findNewCity);
    
    searchCity(findNewCity);
    renderCities(cityArr);
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
            } else { $("#uvIndex").attr("style", "background-color: red"); 
        };
            $("#uvIndex").text("UV Index: " + uvIndexVal);

            for (var x = 1; x < 6; x++) {
                let futureForTemp = result.daily[x].temp.day.toFixed(1);
                let futureForHumidity = result.daily[x].humidity;
                let futureForDate = result.daily[x].sunrise;
                let futureForWind = result.daily[x].wind_speed.toFixed(1);
                let futureForPic = result.daily[x].weather[0].icon;
                let futureForIcon = "http://openweathermap.org/img/wn/" + futureForPic + ".png";
                futureForDate = futureForDate * 1000;

                let dateObject = new Date(futureForDate);
                let regularDate = dateObject.toLocaleDateString();

                let divEl = $("<div>").addClass("card fiveDayCard").attr("style", "background-color: orange");
                let imageEl = $("<img>").addClass("fiveDayImage").attr("src", futureForIcon).attr("style", "width:50px");
                $(divEl).append("<h5>" + regularDate + "</h5>");
                $(divEl).append(imageEl);
                $(divEl).append("<p>" + "Temp: " + futureForTemp + "\u00B0F" + "</p>");
                $(divEl).append("<p>" + "Wind " + futureForWind + " MPH" + "</p>");
                $(divEl).append("<p>" + "Humidity: " + futureForHumidity + "%" + "</p>");
                $("#forecast").append(divEl);
            };
        })
    })
}
