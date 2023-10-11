$(document).ready(function() {
  $('#addMarker').click(function() {
    addMarker();
  });

  function addMarker() {
    const $markersContainer = $('.markers-container');
    const $newMarker = $('<div>', { class: 'marker' });

    $newMarker.appendTo($markersContainer);
  }
});
