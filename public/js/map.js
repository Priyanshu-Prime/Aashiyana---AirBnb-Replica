let map;

async function initMap() {

  if(!window.google || !google.maps)
  {
    console.log("Not loading");
    // return;
  }
  // The location of Uluru
  console.log(l1);
  console.log(l2);
  const position = { lat: Number(l1), lng: Number(l2) };
  // Request needed libraries.
  //@ts-ignore
  const { Map } = await google.maps.importLibrary("maps");
  const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
  const { InfoWindow } = await google.maps.importLibrary("core");

  // The map, centered at Uluru
  map = new Map(document.getElementById("map"), {
    zoom: 12,
    center: position,
    mapId: "DEMO_MAP_ID",
  });

  // The marker, positioned at Uluru
  const marker = new AdvancedMarkerElement({
    map: map,
    position: position,
    title: nameLocation,
  });

  const infoWindow = new InfoWindow({
    content: nameLocation, // Text to display
  });
  
  marker.addEventListener("click", () => {
    // If the InfoWindow is already open, close it; otherwise, open it
    if (infoWindow.getMap()) {
      infoWindow.close();
    } else {
      infoWindow.open({ anchor: marker, map });
    }
  });

  // // Show infoWindow on marker hover
  // marker.addListener("click", () => {
  //   infoWindow.open(map, marker);
  // });
  
  // // Hide infoWindow when mouse leaves the marker
  // marker.addListener("click", () => {
  //   infoWindow.close();
  // });
}


initMap();