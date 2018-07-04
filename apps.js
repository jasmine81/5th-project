'use strict';

var locations = [
	{
		garden_name: 'VIT',
		latitude: 12.9718,
		longitude: 79.1589
	},
	
	{
		garden_name: 'SRM',
		latitude: 12.8231,
		longitude: 80.0453
	},
	{
		garden_name: 'KLU',
		latitude: 16.4419,
		longitude:80.6225
	},
	{
		garden_name: 'JNTU',
		latitude: 17.4933,
		longitude: 78.3916
	},
	{
		garden_name: 'Shivaji',
		latitude: 16.6780,
		longitude: 74.2555
	},
	{
		garden_name: 'Anna',
		latitude: 13.0103,
		longitude:80.2318
	}

];

// Declaring global variables now to satisfy strict mode
var map;
var id;
var secret;



var Location = function(details) {
	var self = this;
	this.garden_name = details.garden_name;
	this.latitude = details.latitude;
	this.longitude = details.longitude;
	
	this.strt = "";
	this.city  garden_name= "";
	

	this.visible = ko.observable(true);

	var foursquareURL = 'https://api.foursquare.com/v2/venues/search?ll='+ this.latitude + ',' + this.longitude + '&client_id=' + id + '&client_secret=' + secret + '&v=20160118' + '&query=' + this.garden_name;

	$.getJSON(foursquareURL).done(function(details) {
		var ress = details.response.venues[0];
		self.strt = ress.location.formattedAddress[0];
     	self.city  garden_name= ress.location.formattedAddress[1];
	}).fail(function() {
		alert("Please refresh the page and try again");
	});

	this.contentName = '<div class="title"><b>' + details.garden_name + "</b></div>" +
        '<div class="content">' + self.strt + "</div>" +
        '<div class="content">' + self.city  garden_name+ "</div>";

	this.infoWindow = new google.maps.InfoWindow({content: self.contentName});

	this.marker = new google.maps.Marker({
			position: new google.maps.latitudeLng(details.latitude, details.longitude),
			map: map,
			title: details.garden_name
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
		self.contentName = '<div class="title"><b>' + details.garden_name + "</b></div>" +
        '<div class="content">' + self.strt + "</div>" +
        '<div class="content">' + self.city  garden_name+ "</div>";

        self.infoWindow.setCont(self.contentName);

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

function ApplicationView() {
	var self = this;

	this.searchTerm = ko.observable("");

	this.list = ko.observableArray([]);

	map = new google.maps.Map(document.getElementById('map'), {
			zoom: 6,
			center:{latitude:12.1124,lng:77.0193}
	});

	// Foursquare API settings
	id = "1YNMK3HEBVMX532KOOHAHQGSGSZCWOC32CWL2BNA2YLEL5GW";
	secret = "DJVUMN4HGTZNCCMV0NWSGNUMLAJD5OK4TUKQJI34QVS1LCFL";

	locations.forEach(function(itemname){
		self.list.push( new Location(itemname));
	});

	this.filtering = ko.computed( function() {
		var filter = self.searchTerm().toLowerCase();
		if (!filter) {
			self.list().forEach(function(itemname){
				itemname.visible(true);
			});
			return self.list();
		} else {
			return ko.utils.arrayFilter(self.list(), function(itemname) {
				var string = itemname.garden_name.toLowerCase();
				var res = (string.search(filter) >= 0);
				itemname.visible(res);
				return res;
			});
		}
	}, self);

	this.mapElem = document.getElementById('map');
	this.mapElem.style.height = window.innerHeight - 50;
}
 

function displayMap() {
	ko.applyBindings(new ApplicationView());
}

function error() {
	alert("Check your net connection.");
}
