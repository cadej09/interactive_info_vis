// registerSketch('sk5', ...)  // keep your wrapper if your template requires it
registerSketch('sk5', function (p) {
  // ---- Data (medians) ----
  const rows = [
    { level: 'EN', salary:  63799 },
    { level: 'MI', salary:  88565 },
    { level: 'SE', salary: 123311 },
    { level: 'EX', salary: 188028 }
  ];

  // Precomputed helpers
  const pctFromEN = rows.map(r => (r.salary / rows[0].salary - 1) * 100);
  const pctFromPrev = rows.map((r,i) => i === 0 ? 0 : (r.salary/rows[i-1].salary - 1)*100);

  // ---- Layout ----
  const W = 1080, H = 1350;              // IG-friendly
  const M = {top: 190, right: 140, bottom: 180, left: 160};
  const plot = { x0: M.left, x1: W - M.right, y0: H - M.bottom, y1: M.top };
  const maxSalary = 200000;
  const yTicks = [0, 50000, 100000, 150000, 200000];

  // ---- Interaction state ----
  let mode = 'salary';                    // 'salary' | 'delta'
  let hovered = -1;
  let highlightJump = true;               // show MI→SE annotation
  let animT = 0;                          // 0→1 entrance animation

  // ---- Utilities ----
  const xAt = i => p.map(i, 0, rows.length-1, plot.x0, plot.x1);
  const ySalary = v => p.map(v, 0, maxSalary, plot.y0, plot.y1);
  const yDelta  = v => p.map(v, 0, 100,       plot.y0, plot.y1);  // up to +100% for readability
  const ease = t => 1 - Math.pow(1 - t, 3);

  p.setup = function () {
    p.createCanvas(W, H);
    p.textFont('Helvetica');
    p.frameRate(60);
  };

  p.draw = function () {
    p.background(250);

    // Title + subtitle
    p.textAlign(p.CENTER, p.CENTER);
    p.fill(20);
    p.textSize(44);
    p.text("The Salary Jump That Changes AI Careers", W/2, 80);
    p.textSize(24);
    p.fill(70);
    p.text(mode === 'salary'
      ? "Median salary by experience level (USD)"
      : "Change vs previous level (%) — toggle shows the jump directly", W/2, 120);

    // Controls (toggle)
    drawToggle(W/2 - 140, 145);

    // Grid & axes
    p.stroke(225); p.strokeWeight(2);
    if (mode === 'salary') {
      for (const t of yTicks) {
        const y = ySalary(t);
        p.line(plot.x0, y, plot.x1, y);
        p.noStroke(); p.fill(90); p.textSize(18); p.textAlign(p.RIGHT, p.CENTER);
        p.text(`$${p.nf(t,0,0)}`, plot.x0 - 12, y);
        p.stroke(225);
      }
    } else {
      const ticks = [0, 20, 40, 60, 80, 100];
      for (const t of ticks) {
        const y = yDelta(t);
        p.line(plot.x0, y, plot.x1, y);
        p.noStroke(); p.fill(90); p.textSize(18); p.textAlign(p.RIGHT, p.CENTER);
        p.text(`${t}%`, plot.x0 - 12, y);
        p.stroke(225);
      }
    }

    // X labels
    p.noStroke(); p.fill(60); p.textSize(22);
    rows.forEach((r,i)=>{
      p.text(r.level, xAt(i), plot.y0 + 34);
    });

    // Determine y for each point in current mode
    const Ys = rows.map((r,i)=> mode==='salary' ? ySalary(r.salary) : yDelta(Math.max(0, pctFromPrev[i])));

    // Entrance animation (scale from 0.7→1 and fade)
    animT = p.min(1, animT + 0.04);
    const a = ease(animT);

    // Draw connectors to emphasize monotonic rise
    p.stroke(180); p.strokeWeight(2.5);
    p.noFill();
    for (let i=0;i<rows.length-1;i++){
      const x1 = xAt(i),   y1 = p.lerp(plot.y0, Ys[i],   a);
      const x2 = xAt(i+1), y2 = p.lerp(plot.y0, Ys[i+1], a);
      p.line(x1, y1, x2, y2);
    }

    // Draw bubbles with gradient EN→EX
    hovered = -1;
    for (let i=0;i<rows.length;i++){
      const x = xAt(i);
      const y = p.lerp(plot.y0, Ys[i], a);
      const c = p.lerpColor(p.color(255,140,0), p.color(30,100,220), i/3);
      const r0 = 34 + i*10;
      const r  = (mode==='salary' ? r0 : 42);               // equal size in delta mode
      const isHover = p.dist(p.mouseX, p.mouseY, x, y) <= r*0.8;
      if (isHover) hovered = i;

      p.noStroke();
      p.fill(c);
      p.circle(x, y, r*2);

      // Salary labels (subtle, below bubble)
      p.fill(20); p.textSize(20); p.textAlign(p.CENTER, p.TOP);
      const label = mode==='salary'
        ? `$${p.nf(rows[i].salary,0,0)}`
        : (i===0 ? "—" : `+${p.nf(pctFromPrev[i],1,1)}%`);
      p.text(label, x, y + r + 10);
    }

    // Default narrative annotation: the MI→SE jump
    if (highlightJump) {
      const i1 = 1, i2 = 2;
      const x1 = xAt(i1), y1 = p.lerp(plot.y0, Ys[i1], a);
      const x2 = xAt(i2), y2 = p.lerp(plot.y0, Ys[i2], a);
      p.stroke(60); p.strokeWeight(2);
      p.line(x1 + 24, y1 - 18, x2 - 24, y2 + 18);
      p.noStroke(); p.fill(30); p.textSize(22); p.textAlign(p.LEFT, p.BOTTOM);
      const pct = pctFromPrev[i2].toFixed(1);
      p.text(`Sharp jump MI→SE (+${pct}%)`, x1 + 28, y1 - 24);
    }

    // Tooltip
    if (hovered >= 0) {
      drawTooltip(hovered, xAt(hovered), Ys[hovered]);
    }

    // Caption
    p.textAlign(p.CENTER, p.CENTER);
    p.fill(110); p.textSize(18);
    p.text("Data: AI Job Market 2025 (synthetic medians, USD normalized). Toggle shows salary or % change.", W/2, H - 60);
  };

  // ---- UI helpers ----
  function drawTooltip(i, x, y) {
    const r = rows[i];
    const pad = 10;
    const txt1 = `${r.level}`;
    const txt2 = `Salary: $${p.nf(r.salary,0,0)}`;
    const txt3 = i===0 ? `+0% from EN` : `+${p.nf(pctFromPrev[i],1,1)}% vs previous`;

    p.textSize(18); p.textAlign(p.LEFT, p.TOP);
    const w = p.max(p.textWidth(txt2), p.textWidth(txt3), p.textWidth(txt1)) + pad*2;
    const h = 66 + pad*2;
    const bx = p.constrain(x + 18, 20, p.width - w - 20);
    const by = p.constrain(y - h - 18, 20, p.height - h - 20);

    p.noStroke(); p.fill(255, 240);
    p.rect(bx, by, w, h, 8);
    p.fill(20);
    p.text(txt1, bx + pad, by + pad);
    p.text(txt2, bx + pad, by + pad + 22);
    p.text(txt3, bx + pad, by + pad + 44);
  }

  function drawToggle(cx, cy) {
    // label
    p.noStroke(); p.fill(60); p.textSize(18); p.textAlign(p.CENTER, p.CENTER);
    p.text("View:", cx - 70, cy);

    // switch
    const w = 200, h = 34, r = 17;
    const x0 = cx, y0 = cy - h/2;
    p.stroke(180); p.fill(245);
    p.rect(x0, y0, w, h, r);
    // knob
    const leftKnob  = x0 + r;
    const rightKnob = x0 + w - r;
    const knobX = (mode==='salary') ? leftKnob : rightKnob;
    p.noStroke(); p.fill(30,100,220);
    p.circle(knobX, cy, 28);

    // labels
    p.noStroke(); p.fill(mode==='salary'?20:120); p.textAlign(p.LEFT, p.CENTER);
    p.text("Salary", x0 + 12, cy);
    p.fill(mode==='delta'?20:120); p.textAlign(p.RIGHT, p.CENTER);
    p.text("% Change", x0 + w - 12, cy);

    // interaction area stored for mousePressed
    toggleBounds = {x:x0, y:y0, w:w, h:h};
  }
  let toggleBounds = {x:0,y:0,w:0,h:0};

  p.mousePressed = function(){
    // toggle switch
    if (p.mouseX>=toggleBounds.x && p.mouseX<=toggleBounds.x+toggleBounds.w &&
        p.mouseY>=toggleBounds.y && p.mouseY<=toggleBounds.y+toggleBounds.h) {
      mode = (mode==='salary') ? 'delta' : 'salary';
      return;
    }
    // click anywhere to toggle the annotation on/off
    highlightJump = !highlightJump;
  };

  p.keyPressed = function(){
    if (p.key === 's' || p.key === 'S') { p.saveCanvas('ai_salary_jump', 'png'); }
    if (p.key === '1') { mode = 'salary'; }
    if (p.key === '2') { mode = 'delta'; }
  };
});