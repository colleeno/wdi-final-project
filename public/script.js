$(document).ready(function () {

  var indoor = [['spa', 'spa'], ['shopping mall', 'shopping_mall'], ['restaurant', 'restaurant']]
  var outdoor = [['museum', 'museum'], ['park', 'park'], ['restaurant', 'restaurant']]
  var map
  var service
  var secondKey = $('.hidden-key').text()

  // set up search form to autocomplete
  var input = document.getElementById('autocomplete');
  var autocomplete = new google.maps.places.Autocomplete(input,{types: ['(cities)']})

  //listen for form to change
  google.maps.event.addListener(autocomplete, 'place_changed', function(){
    //complete form with cities only
    city = autocomplete.getPlace()
    //get latitude and longitude for location
    lat = city.geometry.location.lat()
    lng = city.geometry.location.lng()
      //connect to weather api with lat and lng
        $.ajax({
          // url: `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${secondKey}&units=imperial`,
          url: `http://api.apixu.com/v1/forecast.json?key=${secondKey}&q=${lat},${lng}`,
          type: 'get',
          dataType: 'json'
          }).done((response) => {
              console.log('weather request success!')
              //if weather request is successful, run displayWeather function
              displayWeather(response)
              //when user clicks on category name, run function to get places
              $('.category').on('click', getPlaces)
          }).fail(() => {
              console.log('new weather request failed')
          }).always(() => {
              console.log('log regardless of ajax success or fail')
          })
    })


  function displayWeather (response) {
    currentTemp = Math.round(response.current.temp_f)
    feelslikeTemp = Math.round(response.current.feelslike_f)
    currentDescription = response.current.condition.text
    dailyDescription = response.forecast.forecastday[0].day.condition.text
    $('<div></div>').appendTo('body').text(`temp is ${currentTemp}° F`)
    $('<div></div>').appendTo('body').text(`feels like ${feelslikeTemp}° F`)
    $('<div></div>').appendTo('body').text(`current: ${currentDescription}`)
    $('<div></div>').appendTo('body').text(`today's forecast: ${dailyDescription}`)
    //recommend activities based on weather
    mapWeatherToActivities()
  }

  function mapWeatherToActivities () {
    //if rain, cold, or too hot do indoor
    if (currentDescription.toLowerCase().indexOf('rain') !== -1 || dailyDescription.toLowerCase().indexOf('rain') !== -1 || feelslikeTemp < 60 || feelslikeTemp > 100) {
      console.log('do indoor activity')
      $('<div></div>').appendTo('body').text(`${indoor[1][0]}`).addClass(`${indoor[1][1]}`)
    }
    //otherwise do outdoor
    else {
      console.log('do outdoor activity')
      $('<div></div>').appendTo('body').text(`${outdoor[0][0]}`).addClass(`${outdoor[0][1]}`)
    }}

  //   $('<div></div>').appendTo('body').text(`temp is ${response.main.temp}° F`)
  //   $(`<img src="http://openweathermap.org/img/w/${response.weather[0].icon}.png" />`).appendTo('body')
  //   $('<div></div>').appendTo('body').text(`${response.weather[0].description}`)
  // if (response.weather[0].main == 'Rain' || parseInt(response.main.temp) < 60 ) {
  //   $('<div></div>').appendTo('body').text(`${indoor[0]}`).addClass("category")
  //   $('<div></div>').appendTo('body').text(`${indoor[1]}`).addClass("category")
  //   $('<div></div>').appendTo('body').text(`${indoor[2]}`).addClass("category")
  // } else {
  //   $('<div></div>').appendTo('body').text(`${outdoor[0]}`).addClass("category")
  //   $('<div></div>').appendTo('body').text(`${outdoor[1]}`).addClass("category")
  //   $('<div></div>').appendTo('body').text(`${outdoor[2]}`).addClass("category")
  //   }

// find places from google places
  function getPlaces() {
    //set type to search as category selected by user
    var categoryType = $(this).text()
    //search by locations lat lng values
    var location = new google.maps.LatLng(lat,lng)
    // must create map though it wont be displayed in this app
    map = new google.maps.Map(document.getElementById('results'), {})
    // assign properties to request
    var request = {
      location: location,
      radius: '2000', //meters
      type: categoryType,
      rankBy: google.maps.places.RankBy.PROMINENCE //can also rank by distance
    }
    // perform nearby search with requested props
    service = new google.maps.places.PlacesService(map)
    service.nearbySearch(request, callback)
  }
  // function based on results
  function callback(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      for (var i = 0; i < results.length; i++) {
        var place = results[i]
        // perform details search by place id based on results, call displayPlaces function
          service.getDetails({placeId: place.place_id}, displayPlaces)
      }
    }
  }
  // display place search result details on page
  function displayPlaces (place, status) {
    if (place != null) {
    $(`<p>${place.name}</p>`).appendTo('body')
    $(`<p>${place.formatted_address}</p>`).appendTo('body')
    $(`<a href="${place.website}">${place.website}</a>`).appendTo('body')
    $(`<p>${place.rating} stars</p>`).appendTo('body')
    $(`<p>${place.reviews[0].text}</p>`).appendTo('body')
    }
  }

})
