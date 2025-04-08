mapboxgl.accessToken = 'pk.eyJ1Ijoieml3ZWkwMjMiLCJhIjoiY204dnc5dXpoMTIwdTJrcTFvdG9xcWcycCJ9.gn8PHOvdBmJ6_U_O1zlvqA';

const map = new mapboxgl.Map({
  container: 'map', // container ID
  style: 'mapbox://styles/mapbox/light-v11',
  center: [-73.97234, 40.73422], // starting position [lng, lat]. 
  zoom: 12.3,
  bearing: 117
});


map.on('load', function () {
  map.addSource('art-galleries', {
    type: 'geojson',
    data: 'https://data.cityofnewyork.us/resource/43hw-uvdj.geojson',
    cluster: true,
    clusterMaxZoom: 14, // Max zoom to cluster points on
    clusterRadius: 50
  });


  map.addControl(new mapboxgl.NavigationControl());

  fetch('https://data.cityofnewyork.us/resource/43hw-uvdj.geojson')
    .then(response => response.json())
    .then(data => {
      data.features.forEach(feature => {
        const { city, name } = feature.properties;
        const [lng, lat] = feature.geometry.coordinates;

        // Create a DOM element for the marker
        const el = document.createElement('div');
        el.className = 'custom-marker';

        // Assign a color based on city (borough)
        let color = '#CDC6A5'; // default
        if (city === 'New York') color = '#FCAA67';
        else if (city === 'Brooklyn') color = '#B0413E';
        else if (city === 'Bronx') color = '#548687';
        else if (city === 'Staten Island') color = '#473335';

        el.innerHTML = `<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
	 width="20px" height="20px" viewBox="0 0 256 253" fill="${color}" enable-background="new 0 0 256 253" xml:space="preserve">
<path d="M185.489,154.208c0,0-23.61-30.526-57.724-37.078c-43.423-8.425-61,19.709-63.652,38.899
	c-4.68,33.646,32.346,52.939,49.299,58.14c41.967,12.793,55.8-1.924,57.724-11.441c1.768-9.049-17.837-15.497-14.457-25.066
	c3.068-8.737,22.621,8.581,29.59,2.132C188.609,177.662,196.046,168.821,185.489,154.208z M90.843,165.909
	c-1.04,4.316-5.46,7.02-9.777,5.928c-4.316-1.04-7.02-5.46-5.928-9.777c1.04-4.316,5.46-7.02,9.777-5.928
	C89.231,157.172,91.935,161.592,90.843,165.909z M94.015,150.516c-4.316-1.04-7.02-5.46-5.928-9.777
	c1.04-4.316,5.46-7.02,9.777-5.928c4.316,1.04,7.02,5.46,5.928,9.777C102.752,148.904,98.331,151.608,94.015,150.516z
	 M106.132,185.982c-1.04,4.316-5.46,7.02-9.777,5.928c-4.316-1.04-7.02-5.46-5.928-9.777c1.04-4.316,5.46-7.02,9.777-5.928
	C104.572,177.246,107.172,181.666,106.132,185.982z M119.029,146.98c-4.316-1.092-7.02-5.512-5.928-9.829
	c1.04-4.316,5.46-7.02,9.777-5.928c4.316,1.04,7.02,5.46,5.928,9.777C127.765,145.367,123.345,148.02,119.029,146.98z
	 M129.378,197.579c-1.04,4.316-5.46,7.02-9.777,5.928c-4.316-1.04-7.02-5.46-5.928-9.777c1.04-4.316,5.46-7.02,9.777-5.928
	C127.765,188.842,130.418,193.211,129.378,197.579z M2,69c0,13.678,9.625,25.302,22,29.576V233H2v18h252v-18h-22V98.554
	c12.89-3.945,21.699-15.396,22-29.554v-8H2V69z M65.29,68.346c0,6.477,6.755,31.47,31.727,31.47
	c21.689,0,31.202-19.615,31.202-31.47c0,11.052,7.41,31.447,31.464,31.447c21.733,0,31.363-20.999,31.363-31.447
	c0,14.425,9.726,26.416,22.954,30.154V233H42V98.594C55.402,94.966,65.29,82.895,65.29,68.346z M254,54H2l32-32V2h189v20h-0.168
	L254,54z"/>
</svg>`;

        // Add marker to map
        // Add marker to map
        const marker = new mapboxgl.Marker(el)
          .setLngLat([lng, lat])
          .addTo(map);

        const popup = new mapboxgl.Popup({
          closeButton: false,
          closeOnClick: false
        });

        el.addEventListener('mouseenter', () => {
          popup.setLngLat([lng, lat])
            .setHTML(`<strong>${name}</strong><br>${city}<br><em>${feature.properties.tel || 'No phone listed'}</em>`)
            .addTo(map);
          map.getCanvas().style.cursor = 'pointer';
        });

        el.addEventListener('mouseleave', () => {
          popup.remove();
          map.getCanvas().style.cursor = '';
        });

      });
    });
})


// code to change the color of the SVG icon
const slider = $("#light-slider");

function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

slider.on("input", function () {
  const randomColor = getRandomColor();
  $("#art").css({
    stroke: randomColor,
    fill: randomColor
  });
});




