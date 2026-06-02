class StreamRenderer {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.nodes = [];
    this.particles = [];
    this.isFlowing = true;
    this.scale = window.devicePixelRatio || 1;
    this.animationFrameId = null;

    this.initNodes();
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());
  }

  initNodes() {
    // Center Enterprise Node
    this.centerNode = {
      id: 'center',
      name: 'Aether Enterprise Broker',
      x: 0,
      y: 0,
      r: 32,
      color: '#ff8c00', // Amber
      glow: 'rgba(255, 140, 0, 0.4)',
      pulse: 0
    };

    // Satellite provider nodes
    this.satellites = [
      {
        id: 'tokyo',
        name: 'Tokyo H100 Cluster',
        location: 'Tokyo, JP',
        x: 0,
        y: 0,
        angle: 0,
        distance: 140,
        r: 18,
        color: '#10b981', // Emerald
        status: 'CONNECTED',
        price: '0.0035',
        latency: 42,
        pulse: 0
      },
      {
        id: 'texas',
        name: 'Texas L4 Spot',
        location: 'Texas, US',
        x: 0,
        y: 0,
        angle: 1.5,
        distance: 140,
        r: 18,
        color: '#8e92a8', // Muted Gray
        status: 'IDLE',
        price: '0.0018',
        latency: 72,
        pulse: 0
      },
      {
        id: 'munich',
        name: 'Munich API Gateway',
        location: 'Munich, DE',
        x: 0,
        y: 0,
        angle: 3.14,
        distance: 140,
        r: 18,
        color: '#8e92a8',
        status: 'IDLE',
        price: '0.0025',
        latency: 55,
        pulse: 0
      },
      {
        id: 'frankfurt',
        name: 'Frankfurt Storage Node',
        location: 'Frankfurt, DE',
        x: 0,
        y: 0,
        angle: 4.7,
        distance: 140,
        r: 18,
        color: '#8e92a8',
        status: 'IDLE',
        price: '0.0010',
        latency: 60,
        pulse: 0
      }
    ];

    this.nodes = [this.centerNode, ...this.satellites];
  }

  resizeCanvas() {
    const rect = this.canvas.getBoundingClientRect();
    this.canvas.width = rect.width * this.scale;
    this.canvas.height = rect.height * this.scale;
    this.ctx.scale(this.scale, this.scale);

    // Reposition nodes based on actual width/height
    const cx = rect.width / 2;
    const cy = rect.height / 2;

    this.centerNode.x = cx;
    this.centerNode.y = cy;

    this.updateSatellitePositions(cx, cy);
  }

  updateSatellitePositions(cx, cy) {
    this.satellites.forEach(node => {
      node.x = cx + Math.cos(node.angle) * node.distance;
      node.y = cy + Math.sin(node.angle) * node.distance;
    });
  }

  spawnParticle(targetId) {
    if (!this.isFlowing) return;
    const target = this.satellites.find(s => s.id === targetId);
    if (!target || target.status === 'IDLE' || target.status === 'BREACHED') return;

    this.particles.push({
      x: this.centerNode.x,
      y: this.centerNode.y,
      targetX: target.x,
      targetY: target.y,
      progress: 0,
      speed: 0.02 + Math.random() * 0.015,
      size: 3 + Math.random() * 2,
      color: '#ff8c00'
    });
  }

  update() {
    const cx = this.canvas.width / (2 * this.scale);
    const cy = this.canvas.height / (2 * this.scale);

    // Slowly rotate/float satellite nodes in orbit
    this.satellites.forEach((node, idx) => {
      node.angle += 0.0015; // slow drift
      node.pulse += 0.03;
      
      // Update coordinates
      node.x = cx + Math.cos(node.angle) * node.distance;
      node.y = cy + Math.sin(node.angle) * node.distance;

      // Pulse color adjustment based on status
      if (node.status === 'CONNECTED') {
        node.color = '#10b981';
      } else if (node.status === 'BREACHED') {
        node.color = '#ef4444';
      } else {
        node.color = '#8e92a8';
      }
    });

    this.centerNode.pulse += 0.02;

    // Update particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.progress += p.speed;
      
      // Interpolate position along path
      const currentTarget = this.satellites.find(s => s.status === 'CONNECTED');
      if (currentTarget) {
        p.targetX = currentTarget.x;
        p.targetY = currentTarget.y;
      }

      p.x = this.centerNode.x + (p.targetX - this.centerNode.x) * p.progress;
      p.y = this.centerNode.y + (p.targetY - this.centerNode.y) * p.progress;

      if (p.progress >= 1) {
        this.particles.splice(i, 1);
      }
    }

    // Periodically spawn particles based on rate
    if (this.isFlowing && Math.random() < 0.25) {
      const activeNode = this.satellites.find(s => s.status === 'CONNECTED');
      if (activeNode) {
        this.spawnParticle(activeNode.id);
      }
    }
  }

  draw() {
    const rect = this.canvas.getBoundingClientRect();
    this.ctx.clearRect(0, 0, rect.width, rect.height);

    // Draw connecting paths (wires)
    this.satellites.forEach(node => {
      this.ctx.beginPath();
      this.ctx.moveTo(this.centerNode.x, this.centerNode.y);
      
      // Draw bezier curves for a sleek look
      const mx = (this.centerNode.x + node.x) / 2;
      const my = (this.centerNode.y + node.y) / 2 - 20; // curve control
      this.ctx.quadraticCurveTo(mx, my, node.x, node.y);

      if (node.status === 'CONNECTED') {
        this.ctx.strokeStyle = 'rgba(16, 185, 129, 0.25)';
        this.ctx.lineWidth = 2;
      } else if (node.status === 'BREACHED') {
        this.ctx.strokeStyle = 'rgba(239, 68, 68, 0.2)';
        this.ctx.lineWidth = 1.5;
      } else {
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
        this.ctx.lineWidth = 1;
      }
      this.ctx.stroke();
    });

    // Draw active particles
    this.particles.forEach(p => {
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fillStyle = p.color;
      this.ctx.shadowBlur = 10;
      this.ctx.shadowColor = p.color;
      this.ctx.fill();
      this.ctx.shadowBlur = 0; // reset
    });

    // Draw central node
    this.ctx.beginPath();
    const centerGlowRad = this.centerNode.r + Math.sin(this.centerNode.pulse) * 4;
    const centerGrad = this.ctx.createRadialGradient(
      this.centerNode.x, this.centerNode.y, 5,
      this.centerNode.x, this.centerNode.y, centerGlowRad
    );
    centerGrad.addColorStop(0, '#ff9f43');
    centerGrad.addColorStop(0.5, '#ff8c00');
    centerGrad.addColorStop(1, 'rgba(255, 140, 0, 0)');
    
    this.ctx.fillStyle = centerGrad;
    this.ctx.arc(this.centerNode.x, this.centerNode.y, centerGlowRad, 0, Math.PI * 2);
    this.ctx.fill();

    this.ctx.beginPath();
    this.ctx.arc(this.centerNode.x, this.centerNode.y, this.centerNode.r - 8, 0, Math.PI * 2);
    this.ctx.fillStyle = '#13141c';
    this.ctx.strokeStyle = '#ff8c00';
    this.ctx.lineWidth = 2;
    this.ctx.fill();
    this.ctx.stroke();

    // Center Node Text Label
    this.ctx.font = `600 10px 'Outfit'`;
    this.ctx.fillStyle = '#f0f2f5';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('AETHER', this.centerNode.x, this.centerNode.y - 1);
    this.ctx.font = `500 8px 'JetBrains Mono'`;
    this.ctx.fillStyle = '#8e92a8';
    this.ctx.fillText('BROKER', this.centerNode.x, this.centerNode.y + 9);

    // Draw satellite nodes
    this.satellites.forEach(node => {
      // Glow boundary
      this.ctx.beginPath();
      const nodePulseRad = node.r + Math.sin(node.pulse) * 2;
      const glowGrad = this.ctx.createRadialGradient(
        node.x, node.y, 2,
        node.x, node.y, nodePulseRad + 8
      );
      
      let baseColor = node.color;
      let glowColor = 'rgba(142, 146, 168, 0.1)';
      if (node.status === 'CONNECTED') {
        glowColor = 'rgba(16, 185, 129, 0.2)';
      } else if (node.status === 'BREACHED') {
        glowColor = 'rgba(239, 68, 68, 0.25)';
      }
      
      glowGrad.addColorStop(0, baseColor);
      glowGrad.addColorStop(0.6, glowColor);
      glowGrad.addColorStop(1, 'rgba(0,0,0,0)');

      this.ctx.fillStyle = glowGrad;
      this.ctx.arc(node.x, node.y, nodePulseRad + 8, 0, Math.PI * 2);
      this.ctx.fill();

      // Solid inner core
      this.ctx.beginPath();
      this.ctx.arc(node.x, node.y, node.r - 4, 0, Math.PI * 2);
      this.ctx.fillStyle = '#13141c';
      this.ctx.strokeStyle = baseColor;
      this.ctx.lineWidth = 2;
      this.ctx.fill();
      this.ctx.stroke();

      // Node Labels
      this.ctx.font = `500 10px 'Outfit'`;
      this.ctx.fillStyle = '#f0f2f5';
      this.ctx.textAlign = 'center';
      this.ctx.fillText(node.name, node.x, node.y - node.r - 8);

      this.ctx.font = `400 8px 'JetBrains Mono'`;
      this.ctx.fillStyle = node.status === 'CONNECTED' ? '#10b981' : node.status === 'BREACHED' ? '#ef4444' : '#8e92a8';
      this.ctx.fillText(`${node.status} (${node.latency}ms)`, node.x, node.y + node.r + 10);
    });
  }

  loop() {
    this.update();
    this.draw();
    this.animationFrameId = requestAnimationFrame(() => this.loop());
  }

  stop() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }
}
