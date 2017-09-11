console.log('linked')

$(document).ready(function () {

var search
var url
var long
var lat
var outdoor = ['museum', 'park', 'restaurant']
var indoor = ['spa', 'shopping_mall', 'restaurant']
var categoryTerm

$('#search').submit(function(e){
  e.preventDefault()
  search = $('input').val()

  $.ajax({
    url: `http://api.openweathermap.org/data/2.5/weather?q=${search}&appid=${secondKey}&units=imperial`,
    type: 'get',
    dataType: 'json'
      }).done((response) => {
        console.log('weather request success!')
        long = response.coord.lon
        lat = response.coord.lat
        latlngVal = `${response.coord.lat}, ${response.coord.lon}`
        $('<div></div>').appendTo('body').text(`temp is ${response.main.temp}° F`)
        $('<div></div>').appendTo('body').text(`${response.weather[0].description}`)
        if (response.weather[0].main == 'Rain' || parseInt(response.main.temp) < 60 ) {
          $('<div></div>').appendTo('body').text(`${indoor[0]}`).addClass("category")
          $('<div></div>').appendTo('body').text(`${indoor[1]}`).addClass("category")
          $('<div></div>').appendTo('body').text(`${indoor[2]}`).addClass("category")
        }
        else {
          $('<div></div>').appendTo('body').text(`${outdoor[0]}`).addClass("category")
          $('<div></div>').appendTo('body').text(`${outdoor[1]}`).addClass("category")
          $('<div></div>').appendTo('body').text(`${outdoor[2]}`).addClass("category")
        }
        $('.category').on('click', initialize)
      }).fail(() => {
        console.log('weather request failed')
      }).always(() => {
        console.log('This always happens regardless of successful ajax request or not.')
      })
    })

    var map;
    var service;
    var infowindow;
    var latlngVal

    function initialize() {
      var type = $(this).text()
      var location = new google.maps.LatLng(lat,long);

      map = new google.maps.Map(document.getElementById('results'), {
        });

      var request = {
        location: location,
        radius: '2000',
        type: type,
        rankBy: google.maps.places.RankBy.PROMINENCE
        // rankby : google.maps.places.RankBy.DISTANCE
      };

      service = new google.maps.places.PlacesService(map);
      service.nearbySearch(request, callback);
    }

    function callback(results, status) {
      if (status == google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
          var place = results[i]
          service.getDetails({
          placeId: place.place_id
          }, function(place, status) {
            console.log(place)
            $(`<p>${place.name}</p>`).appendTo('body')
            $(`<p>${place.formatted_address}</p>`).appendTo('body')
            $(`<a href="${place.website}">${place.website}</a>`).appendTo('body')
            $(`<p>${place.rating} stars</p>`).appendTo('body')
            $(`<p>${place.reviews[0].text}</p>`).appendTo('body')
          })
        }
      }
    }


})
