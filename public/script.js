$(document).ready(function () {

  var indoor = [['spa', 'spa'], ['shopping', 'retail store'], ['restaurant', 'restaurant'], ['museum', 'museum'], ['movies', 'movies']]
  var outdoor = [['museum', 'museum'], ['park', 'park'], ['restaurant', 'fine dining'], ['biking', 'biking'], ['golf', 'golf course'],
  ['bowling', 'bowling lane'], ['spa', 'spa'], ['shopping', 'department store'], ['movies', 'movies']]
  var map
  var service
  var secondKey = $('.hidden-key').text()

  // set up search form to autocomplete
  var input = document.getElementById('autocomplete')
  var autocomplete = new google.maps.places.Autocomplete(input, {types: ['(cities)']})

  //listen for form to change
  google.maps.event.addListener(autocomplete, 'place_changed', function(){
    //complete form with cities only
    city = autocomplete.getPlace()
    //get latitude and longitude for location
    lat = city.geometry.location.lat()
    lng = city.geometry.location.lng()
      //connect to weather api with lat and lng
      $.ajax({
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
      randomizeActivities(indoor)
      randomizeList.forEach(function(activity) {
        $('<div></div>').appendTo('body').text(`${activity[0]}`).attr({'class': 'category', 'id': `${activity[1]}`})
      })
    }
    //otherwise do outdoor
    else {
      console.log('do outdoor activity')
      randomizeActivities(outdoor)
      randomizeList.forEach(function(activity) {
        $('<div></div>').appendTo('body').text(`${activity[0]}`).attr({'class': 'category', 'id': `${activity[1]}`})
      })
    }
  };

  function randomizeActivities (activityList) {
   randomizeList = activityList.sort(function(a, b){return 0.5 - Math.random()})
  //  add back slice after testing .slice(0,2)
   return randomizeList
 }

// find places from google places
  function getPlaces() {
    //set type to search as category selected by user
    var categoryType = $(this).attr('id')
    //search by locations lat lng values
    var location = new google.maps.LatLng(lat,lng)
    // must create map though it wont be displayed in this app
    map = new google.maps.Map(document.getElementById('results'), {})
    // assign properties to request
    var request = {
      location: location,
      radius: '5000', //meters
      keyword: categoryType, //can be type or keyword
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
    if (place !==  'undefined' && place) {
      console.log(place)
    $(`<p>${place.name}</p>`).appendTo('body')
    $(`<p>${place.formatted_address}</p>`).appendTo('body')
    // edit site to link whole section or add logic to show if there
    $(`<p>website: <a href="${place.website}">${place.website}</a></p>`).appendTo('body')
    // add logic to round rating and show star image possibly
    $(`<p>${place.rating} stars</p>`).appendTo('body')
      if (place.reviews !== 'undefined' && place.reviews[0].text.length > 0) {
        {$(`<p>review: ${place.reviews[0].text}</p>`).appendTo('body')}
      }
    }
  }

})
