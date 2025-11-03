// Converted to instance-mode and registered as 'sk5'
registerSketch('sk5', function (p) {
  let data = [
    { level: 'EN', salary: 63799 },
    { level: 'MI', salary: 88565 },
    { level: 'SE', salary: 123311 },
    { level: 'EX', salary: 188028 }
  ];

  p.setup = function () {
    // fixed canvas size (could be adapted to container size)
    p.createCanvas(1080, 1350);
    p.textFont('Helvetica');
    p.noLoop();
  };

  p.draw = function () {
    p.background(250);

    // Title
    p.textSize(42);
    p.textAlign(p.CENTER);
    p.text('The Salary Jump That Changes AI Careers', p.width / 2, 80);

    p.textSize(24);
    p.text('Median salary by experience level (USD)', p.width / 2, 120);

    // Chart Area
    let left = 150;
    let right = 150;
    let bottom = p.height - 200;
    let top = 200;
    let maxSalary = 200000;

    p.stroke(220);
    p.strokeWeight(2);
    // horizontal gridlines
    for (let i = 0; i <= 4; i++) {
      let y = p.map(i, 0, 4, bottom, top);
      p.line(left, y, p.width - right, y);
    }

    // Draw bubbles
    p.noStroke();
    for (let i = 0; i < data.length; i++) {
      let x = p.map(i, 0, data.length - 1, left, p.width - right);
      let y = p.map(data[i].salary, 0, maxSalary, bottom, top);

      // Color gradient EN → EX
      let c = p.lerpColor(p.color(255, 140, 0), p.color(30, 100, 220), i / 3);
      p.fill(c);

      // Bubble size (optional scalability)
      let bubbleSize = 60 + i * 20;
      p.ellipse(x, y, bubbleSize, bubbleSize);

      p.fill(0);
      p.textSize(26);
      p.textAlign(p.CENTER);
      p.text(data[i].level, x, y - bubbleSize / 2 - 15);

      p.textSize(22);
      p.text('$' + p.nf(data[i].salary, 0, 0), x, y + bubbleSize / 2 + 25);
    }

    // Annotation Arrow: MI → SE Jump
    p.stroke(80);
    p.strokeWeight(2);
    p.noFill();
    let x1 = p.map(1, 0, 3, left, p.width - right);
    let y1 = p.map(88565, 0, maxSalary, bottom, top);
    let x2 = p.map(2, 0, 3, left, p.width - right);
    let y2 = p.map(123311, 0, maxSalary, bottom, top);
    p.line(x1 + 40, y1 - 20, x2 - 40, y2 + 20);

    p.noStroke();
    p.textSize(24);
    p.text('~ +40% Jump', (x1 + x2) / 2, (y1 + y2) / 2 - 10);

    // Footnote
    p.fill(120);
    p.textSize(18);
    p.textAlign(p.CENTER);
    p.text('Data: AI Job Market 2025 (synthetic, medians, USD normalized)', p.width / 2, p.height - 60);
  };
});