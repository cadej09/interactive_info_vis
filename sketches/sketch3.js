// Instance-mode sketch for tab 3
registerSketch('sk3', function (p) {
  let waterDrops = [];
  
  p.setup = function () {
    p.createCanvas(800, 800);
    p.textFont('Arial');
  };
  
  p.draw = function () {
    p.background(240, 248, 255); // Light blue background

    // Get current time
    let h = p.hour();
    let m = p.minute();
    let s = p.second();
    
    // Determine if daytime or nighttime
    let isDaytime = (h >= 6 && h < 18);
    
    // Calculate progress through current phase (0 to 1)
    let progress = 0;
    if (isDaytime) {
      // 6am to 6pm = 12 hours
      progress = p.map(h + m / 60 + s / 3600, 6, 18, 0, 1);
      progress = p.constrain(progress, 0, 1);
    } else {
      // 6pm to 6am (next day) = 12 hours
      let nightHour = h >= 18 ? h : h + 24; // Convert to 18-30 scale
      progress = p.map(nightHour + m / 60 + s / 3600, 18, 30, 0, 1);
      progress = p.constrain(progress, 0, 1);
    }

    // Calculate water levels
    // During day: left starts full (1) and empties to (0)
    // During night: left starts empty (0) and fills to (1)
    let leftWaterLevel = isDaytime ? (1 - progress) : progress;
    let rightWaterLevel = 1 - leftWaterLevel;
    
    // Draw buckets
    drawBucket(150, 250, 200, 400, leftWaterLevel, 'LEFT');
    drawBucket(450, 250, 200, 400, rightWaterLevel, 'RIGHT');
    
    // Draw flow indicator
    drawFlowIndicator(isDaytime, progress);
    
    // Draw sun/moon indicator
    drawDayNightIndicator(isDaytime);
    
    // Draw time display
    drawTimeDisplay(h, m, s, isDaytime);
    
    // Draw phase label
    drawPhaseLabel(isDaytime, progress);
    
    // Update and draw water drops
    updateWaterDrops(isDaytime);
    drawWaterDrops();
  };
