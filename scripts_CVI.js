mapboxgl.accessToken = 'pk.eyJ1Ijoieml3ZWkwMjMiLCJhIjoiY204dnc5dXpoMTIwdTJrcTFvdG9xcWcycCJ9.gn8PHOvdBmJ6_U_O1zlvqA';

// Store the default view
const initialCenter = [-73.97234, 40.66722];
const initialZoom = 9.9;


const map = new mapboxgl.Map({
  container: 'map-CVI', // container ID
  style: 'mapbox://styles/ziwei023/cm9w0bfnh00op01qs7ktw1tq5',
  center: [-73.97234, 40.66722], // starting position [lng, lat]. 
  zoom: 9.9,
  minZoom: 9.7,
  maxZoom: 11.5
});

map.on('load', function () {
  map.addSource('CVI-index', {
    type: 'geojson',
    data: './Neighborhood_all_index.geojson',
  });

  map.addSource('active-neighborhood', {
    type: 'geojson',
    data: { type: 'FeatureCollection', features: [] }
  });

  map.addControl(new mapboxgl.NavigationControl());

  map.addLayer({
    'id': 'CVI-index-layer',
    'type': 'fill',
    'source': 'CVI-index',
    paint: {
      'fill-color': [
        'step', ['get', 'CVI - Mean (Rank)'],
        '#2e954f',       // Class 1: best (green)
        53, '#a8d971',   // Class 2
        105, '#fafabe',  // Class 3 (mid)
        157, '#fdae61',  // Class 4
        209, '#c31417',  // Class 5
        262, '#7f0e0e'   // Class 6: worst (dark red)
      ],
      'fill-opacity': 0.9,
    }
  });

  // Add an outline around each CVI polygon
  map.addLayer({
    id: 'CVI-index-outline',
    type: 'line',
    source: 'CVI-index',
    paint: {
      'line-color': '#f7f7f7',  // border color
      'line-width': 1           // border width
    }
  });

  // Layer to mask inactive neighborhoods
  map.addLayer({
    id: 'inactive-mask',
    type: 'fill',
    source: 'CVI-index',
    layout: { 'visibility': 'none' },
    paint: {
      'fill-color': 'rgba(200, 200, 200, 0.58)',
      'fill-opacity': 1
    }
  });


    // Add an outline around the selected neighborhood
    map.addLayer({
      id: 'active-neighborhood-outline',
      type: 'line',
      source: 'active-neighborhood',
      paint: {
        'line-color': '#000000',        // outline color
        'line-width': 4                 // outline width
      }
    });

    // Update sidebar on polygon click
    map.on('click', 'CVI-index-layer', (e) => {
      // e.features[0] is the clicked feature
      const feature = e.features[0];
      // Build HTML content from properties
      const props = feature.properties;

      document.getElementById('nta-name').textContent = props['ntaname'] || 'Unknown';
      document.getElementById('cvi-rank').textContent = props['CVI - Mean (Rank)'] || 'N/A';
      // Avg Surface Temp
      const temp = parseFloat(props['MEAN']);
      document.getElementById('surface-temp').textContent =
        isNaN(temp) ? 'N/A' : temp.toFixed(2);    // two decimal places

      // % Land under Flood Risk
      const flood = parseFloat(props['Moderate_Flood_2050_Percent']);
      document.getElementById('flood-risk').textContent =
        isNaN(flood) ? 'N/A' : flood.toFixed(2);   // two decimal places

      const restroom = parseFloat(props['Restroom_density']);
      document.getElementById('restroom').textContent =
        isNaN(restroom) ? 'N/A' : restroom.toFixed(2);   // two decimal places
      // document.getElementById('restroom').textContent = props['Restroom_density'] || 'Unknown';
      document.getElementById('infra-index').textContent = props['Infrastructure_score - Mean (Rank)'] || 'N/A';


      // Highlight clicked polygon
      map.getSource('active-neighborhood').setData(feature);

      // Show mask layer when a selection is made
      map.setLayoutProperty('inactive-mask', 'visibility', 'visible');

      // Mask all other neighborhoods except the selected one
      map.setFilter('inactive-mask', ['!=', ['get', 'ntaname'], props['ntaname']]);

      // Fly to the clicked neighborhood
      map.flyTo({
        center: e.lngLat,
        zoom: 11.5,
        speed: 0.7, 
      });
    });

    // Change cursor to pointer when hovering
    map.on('mouseenter', 'CVI-index-layer', () => {
      map.getCanvas().style.cursor = 'pointer';
    });
    map.on('mouseleave', 'CVI-index-layer', () => {
      map.getCanvas().style.cursor = '';
    });

      // Clear selection button handler
  document.getElementById('clear-selection').addEventListener('click', () => {
    // Clear the active highlight
    map.getSource('active-neighborhood').setData({ type: 'FeatureCollection', features: [] });
    // Hide the mask layer
    map.setLayoutProperty('inactive-mask', 'visibility', 'none');
    // Reset sidebar fields
    ['nta-name','cvi-rank','surface-temp','flood-risk','restroom','infra-index']
      .forEach(id => document.getElementById(id).textContent = '');
    // Fly back to default view
    map.flyTo({ center: initialCenter, zoom: initialZoom, speed: 0.7, curve: 1.4, essential: true });
  });

    
  });

  