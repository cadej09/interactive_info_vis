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

  function getColorForHour(hour) {
    // Find the two color stops to interpolate between
    for (let i = 0; i < colorStops.length - 1; i++) {
      if (hour >= colorStops[i].hour && hour <= colorStops[i + 1].hour) {
        let t = p.map(hour, colorStops[i].hour, colorStops[i + 1].hour, 0, 1);
        let c1 = p.color(colorStops[i].color);
        let c2 = p.color(colorStops[i + 1].color);
        return p.lerpColor(c1, c2, t);
      }
    }
    return p.color(colorStops[0].color);
  }

  function drawTimeMarkers() {
    let barX = 100;
    let barY = 300;
    let barWidth = 600;
    let barHeight = 200;
    
    // Draw markers for key hours (0, 6, 12, 18, 24)
    p.stroke(255);
    p.strokeWeight(2);
    p.fill(255);
    p.textAlign(p.CENTER, p.TOP);
    p.textSize(14);
    
    for (let i = 0; i <= 24; i += 6) {
      let x = p.map(i, 0, 24, barX, barX + barWidth);
      
      // Draw tick mark
      p.line(x, barY, x, barY - 10);
      p.line(x, barY + barHeight, x, barY + barHeight + 10);
      
      // Draw hour label
      let hourLabel = i === 24 ? '12 AM' : (i === 0 ? '12 AM' : (i < 12 ? i + ' AM' : (i === 12 ? '12 PM' : (i - 12) + ' PM')));
      p.text(hourLabel, x, barY + barHeight + 20);
    }
  }
function drawCurrentTimeIndicator(currentTime) {
    let barX = 100;
    let barY = 300;
    let barWidth = 600;
    let barHeight = 200;
    
    // Calculate x position for current time
    let x = p.map(currentTime, 0, 24, barX, barX + barWidth);
    
    // Draw indicator line
    p.stroke(255);
    p.strokeWeight(4);
    p.line(x, barY - 30, x, barY + barHeight + 30);
    
    // Draw indicator circle
    p.fill(255);
    p.noStroke();
    p.ellipse(x, barY + barHeight / 2, 20, 20);
    
    // Draw glow effect
    p.fill(255, 255, 255, 100);
    p.ellipse(x, barY + barHeight / 2, 35, 35);
    p.fill(255, 255, 255, 50);
    p.ellipse(x, barY + barHeight / 2, 50, 50);
  }
  
});
