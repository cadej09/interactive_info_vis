let data = [
  { level: "EN", salary: 63799 },
  { level: "MI", salary: 88565 },
  { level: "SE", salary: 123311 },
  { level: "EX", salary: 188028 }
];

function setup() {
  createCanvas(1080, 1350); // Ideal Instagram dimension
  textFont("Helvetica");
  noLoop();
}

function draw() {
  background(250);
  
  // Title
  textSize(42);
  textAlign(CENTER);
  text("The Salary Jump That Changes AI Careers", width/2, 80);
  
  textSize(24);
  text("Median salary by experience level (USD)", width/2, 120);
  
  // Chart Area
  let left = 150;
  let right = 150;
  let bottom = height - 200;
  let top = 200;
  let maxSalary = 200000;

  stroke(220);
  strokeWeight(2);
  // horizontal gridlines
  for (let i = 0; i <= 4; i++) {
    let y = map(i, 0, 4, bottom, top);
    line(left, y, width - right, y);
  }
  