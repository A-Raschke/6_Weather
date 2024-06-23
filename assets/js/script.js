// Function fetches weather data from API
$(document).ready(function () {
    function getWeather(citySearch) {
        fetch("https://api.openweathermap.org/data/2.5/weather?q=" + citySearch + "&appid=2b74f48839471f1f96de004794266ff0&units=imperial")
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (history.indexOf(citySearch) === -1) {
                    history.push(citySearch);
                    localStorage.setItem("history", JSON.stringify(history));
                    createRow(citySearch);
                }
                $("#today").empty();
                var title = $("<h3>").addClass("card-title").text(data.name + " (" + new Date().toLocaleDateString() + ")");
                var img = $("<img>").attr("src", "https://openweathermap.org/img/w/" + data.weather[0].icon + ".png");
                var card = $("<div>").addClass("card");
                var cardBody = $("<div>").addClass("card-body");
                var wind = $("<p>").addClass("card-text").text("Wind Speed: " + data.wind.speed + " MPH");
                var humid = $("<p>").addClass("card-text").text("Humidity: " + data.main.humidity + " %");
                var temp = $("<p>").addClass("card-text").text("Temperature: " + data.main.temp + " F");
                var lon = data.coord.lon;
                var lat = data.coord.lat;
                title.append(img);
                cardBody.append(title, temp, wind, humid);
                card.append(cardBody);
                $("#today").append(card);
            })
            .catch(error => console.error('Error fetching weather:', error));
    }
  
    // Function fetches weather forecast
    function getForecast(citySearch) {
        fetch("https://api.openweathermap.org/data/2.5/forecast?q=" + citySearch + "&appid=2b74f48839471f1f96de004794266ff0&units=imperial")
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error fetching forecast:');
                }
                return response.json();
            })
            .then(data => {
                $("#forecast").html("<h4 class=\"mt-3\"></h4>").append("<div class=\"row\">");
                // Edits the html to display data
                for (var i = 0; i < data.list.length; i++) {
                    if (data.list[i].dt_txt.indexOf("15:00:00") !== -1) {
                        var titleFive = $("<h3>").addClass("card-title").text(new Date(data.list[i].dt_txt).toLocaleDateString());
                        var imgFive = $("<img>").attr("src", "https://openweathermap.org/img/w/" + data.list[i].weather[0].icon + ".png");
                        var colFive = $("<div>").addClass("col-md-2.5");
                        var cardFive = $("<div>").addClass("card bg-info text-white");
                        var cardBodyFive = $("<div>").addClass("card-body p-2");
                        var humidFive = $("<p>").addClass("card-text").text("Humidity: " + data.list[i].main.humidity + "%");
                        var tempFive = $("<p>").addClass("card-text").text("Temperature: " + data.list[i].main.temp + " °F");
                        colFive.append(cardFive.append(cardBodyFive.append(titleFive, imgFive, tempFive, humidFive)));
                        $("#forecast .row").append(colFive);
                    }
                }
            })
            .catch(error => console.error('Error fetching forecast:', error));
    }
  
    // Search on click
    $("#search-button").on("click", function () {
        var citySearch = $("#search-value").val().trim();
        if (citySearch !== "") {
            $("#search-value").val("");
            getWeather(citySearch);
            getForecast(citySearch);
        }
    });
  
    // Pulls previous searches from local storage
    var history = JSON.parse(localStorage.getItem("history")) || [];
  
    // Displays previous searches
    if (history.length > 0) {
        getWeather(history[history.length - 1]);
    }
  
    // Create a row for each previous search
    for (var i = 0; i < history.length; i++) {
        createRow(history[i]);
    }
  
    // Function to create a row in the search history
    function createRow(text) {
        var listItem = $("<li class=\"mt-3 bg-light text-center text-dark font-weight-bold\">").addClass("list-group-item").text(text);
        $(".history").append(listItem);
    }
  
    // click on history
    $(".history").on("click", "li", function () {
        var citySearch = $(this).text();
        getWeather(citySearch);
        getForecast(citySearch);
    });
  });