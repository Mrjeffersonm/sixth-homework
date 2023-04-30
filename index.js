

$(function () {
    
    var weather = $("#weather-search");
    weather.on("change", weatherSearch);
    loadFavorites();
});

function loadFavorites() {
    var storedFavorites = localStorage.getItem('cityFlavorites');

    if (storedFavorites) {
        var favorites = JSON.parse(storedFavorites);
    } else {
        var favorites = {};
    }
    var favoriteslist = $('#favorites-list')
    favoriteslist.empty()
    for (const [key, value] of Object.entries(favorites)) {
        var city = $(`<button class="btn">${key}</button>`)
        favoriteslist.append(city)
        city.on("click", function() {
            callWeather(key)
        })
    }
}

function weatherSearch() {
    callWeather($(this).val());
}
function callWeather(searchWords) {
    searchWords = searchWords.replace(/\s+/g, '+').toLowerCase();
    $.ajax({
        type: "GET",
        url: "http://api.openweathermap.org/geo/1.0/direct?q=" + searchWords + "&appid=aaab36c2086cb7f783b4fa9404b28e44",
        dataType: "json",
        success: onSearchComplete,
        });
}    
    
    
function onSearchComplete(result) {
    console.log("result", result);
    var lat = null;
    var lon = null;
    lat = result["0"]["lat"];
    lon = result["0"]["lon"];
    console.log(lat);
    console.log(lon);
    $.ajax({
        type: "GET",
        url: "http://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=aaab36c2086cb7f783b4fa9404b28e44&units=imperial",
        dataType: "json",
        success: onGetWeatherComplete,
    })
}

function onGetWeatherComplete(result) {
    console.log("result 2", result)
    var temps = null;
    temps = result["list"];
    var weather = null;
    weather = result["list"];
    display = {};
    temps.forEach(temp => {
        var min = "";
        var max = "";
        if(temp["main"]["temp_min"]) {
            min = temp["main"]["temp_min"];
            console.log("Min Temp", min)
        }
        if(temp["main"]["temp_max"]) {
            max = temp["main"]["temp_max"];
            console.log("Max Temp", max)
        }
        var icon = "";
        temp["weather"].forEach(weather => {    
            if(weather["icon"]) {
                icon = weather["icon"];
                console.log(icon)
            }
        });
        var humidity = "";
        var wind = "";
        if(temp["main"]["humidity"]) {
            humidity = temp["main"]["humidity"];
            console.log("Humidity", humidity)
        }
        if(temp["wind"]["speed"]) {
            wind = temp["wind"]["speed"];
            console.log("Wind Speed", wind)
        }
        const currentDate = new Date(temp.dt * 1000);
        console.log(currentDate.toLocaleDateString());
        day = currentDate.toLocaleDateString()
        if(!display[day]) {
            display[day] = {}
            display[day]["temp"] = max
            display[day]["wind"] = wind
            display[day]["humidity"] = humidity
            display[day]["icon"] = icon
        }
        if(display[day]["temp"] < max) {
            display[day]["temp"] = max
            display[day]["wind"] = wind
            display[day]["humidity"] = humidity
            display[day]["icon"] = icon
        }
    });
    displayWeather(result.city.name, display)
}
function displayWeather(city, display) {
    console.log(display)
    var weatherList = $('#weather-list')
    weatherList.empty()
    var div = $("<div/>").addClass("weather-listed")
    var sity = $(`<div>${city}</div>`)
        div.append(sity)
    for (const [key, value] of Object.entries(display)) {
        var weatherDay = $("<div class='weather-day'/>")
        var icon = $(`<img class="save-img" src="https://openweathermap.org/img/wn/${value.icon}@2x.png" height="128
        "></img>`)
        weatherDay.append(icon)
        var day = $(`<div>${key}</div>`)
        weatherDay.append(day)
        var temp = $(`<div>Temperature: ${value.temp}F</div>`)
        weatherDay.append(temp)
        var humid = $(`<div>Humidity: ${value.humidity}%</div>`)
        weatherDay.append(humid)
        var wind = $(`<div>Wind Speed:${value.wind}mph</div>`)
        weatherDay.append(wind)
        div.append(weatherDay)
    }
    weatherList.append(div)       
    saveCity(city)  
}
    
function saveCity(city) {
    var storedFavorites = localStorage.getItem("cityFlavorites");
  
    if (storedFavorites) {
      var favorites = JSON.parse(storedFavorites);
    } else {
      var favorites = {};
    }
    favorites[city] = city
    localStorage.setItem("cityFlavorites", JSON.stringify(favorites));
    loadFavorites()
  }    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    // $.ajax({
            //     type: "GET",
            //     url: "https://openweathermap.org/img/wn/"+ weathe + "@2x.png",
            //     success: function (result) {
            //         console.log(result);
            //     }
            // })

    // success: function (result) {
        //     var authBookList = null;
        //     var items = null;
        //     console.log("result " + result);
        //     authBookList = $("#auth-book-list");
        //     items = result["items"]
        //     authBookList.empty()
        //     items.forEach(item => {
        //         var image  = "";
        //         var title = item["volumeInfo"]["title"];
        //         var imgLink = "";
        //         if(item["volumeInfo"]["imageLinks"]) {
        //             imgLink = item["volumeInfo"]["imageLinks"]["smallThumbnail"]
        //             image = `<img src='${imgLink}' height="60"></img>`
        //         }
        //         var div = $("<div/>").addClass("auth-book")
        //         div.append(`<img class="save-img" src="assets/images/save-32.png" height="16" /><a href="${item["volumeInfo"]["canonicalVolumeLink"]}">${title}</a> ${image}`)

