'use strict';

var locations = [
	{
		name: 'VIT',
		lat: 12.9718,
		long: 79.1589
	},
	
	{
		name: 'SRM',
		lat: 12.8231,
		long: 80.0453
	},
	{
		name: 'KLU',
		lat: 16.4419,
		long:80.6225
	},
	{
		name: 'JNTU',
		lat: 17.4933,
		long: 78.3916
	},
	{
		name: 'Shivaji',
		lat: 16.6780,
		long: 74.2555
	},
	{
		name: 'Anna',
		lat: 13.0103,
		long:80.2318
	}

];

// Declaring global variables now to satisfy strict mode
var map;
var id;
var secret;



var Location = function(details) {
	var self = this;
	this.name = details.name;
	this.lat = details.lat;
	this.long = details.long;
	
	this.street = "";
	this.city = "";
	

	this.visible = ko.observable(true);

	var foursquareURL = 'https://api.foursquare.com/v2/venues/search?ll='+ this.lat + ',' + this.long + '&client_id=' + id + '&client_secret=' + secret + '&v=20160118' + '&query=' + this.name;

	$.getJSON(foursquareURL).done(function(details) {
		var ress = details.response.venues[0];
		self.street = ress.location.formattedAddress[0];
     	self.city = ress.location.formattedAddress[1];
	}).fail(function() {
		alert("Please refresh the page and try again");
	});

	this.contentString = '<div class="title"><b>' + details.name + "</b></div>" +
        '<div class="content">' + self.street + "</div>" +
        '<div class="content">' + self.city + "</div>";

	this.infoWindow = new google.maps.InfoWindow({content: self.contentString});

	this.marker = new google.maps.Marker({
			position: new google.maps.LatLng(details.lat, details.long),
			map: map,
			title: details.name
	});

	this.showMarker = ko.computed(function() {
		if(this.visible() === true) {
			this.marker.setMap(map);
		} else {
			this.marker.setMap(null);
		}
		return true;
	}, this);

	this.marker.addListener('click', function(){
		self.contentString = '<div class="title"><b>' + details.name + "</b></div>" +
        '<div class="content">' + self.street + "</div>" +
        '<div class="content">' + self.city + "</div>";

        self.infoWindow.setContent(self.contentString);

		self.infoWindow.open(map, this);

		self.marker.setAnimation(google.maps.Animation.BOUNCE);
      	setTimeout(function() {
      		self.marker.setAnimation(null);
     	}, 2100);
	});

	this.bounce = function(place) {
		google.maps.event.trigger(self.marker, 'click');
	};
};

function AppView() {
	var self = this;

	this.searchTerm = ko.observable("");

	this.list = ko.observableArray([]);

	map = new google.maps.Map(document.getElementById('map'), {
			zoom: 6,
			center:{lat:12.1124,lng:77.0193}
	});

	// Foursquare API settings
	id = "R4VG53MD1411WOTLL3Y4SXB145BN5X0BFNJZFDH4FUQSECYF";
	secret = "XTDMSQAGT3IIJD5A132TEX34S1MRLSKJDRCQX4KQ24LA1JGA";

	locations.forEach(function(item){
		self.list.push( new Location(item));
	});

	this.filtering = ko.computed( function() {
		var filter = self.searchTerm().toLowerCase();
		if (!filter) {
			self.list().forEach(function(item){
				item.visible(true);
			});
			return self.list();
		} else {
			return ko.utils.arrayFilter(self.list(), function(item) {
				var string = item.name.toLowerCase();
				var res = (string.search(filter) >= 0);
				item.visible(res);
				return res;
			});
		}
	}, self);

	this.mapElem = document.getElementById('map');
	this.mapElem.style.height = window.innerHeight - 50;
}
 

function displayMap() {
	ko.applyBindings(new AppView());
}

function error() {
	alert("Check your internet connection.");
}
