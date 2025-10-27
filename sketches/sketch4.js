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
