// Instance-mode sketch for tab 4
registerSketch('sk4', function (p) {
  let activities = [];
  let currentActivity = null;
  
  p.setup = function () {
    p.createCanvas(800, 800);
    p.textFont('Arial');
    
    // Define all activities in a 24-hour day
    activities = [
      {start: 0, end: 6, name: "Sleeping", icon: "sleep", color: [50, 50, 120], bgColor: [20, 20, 60]},
      {start: 6, end: 7, name: "Waking Up", icon: "wake", color: [255, 200, 100], bgColor: [255, 240, 200]},
      {start: 7, end: 8, name: "Morning Routine", icon: "morning", color: [100, 180, 220], bgColor: [200, 230, 250]},
      {start: 8, end: 9, name: "Commuting", icon: "commute", color: [150, 150, 150], bgColor: [220, 220, 220]},
      {start: 9, end: 12, name: "Working", icon: "work", color: [80, 120, 180], bgColor: [200, 220, 240]},
      {start: 12, end: 13, name: "Lunch Break", icon: "lunch", color: [255, 180, 80], bgColor: [255, 240, 200]},
      {start: 13, end: 17, name: "Working", icon: "work", color: [80, 120, 180], bgColor: [200, 220, 240]},
      {start: 17, end: 18, name: "Commuting Home", icon: "commute", color: [150, 150, 150], bgColor: [220, 220, 220]},
      {start: 18, end: 19, name: "Dinner Time", icon: "dinner", color: [255, 120, 80], bgColor: [255, 220, 200]},
      {start: 19, end: 21, name: "Exercise", icon: "exercise", color: [100, 200, 100], bgColor: [220, 255, 220]},
      {start: 21, end: 22, name: "Relaxing", icon: "relax", color: [180, 120, 200], bgColor: [240, 220, 255]},
      {start: 22, end: 23, name: "Showering", icon: "shower", color: [100, 200, 255], bgColor: [200, 240, 255]},
      {start: 23, end: 24, name: "Going to Bed", icon: "bed", color: [70, 70, 140], bgColor: [40, 40, 80]}
    ];
  };

    
  p.draw = function () {
    // Get current time
    let h = p.hour();
    let m = p.minute();
    let s = p.second();
    let currentTime = h + m / 60 + s / 3600;
    
    // Find current activity
    currentActivity = findCurrentActivity(currentTime);
    
    // Draw background based on current activity
    if (currentActivity) {
      let bgColor = p.color(currentActivity.bgColor);
      p.background(bgColor);
    } else {
      p.background(240);
    }
    
    // Draw 24-hour circle with all activities
    drawActivityCircle(currentTime);
    
    // Draw current activity in center
    drawCurrentActivityCenter(currentTime);
    
    // Draw time display
    drawTimeDisplay(h, m, s);
  };

  function findCurrentActivity(time) {
    for (let activity of activities) {
      if (time >= activity.start && time < activity.end) {
        return activity;
      }
    }
    return activities[0]; // Default to first activity
  }

  function drawActivityCircle(currentTime) {
    let centerX = 400;
    let centerY = 400;
    let radius = 280;
    
    // Draw each activity as a slice in the circle
    p.push();
    p.translate(centerX, centerY);
    
    for (let i = 0; i < activities.length; i++) {
      let activity = activities[i];
      let startAngle = p.map(activity.start, 0, 24, 0, p.TWO_PI) - p.HALF_PI;
      let endAngle = p.map(activity.end, 0, 24, 0, p.TWO_PI) - p.HALF_PI;
      let midAngle = (startAngle + endAngle) / 2;
      
      // Check if this is the current activity
      let isCurrent = (currentTime >= activity.start && currentTime < activity.end);
      
      // Draw activity arc
      p.noStroke();
      if (isCurrent) {
        p.fill(activity.color[0], activity.color[1], activity.color[2], 255);
      } else {
        p.fill(activity.color[0], activity.color[1], activity.color[2], 100);
      }
      
      let arcRadius = isCurrent ? radius + 20 : radius;
      p.arc(0, 0, arcRadius * 2, arcRadius * 2, startAngle, endAngle, p.PIE);
      
      // Draw activity label and icon
      let labelRadius = radius + 50;
      let labelX = p.cos(midAngle) * labelRadius;
      let labelY = p.sin(midAngle) * labelRadius;
      
      p.push();
      p.translate(labelX, labelY);
      
      if (isCurrent) {
        p.fill(255);
        p.textSize(14);
        p.textStyle(p.BOLD);
      } else {
        p.fill(100);
        p.textSize(11);
        p.textStyle(p.NORMAL);
      }
      
      p.textAlign(p.CENTER, p.CENTER);
      p.text(activity.name, 0, 0);
      p.pop();
    }

     // Draw current time indicator
    let timeAngle = p.map(currentTime, 0, 24, 0, p.TWO_PI) - p.HALF_PI;
    p.stroke(255, 0, 0);
    p.strokeWeight(4);
    let indicatorX = p.cos(timeAngle) * (radius + 40);
    let indicatorY = p.sin(timeAngle) * (radius + 40);
    p.line(0, 0, indicatorX, indicatorY);
    
    // Draw indicator dot
    p.fill(255, 0, 0);
    p.noStroke();
    p.ellipse(indicatorX, indicatorY, 15, 15);
    
    p.pop();
  }

  function drawCurrentActivityCenter(currentTime) {
    if (!currentActivity) return;
    
    let centerX = 400;
    let centerY = 400;
    
    // Draw activity name
    p.fill(50);
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(32);
    p.textStyle(p.BOLD);
    p.text(currentActivity.name, centerX, centerY - 100);
    
    // Draw character doing the activity
    p.push();
    p.translate(centerX, centerY);
    drawActivityIcon(currentActivity.icon, 0, 0, 1.5);
    p.pop();
  }

  function drawActivityIcon(iconName, x, y, scale) {
    p.push();
    p.translate(x, y);
    p.scale(scale);
    
    switch(iconName) {
      case "sleep":
        drawSleepingIcon();
        break;
      case "wake":
        drawWakingIcon();
        break;
      case "morning":
        drawMorningRoutineIcon();
        break;
      case "commute":
        drawCommuteIcon();
        break;
      case "work":
        drawWorkIcon();
        break;
      case "lunch":
        drawLunchIcon();
        break;
      case "dinner":
        drawDinnerIcon();
        break;
      case "exercise":
        drawExerciseIcon();
        break;
      case "relax":
        drawRelaxIcon();
        break;
      case "shower":
        drawShowerIcon();
        break;
      case "bed":
        drawBedIcon();
        break;
    }
    
    p.pop();
  }

  function drawSleepingIcon() {
    // Bed
    p.fill(139, 69, 19);
    p.rect(-40, 20, 80, 10);
    
    // Person lying down
    p.fill(255, 220, 177);
    p.ellipse(0, 0, 30, 30); // Head
    p.fill(100, 150, 200);
    p.rect(-20, 5, 40, 20); // Body (blanket)
    
    // ZZZ
    p.fill(100);
    p.textSize(20);
    p.text('Z', 25, -15);
    p.text('Z', 30, -25);
    p.text('Z', 35, -35);
  }

  function drawWakingIcon() {
    // Person stretching
    p.fill(255, 220, 177);
    p.ellipse(0, -20, 25, 25); // Head
    p.fill(100, 150, 200);
    p.rect(-10, -5, 20, 30); // Body
    
    // Arms stretching up
    p.stroke(255, 220, 177);
    p.strokeWeight(5);
    p.line(-10, 0, -25, -25);
    p.line(10, 0, 25, -25);
    
    // Legs
    p.line(-5, 25, -10, 40);
    p.line(5, 25, 10, 40);
    p.noStroke();
    
    // Sun rays
    p.stroke(255, 200, 0);
    p.strokeWeight(3);
    for (let i = 0; i < 8; i++) {
      let angle = i * p.PI / 4;
      p.line(35 + p.cos(angle) * 8, -35 + p.sin(angle) * 8,
             35 + p.cos(angle) * 15, -35 + p.sin(angle) * 15);
    }
    p.noStroke();
  }

   function drawMorningRoutineIcon() {
    // Person with toothbrush and coffee
    p.fill(255, 220, 177);
    p.ellipse(0, -10, 25, 25); // Head
    p.fill(100, 150, 200);
    p.rect(-10, 5, 20, 30); // Body
    
    // Arms
    p.stroke(255, 220, 177);
    p.strokeWeight(5);
    p.line(-10, 10, -20, 5); // Left arm
    p.line(10, 10, 20, 5);   // Right arm
    p.noStroke();
    
    // Toothbrush
    p.fill(200);
    p.rect(-25, 0, 3, 15);
    p.fill(0, 200, 255);
    p.rect(-26, 0, 5, 5);
    
    // Coffee cup
    p.fill(139, 69, 19);
    p.rect(18, 3, 12, 15);
    p.fill(150, 75, 0);
    p.rect(18, 3, 12, 8);
    
    // Steam
    p.stroke(150);
    p.strokeWeight(2);
    p.noFill();
    p.bezier(24, 0, 22, -5, 26, -8, 24, -12);
  }

   function drawCommuteIcon() {
    // Simple car
    p.fill(200, 50, 50);
    p.rect(-25, 5, 50, 20, 5);
    p.rect(-15, -5, 30, 15, 5);
    
    // Windows
    p.fill(150, 200, 255);
    p.rect(-12, -3, 10, 10);
    p.rect(2, -3, 10, 10);
    
    // Wheels
    p.fill(50);
    p.ellipse(-15, 25, 12, 12);
    p.ellipse(15, 25, 12, 12);
    
    // Motion lines
    p.stroke(100);
    p.strokeWeight(2);
    p.line(-35, 10, -45, 10);
    p.line(-35, 20, -45, 20);
    p.noStroke();
  }

   function drawWorkIcon() {
    // Desk
    p.fill(139, 69, 19);
    p.rect(-30, 10, 60, 5);
    p.rect(-28, 15, 3, 20);
    p.rect(25, 15, 3, 20);
    
    // Computer
    p.fill(80);
    p.rect(-15, -5, 30, 20);
    p.fill(100, 200, 100);
    p.rect(-13, -3, 26, 15);
    
    // Person sitting
    p.fill(255, 220, 177);
    p.ellipse(0, -25, 20, 20); // Head
    p.fill(100, 150, 200);
    p.rect(-8, -15, 16, 25); // Body
    
    // Arms typing
    p.stroke(255, 220, 177);
    p.strokeWeight(4);
    p.line(-8, -5, -15, 5);
    p.line(8, -5, 15, 5);
    p.noStroke();
  }

  function drawLunchIcon() {
    // Plate
    p.fill(240);
    p.stroke(100);
    p.strokeWeight(2);
    p.ellipse(0, 10, 50, 50);
    p.noStroke();
    
    // Food
    p.fill(255, 150, 100);
    p.ellipse(-10, 5, 15, 15);
    p.fill(100, 200, 100);
    p.ellipse(10, 8, 12, 12);
    p.fill(255, 200, 100);
    p.ellipse(0, 15, 18, 10);
    
    // Fork
    p.fill(200);
    p.rect(-25, -5, 3, 25);
    p.line(-28, -5, -22, -5);
    p.line(-28, 0, -22, 0);
    
    // Person's head
    p.fill(255, 220, 177);
    p.ellipse(0, -25, 22, 22);
    
    // Smile
    p.noFill();
    p.stroke(150, 100, 100);
    p.strokeWeight(2);
    p.arc(0, -23, 12, 12, 0, p.PI);
    p.noStroke();
  }

  function drawDinnerIcon() {
    // Similar to lunch but with different food
    drawLunchIcon();
  }


  function drawExerciseIcon() {
    // Person with dumbbells
    p.fill(255, 220, 177);
    p.ellipse(0, -20, 25, 25); // Head
    p.fill(100, 150, 200);
    p.rect(-10, -5, 20, 30); // Body
    
    // Arms with dumbbells
    p.stroke(255, 220, 177);
    p.strokeWeight(5);
    p.line(-10, 0, -30, -10);
    p.line(10, 0, 30, -10);
    p.noStroke();
    
    // Dumbbells
    p.fill(80);
    p.rect(-35, -13, 10, 6);
    p.rect(25, -13, 10, 6);
    p.fill(150);
    p.rect(-37, -15, 3, 10);
    p.rect(-26, -15, 3, 10);
    p.rect(25, -15, 3, 10);
    p.rect(36, -15, 3, 10);
    
    // Legs
    p.stroke(255, 220, 177);
    p.strokeWeight(5);
    p.line(-5, 25, -10, 40);
    p.line(5, 25, 10, 40);
    p.noStroke();
    
    // Sweat drops
    p.fill(100, 150, 255);
    p.ellipse(-15, -15, 5, 8);
    p.ellipse(15, -15, 5, 8);
  }

  function drawRelaxIcon() {
    // Couch
    p.fill(139, 69, 19);
    p.rect(-35, 15, 70, 20, 5);
    p.rect(-35, 10, 10, 25);
    p.rect(25, 10, 10, 25);
    
    // Person relaxing
    p.fill(255, 220, 177);
    p.ellipse(-10, 0, 20, 20); // Head
    p.fill(100, 150, 200);
    p.rect(-20, 10, 30, 15); // Body lying
    
    // TV
    p.fill(50);
    p.rect(-15, -25, 30, 20);
    p.fill(100, 150, 255);
    p.rect(-13, -23, 26, 16);
  }