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

  function drawBucket(x, y, w, h, waterLevel, label) {
    // Draw bucket outline
    p.stroke(60);
    p.strokeWeight(4);
    p.noFill();
    p.rect(x, y, w, h);
    
    // Draw water
    let waterHeight = h * waterLevel;
    p.noStroke();
    p.fill(100, 150, 255, 200);
    p.rect(x, y + h - waterHeight, w, waterHeight);
    
    // Draw water surface with waves
    p.stroke(80, 130, 235);
    p.strokeWeight(2);
    p.noFill();
    let waveY = y + h - waterHeight;
    p.beginShape();
    for (let i = 0; i <= w; i += 10) {
      let wave = p.sin((p.frameCount * 0.05) + i * 0.1) * 3;
      p.vertex(x + i, waveY + wave);
    }
    p.endShape();
    
    // Draw hour markers on bucket
    p.stroke(100);
    p.strokeWeight(1);
    p.fill(100);
    p.textAlign(p.RIGHT, p.CENTER);
    p.textSize(12);
    
    for (let i = 0; i <= 4; i++) {
      let markerY = y + (h * i / 4);
      p.line(x - 5, markerY, x, markerY);
      let hourLabel = (4 - i) * 3; // 12, 9, 6, 3, 0 hours
      p.text(hourLabel + 'h', x - 10, markerY);
    }

    // Draw percentage
    p.noStroke();
    p.fill(60);
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(24);
    let percentage = Math.round(waterLevel * 100);
    p.text(percentage + '%', x + w / 2, y + h / 2);
    
    // Draw bucket label
    p.textSize(16);
    p.fill(100);
    p.text(label, x + w / 2, y - 20);
  }

   function drawFlowIndicator(isDaytime, progress) {
    // Draw pipe connecting buckets
    let pipeY = 450;
    p.stroke(120);
    p.strokeWeight(6);
    p.line(350, pipeY, 450, pipeY);
    
    // Draw arrow showing direction
    let arrowX = 400;
    let arrowDirection = isDaytime ? 1 : -1; // Right for day, left for night
    
    p.fill(120);
    p.noStroke();
    p.push();
    p.translate(arrowX, pipeY);
    p.rotate(arrowDirection === 1 ? 0 : p.PI);
    p.triangle(0, -10, 0, 10, 20, 0);
    p.pop();
    
    // Draw flow label
    p.fill(80);
    p.textAlign(p.CENTER, p.TOP);
    p.textSize(14);
    let flowText = isDaytime ? 'Day Flow →' : '← Night Flow';
    p.text(flowText, 400, pipeY + 20);
  }

  function drawDayNightIndicator(isDaytime) {
    let x = 400;
    let y = 150;
    
    if (isDaytime) {
      // Draw sun
      p.fill(255, 220, 0);
      p.noStroke();
      p.ellipse(x, y, 60, 60);
      
      // Sun rays
      p.stroke(255, 220, 0);
      p.strokeWeight(3);
      for (let i = 0; i < 8; i++) {
        let angle = (p.TWO_PI / 8) * i;
        let x1 = x + p.cos(angle) * 40;
        let y1 = y + p.sin(angle) * 40;
        let x2 = x + p.cos(angle) * 55;
        let y2 = y + p.sin(angle) * 55;
        p.line(x1, y1, x2, y2);
      }
      
      p.noStroke();
      p.fill(100);
      p.textAlign(p.CENTER, p.TOP);
      p.textSize(18);
      p.text('DAYTIME', x, y + 50);
    } else {
      // Draw moon
      p.fill(220, 220, 240);
      p.noStroke();
      p.ellipse(x, y, 60, 60);
      
      // Moon craters
      p.fill(200, 200, 220);
      p.ellipse(x - 10, y - 10, 15, 15);
      p.ellipse(x + 15, y + 5, 12, 12);
      p.ellipse(x - 5, y + 15, 10, 10);
      
      // Stars
      p.fill(255, 255, 150);
      for (let i = 0; i < 5; i++) {
        let starX = x + (i - 2) * 40;
        let starY = y + p.sin(i) * 30;
        drawStar(starX, starY, 3, 6, 5);
      }
      
      p.noStroke();
      p.fill(100);
      p.textAlign(p.CENTER, p.TOP);
      p.textSize(18);
      p.text('NIGHTTIME', x, y + 50);
    }
  }

  function drawStar(x, y, radius1, radius2, npoints) {
    let angle = p.TWO_PI / npoints;
    let halfAngle = angle / 2.0;
    p.beginShape();
    for (let a = -p.PI / 2; a < p.TWO_PI - p.PI / 2; a += angle) {
      let sx = x + p.cos(a) * radius2;
      let sy = y + p.sin(a) * radius2;
      p.vertex(sx, sy);
      sx = x + p.cos(a + halfAngle) * radius1;
      sy = y + p.sin(a + halfAngle) * radius1;
      p.vertex(sx, sy);
    }
    p.endShape(p.CLOSE);
  }


  function drawTimeDisplay(h, m, s, isDaytime) {
    // Display current time
    p.fill(60);
    p.noStroke();
    p.textAlign(p.CENTER, p.TOP);
    p.textSize(36);
    let timeString = p.nf(h, 2) + ':' + p.nf(m, 2) + ':' + p.nf(s, 2);
    p.text(timeString, 400, 700);
    
    let period = h >= 12 ? 'PM' : 'AM';
    p.textSize(20);
    p.text(period, 400, 745);
  }

   function drawPhaseLabel(isDaytime, progress) {
    p.fill(80);
    p.noStroke();
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(16);
    
    let phaseText = '';
    if (isDaytime) {
      phaseText = 'Energy depleting through the day';
    } else {
      phaseText = 'Energy restoring through the night';
    }
    p.text(phaseText, 400, 220);
    
    // Progress bar
    let barWidth = 300;
    let barHeight = 10;
    let barX = 400 - barWidth / 2;
    let barY = 240;
    
    // Background
    p.noStroke();
    p.fill(200);
    p.rect(barX, barY, barWidth, barHeight, 5);
    
    // Progress
    let progressColor = isDaytime ? p.color(255, 150, 0) : p.color(100, 150, 255);
    p.fill(progressColor);
    p.rect(barX, barY, barWidth * progress, barHeight, 5);
  }

  function updateWaterDrops(isDaytime) {
    // Add new drops occasionally
    if (p.frameCount % 15 === 0) {
      let drop = {
        x: isDaytime ? 350 : 450,
        y: 450,
        vx: isDaytime ? 2 : -2,
        vy: 0,
        size: p.random(4, 8)
      };
      waterDrops.push(drop);
    }
    
    // Update existing drops
    for (let i = waterDrops.length - 1; i >= 0; i--) {
      let drop = waterDrops[i];
      drop.x += drop.vx;
      drop.y += drop.vy;
      drop.vy += 0.3; // Gravity
      
      // Remove drops that are out of bounds
      if (drop.y > 800 || drop.x < 0 || drop.x > 800) {
        waterDrops.splice(i, 1);
      }
    }
  }

  function drawWaterDrops() {
    p.noStroke();
    p.fill(100, 150, 255, 180);
    for (let drop of waterDrops) {
      p.ellipse(drop.x, drop.y, drop.size, drop.size);
    }
  }
  
  p.windowResized = function () {
    p.resizeCanvas(800, 800);
  };
});