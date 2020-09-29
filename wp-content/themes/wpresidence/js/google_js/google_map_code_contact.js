/*global google , jQuery , InfoBox , googlecode_contact_vars,mapfunctions_vars,wpestate_close_adv_search*/
var gmarkers = [];
var map_open=0;
var first_time=1;
var pins='';
var markers='';
var infoBox = null;
var map;
var selected_id='';

function wpresidence_initialize_map_contact_leaflet(){
    "use strict";

    var mapCenter = L.latLng( googlecode_contact_vars.hq_latitude, googlecode_contact_vars.hq_longitude );
       map =  L.map( 'googleMap',{
           center: mapCenter, 
           zoom: parseInt(googlecode_contact_vars.page_custom_zoom, 10),
       });

        var tileLayer =  wpresidence_open_stret_tile_details();
        map.addLayer( tileLayer );
        
        map.scrollWheelZoom.disable();
        if ( Modernizr.mq('only all and (max-width: 768px)') ) {    
            map.dragging.disable();
        }
        //map.touchZoom.disable();
        
        
    
        jQuery('#gmap-loading').remove();

        map.on('popupopen', function(e) {

            var px = map.project(e.popup._latlng); // find the pixel location on the map where the popup anchor is
            if( mapfunctions_vars.useprice === 'yes' ){
               px.y -= 115; // find the height of the popup container, divide by 2, subtract from the Y axis of marker location
            }else{
                px.y -= 120/2; // find the height of the popup container, divide by 2, subtract from the Y axis of marker location
            }
            map.panTo(map.unproject(px),{animate: true}); // pan to new center
        });

        var markerCenter    =   L.latLng( googlecode_contact_vars.hq_latitude, googlecode_contact_vars.hq_longitude );
        var markerImage     = {
            iconUrl: images['single_pin'],
            iconSize: [44, 50],
            iconAnchor: [20, 50],
            popupAnchor: [1, -50]
        };
        var markerOptions = {
            riseOnHover: true
        };
        var infobox = '<div class="info_details contact_info_details leaflet_contact"><h2 id="contactinfobox">' +  googlecode_contact_vars.title+ '</h2><div class="contactaddr">' + googlecode_contact_vars.address + '</div></div>'


       markerOptions.icon  = L.icon( markerImage );
       var propertyMarker      = L.marker( markerCenter, markerOptions );
       propertyMarker.bindPopup( infobox );
       propertyMarker.addTo( map );

       propertyMarker.fire('click');
       
             
        if ( Modernizr.mq('only all and (max-width: 768px)') ) {        
            map.on('dblclick ', function(e) {
                if (map.dragging.enabled()) {
                     map.dragging.disable();
                    //map.touchZoom.disable();
                }else{
                    map.dragging.enable();
                    //map.touchZoom.enable();
                }
            });
        }


}




function wpresidence_initialize_map_contact(){
    "use strict";
    if(!document.getElementById('googleMap') ){
        return;
    }
    var mapOptions = {
        zoom: parseInt(googlecode_contact_vars.page_custom_zoom),
        scrollwheel: false,
        center: new google.maps.LatLng(googlecode_contact_vars.hq_latitude, googlecode_contact_vars.hq_longitude),
        mapTypeId: googlecode_contact_vars.type.toLowerCase(),
        streetViewControl:false,
        disableDefaultUI: true,
         gestureHandling: 'cooperative'
    };

    map = new google.maps.Map(document.getElementById('googleMap'), mapOptions);

    

    google.maps.event.addListener(map, 'tilesloaded', function() {
        jQuery('#gmap-loading').remove();
    });


    if(mapfunctions_vars.map_style !==''){
       var styles = JSON.parse ( mapfunctions_vars.map_style );
       map.setOptions({styles: styles});
    }

    pins=googlecode_contact_vars.markers;
    markers = jQuery.parseJSON(pins);
    wpestate_setMarkers_contact(map, markers);
    google.maps.event.trigger(gmarkers[0], 'click');

  
}

 ////////////////////////////////////////////////////////////////////
 /// custom pin function
 //////////////////////////////////////////////////////////////////////
 
function wpestate_custompincontact(image){
    "use strict";
    image = {
        url:  images['single_pin'],
        size: new google.maps.Size(59, 59),
        origin: new google.maps.Point(0,0),
        anchor: new google.maps.Point(16,59 )
   };
   return image;
 }
  
 ////////////////////////////////////////////////////////////////////
 /// set markers function
 //////////////////////////////////////////////////////////////////////
 

function wpestate_setMarkers_contact(map, beach) {
    "use strict";
    var shape = {
        coord: [1, 1, 1, 38, 38, 59, 59 , 1],
        type: 'poly'
    };
    var title;
    var boxText = document.createElement("div");
    var myOptions = {
                      content: boxText,
                      disableAutoPan: true,
                      maxWidth: 500,
                      pixelOffset: new google.maps.Size(-90, -210),
                      zIndex: null,
                      closeBoxMargin: "-13px 0px 0px 0px",
                      closeBoxURL: "",
                      draggable: true,
                      infoBoxClearance: new google.maps.Size(1, 1),
                      isHidden: false,
                      pane: "floatPane",
                      enableEventPropagation: false
              };              
    infoBox = new InfoBox(myOptions);         
                

   

    var myLatLng = new google.maps.LatLng(googlecode_contact_vars.hq_latitude, googlecode_contact_vars.hq_longitude);
    var marker = new google.maps.Marker({
        position: myLatLng,
        map: map,
        icon: wpestate_custompincontact(beach[8]),
        shape: shape,
        title: decodeURIComponent(  beach[0].replace(/\+/g,' ')),
        zIndex: 1,
        image:beach[4],
        price:beach[5],
        type:beach[6],
        type2:beach[7],
        infoWindowIndex : 0 
    });

    gmarkers.push(marker);


    google.maps.event.addListener(marker, 'click', function() { 
        first_time=0;
        title = this.title;
        infoBox.setContent('<div class="info_details contact_info_details"><span id="infocloser" onClick=\'javascript:infoBox.close();\' ></span><h2 id="contactinfobox">'+title+'</h2><div class="contactaddr">'+googlecode_contact_vars.address+'</div></div>' );
  
        infoBox.open(map, this);    
        map.setCenter(this.position);      
        map.panBy(0,-120);
        
        wpestate_close_adv_search();
    });


}// end setMarkers

                       
if (typeof google === 'object' && typeof google.maps === 'object') {
    google.maps.event.addDomListener(window, 'load', wpresidence_initialize_map_contact);
}else{
    wpresidence_initialize_map_contact_leaflet();
}