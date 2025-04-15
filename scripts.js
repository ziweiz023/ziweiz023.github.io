mapboxgl.accessToken = 'pk.eyJ1Ijoieml3ZWkwMjMiLCJhIjoiY204dnc5dXpoMTIwdTJrcTFvdG9xcWcycCJ9.gn8PHOvdBmJ6_U_O1zlvqA';

const map = new mapboxgl.Map({
  container: 'map', // container ID
  style: 'mapbox://styles/mapbox/light-v11',
  center: [-73.97234, 40.73422], // starting position [lng, lat]. 
  zoom: 10.3,
  // bearing: 117
});


map.on('load', function () {
  map.addSource('art-galleries', {
    type: 'geojson',
    data: 'https://data.cityofnewyork.us/resource/43hw-uvdj.geojson',
    cluster: true,
    clusterMaxZoom: 14, 
    clusterRadius: 50
  });

  map.addSource('boro_boundaries', {
    type: 'geojson',
    data: './nyc_boros.geojson'
})

  map.addControl(new mapboxgl.NavigationControl());

  map.addLayer({
    id: 'boro-boundaries',
    type: 'line',
    source: 'boro_boundaries',
    paint: {
      'line-color': '#888',
      'line-width': 2
    }
  });


  map.addLayer({
    id: 'clusters',
    type: 'circle',
    source: 'art-galleries',
    filter: ['has', 'point_count'],
    paint: {
        // Use step expressions (https://docs.mapbox.com/style-spec/reference/expressions/#step)
        // with three steps to implement three types of circles:
        //   * Blue, 20px circles when point count is less than 100
        //   * Yellow, 40px circles when point count is between 100 and 300
        //   * Pink, 50px circles when point count is greater than or equal to 300
        'circle-color': [
            'step',
            ['get', 'point_count'],
            '#51bbd6',
            100,
            '#f1f075',
            300,
            '#f28cb1'
        ],
        'circle-radius': [
            'step',
            ['get', 'point_count'],
            20,
            100,
            40,
            300,
            60
        ]
    }
});

map.addLayer({
  id: 'cluster-count',
  type: 'symbol',
  source: 'art-galleries',
  filter: ['has', 'point_count'],
  layout: {
      'text-field': ['get', 'point_count_abbreviated'],
      'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
      'text-size': 12
  }
});

map.addLayer({
  id: 'unclustered-point',
  type: 'circle',
  source: 'art-galleries',
  filter: ['!', ['has', 'point_count']],
  paint: {
    'circle-color': [
      'match',
      ['get', 'city'],
      'New York', '#FCAA67',
      'Brooklyn', '#B0413E',
      'Bronx', '#548687',
      'Staten Island', '#473335',
      /* default */ '#CDC6A5'
    ],
    'circle-radius': 4,
    'circle-stroke-width': 1,
    'circle-stroke-color': '#fff'
  }
});

 // inspect a cluster on click
 map.on('click', 'clusters', (e) => {
  const features = map.queryRenderedFeatures(e.point, {
      layers: ['clusters']
  });
  const clusterId = features[0].properties.cluster_id;
  map.getSource('art-galleries').getClusterExpansionZoom(
      clusterId,
      (err, zoom) => {
          if (err) return;

          map.easeTo({
              center: features[0].geometry.coordinates,
              zoom: zoom
          });
      }
  );
});



let hoveredPopup = null;

map.on('mouseenter', 'unclustered-point', function(e) {
  map.getCanvas().style.cursor = 'pointer';
  const feature = e.features[0];
  // Copy coordinates so they don't get modified unexpectedly.
  const [lng, lat] = feature.geometry.coordinates;
  const props = feature.properties;

  // Close any existing popup before creating a new one.
  if (hoveredPopup) {
    hoveredPopup.remove();
  }

  // Create a new popup at the feature's coordinates.
  hoveredPopup = new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: false,
  })
  .setLngLat([lng, lat])
  .setHTML(
    `<strong>${props.name || "Unnamed Gallery"}</strong>
     <br>${props.address1 || "No address available"}
     <br><em>${props.tel || "No phone listed"}</em>`
  )
  .addTo(map);
});

map.on('mouseleave', 'unclustered-point', function() {
  map.getCanvas().style.cursor = '';
  // Remove the popup if it exists and reset the variable.
  if (hoveredPopup) {
    hoveredPopup.remove();
    hoveredPopup = null;
  }
});
  
map.on('click', 'unclustered-point', (e) => {
  map.flyTo({
      center: e.features[0].geometry.coordinates
  });
});

})



// code to change the color of the SVG icon

function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}


setInterval(function () {
  const randomColor = getRandomColor();
  $("#art").css({
    stroke: randomColor,
    fill: randomColor
  });
}, 3000);


