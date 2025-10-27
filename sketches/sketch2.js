// Instance-mode sketch for tab 2
registerSketch('sk2', function (p) {
  let colorStops = [];
  
  p.setup = function () {
    p.createCanvas(800, 800);
    p.textFont('Arial');
    
    // Define color stops for the gradient (hour: color)
    colorStops = [
      { hour: 0, color: [25, 25, 112], label: 'Midnight', temp: 'Cold' },      // Midnight blue
      { hour: 3, color: [0, 0, 139], label: '3 AM', temp: 'Coldest' },         // Dark blue
      { hour: 6, color: [135, 206, 250], label: 'Dawn', temp: 'Cool' },        // Sky blue
      { hour: 9, color: [255, 255, 100], label: 'Morning', temp: 'Warm' },     // Yellow
      { hour: 12, color: [255, 140, 0], label: 'Noon', temp: 'Hot' },          // Orange
      { hour: 15, color: [255, 69, 0], label: 'Afternoon', temp: 'Hot' },      // Red-orange
      { hour: 18, color: [255, 105, 180], label: 'Sunset', temp: 'Warm' },     // Pink
      { hour: 21, color: [138, 43, 226], label: 'Evening', temp: 'Cool' },     // Purple
      { hour: 24, color: [25, 25, 112], label: 'Midnight', temp: 'Cold' }      // Back to midnight blue
    ];
  };};

  p.draw = function () {
    p.background(30);
    
    // Get current time
    let h = p.hour();
    let m = p.minute();
    let s = p.second();
    let currentTime = h + m / 60 + s / 3600; // Precise decimal hour
    
    // Draw the main gradient bar
    drawGradientBar(currentTime);
    
    // Draw time markers
    drawTimeMarkers();
    
    // Draw current time indicator
    drawCurrentTimeIndicator(currentTime);
    
    // Draw digital time display
    drawTimeDisplay(h, m, s);
    
    // Draw temperature label
    drawTemperatureLabel(currentTime);
  };
  
  function drawGradientBar(currentTime) {
    let barX = 100;
    let barY = 300;
    let barWidth = 600;
    let barHeight = 200;

    // Draw gradient by interpolating between color stops
    p.noStroke();
    for (let i = 0; i < barWidth; i++) {
      let mappedHour = p.map(i, 0, barWidth, 0, 24);
      let col = getColorForHour(mappedHour);
      p.fill(col);
      p.rect(barX + i, barY, 1, barHeight);
    }
    
    // Draw border
    p.noFill();
    p.stroke(255);
    p.strokeWeight(3);
    p.rect(barX, barY, barWidth, barHeight);
  }
});
