function initMap() {
  new google.maps.Map(document.getElementById("map"), {
    center: { lat: 19.0760, lng: 72.8777 },
    zoom: 12
  });
}
window.initMap = initMap;
