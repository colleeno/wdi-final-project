$(document).ready(function () {

  var outdoor = ['museum', 'park', 'restaurant']
  var indoor = ['spa', 'shopping_mall', 'restaurant']
  var map
  var service
  var secondKey = $('.hidden-key').text()

  var input = document.getElementById('autocomplete');
  var autocomplete = new google.maps.places.Autocomplete(input,{types: ['(cities)']})

  google.maps.event.addListener(autocomplete, 'place_changed', function(){
    city = autocomplete.getPlace()
    lat = city.geometry.location.lat()
    lng = city.geometry.location.lng()
        $.ajax({
          url: `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${secondKey}&units=imperial`,
          type: 'get',
          dataType: 'json'
            }).done((response) => {
              console.log('new weather request success!')
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
              console.log('new weather request failed')
            }).always(() => {
              console.log('log regardless of ajax success or fail')
            })

    })

    function initialize() {
      var categoryType = $(this).text()
      var location = new google.maps.LatLng(lat,lng)
      map = new google.maps.Map(document.getElementById('results'), {
        })

      var request = {
        location: location,
        radius: '2000',
        type: categoryType,
        rankBy: google.maps.places.RankBy.PROMINENCE
      }

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
            // console.log(place)
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
