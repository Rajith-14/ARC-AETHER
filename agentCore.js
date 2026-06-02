class AgentCore {
  constructor(app) {
    this.app = app;
    this.state = 'IDLE';
    this.logs = [];
    this.timer = null;
    this.simulationSpeed = 2200; // ms per step
  }

  log(tag, message) {
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = { timestamp, tag, message };
    this.logs.push(logEntry);
    this.app.appendTerminalLine(logEntry);
  }

  startSimulation() {
    if (this.state !== 'IDLE') {
      this.log('alert', 'Simulation already running or in active state.');
      return;
    }
    
    this.logs = [];
    this.app.clearTerminal();
    this.state = 'IDENTIFY';
    this.runStep();
  }

  runStep() {
    switch (this.state) {
      case 'IDENTIFY':
        this.log('think', 'System analytics warning: Local GPU compute load reached 96%. Latency spike on queued tasks.');
        this.log('think', 'Core directive: Maintain queue latency < 100ms. Procuring external auxiliary GPU clusters...');
        this.state = 'DISCOVER';
        this.timer = setTimeout(() => this.runStep(), this.simulationSpeed);
        break;

      case 'DISCOVER':
        this.log('search', 'Querying Arc L1 ProviderRegistry (address: 0x8fB32...22d8) for active GPU node resources...');
        this.log('search', 'Found 3 providers matching requirements: Tokyo H100 (0.0035 USDC/s), Munich API (0.0025 USDC/s), Texas Spot (0.0018 USDC/s).');
        this.log('think', 'Tokyo H100 selected as primary candidate based on lowest latency (42ms) and historical uptime (99.98%).');
        this.state = 'NEGOTIATE';
        this.timer = setTimeout(() => this.runStep(), this.simulationSpeed);
        break;

      case 'NEGOTIATE':
        this.log('negotiate', 'Establishing secure channel to Tokyo GPU Provider Agent (0x39a1d...e018)...');
        this.log('negotiate', 'Requesting compute lease. Offered rate: 0.0035 USDC/sec. SLA terms: Latency < 60ms.');
        this.log('negotiate', 'Tokyo Agent response: "SLA proposal approved. Escrow required. Deployed contract hash verified."');
        this.state = 'SIGNING';
        this.timer = setTimeout(() => this.runStep(), this.simulationSpeed);
        break;

      case 'SIGNING':
        this.log('think', 'Circle Web3 Wallet request generated. Awaiting programmatic API signature approval...');
        this.app.triggerWalletSignaturePrompt('Deploy Escrow of 150.00 USDC to 0x39a1d...e018', () => {
          this.log('tx', 'Signature received from Circle User-Controlled Wallet. Tx Hash: 0x9b321...a7d2');
          this.state = 'DEPLOYING';
          this.runStep();
        });
        break;

      case 'DEPLOYING':
        this.log('tx', 'Broadcasting AgentComputeEscrow contract deployment to Arc Devnet...');
        this.log('tx', 'Contract successfully instantiated at 0x5b383...f4a1. Gas fee: 0.0001 USDC (Fixed).');
        this.log('tx', 'Deposited 150.00 USDC to contract. Automated settlement stream activated.');
        this.state = 'STREAMING';
        this.app.startUSDCFlow('tokyo', 0.0035);
        this.timer = setTimeout(() => this.runStep(), this.simulationSpeed);
        break;

      case 'STREAMING':
        this.log('think', 'Active compute flow operational. Monitoring GPU throughput and latency metrics...');
        this.log('negotiate', 'Recurrent micro-settlement heartbeat confirmed. Tokyo Node delivering 82 TFLOPS.');
        // Stay in streaming state unless triggered externally or target reached
        break;

      case 'BREACH_DETECTED':
        this.log('alert', 'CRITICAL ERROR: Tokyo GPU node latency spiked to 1240ms. Package drops detected.');
        this.log('alert', 'SLA SLA-001 violation registered: Latency exceeded 60ms threshold for 3 consecutive ticks.');
        this.log('think', 'Core directive priority: Self-healing protocol initiated. Stopping active payments to Tokyo.');
        this.state = 'FAILOVER_HALT';
        this.timer = setTimeout(() => this.runStep(), this.simulationSpeed);
        break;

      case 'FAILOVER_HALT':
        this.log('tx', 'Executing terminateAndRefund() on Tokyo Escrow (0x5b383...f4a1)...');
        this.app.stopUSDCFlow();
        this.log('tx', 'Escrow closed. Remaining 118.42 USDC refunded back to Agent Wallet.');
        this.state = 'FAILOVER_DISCOVER';
        this.timer = setTimeout(() => this.runStep(), this.simulationSpeed);
        break;

      case 'FAILOVER_DISCOVER':
        this.log('search', 'Scanning backup nodes in Registry... Selecting Texas Spot (0.0018 USDC/s, 72ms latency).');
        this.log('think', 'Texas Spot node verified. Budget rules permit lease. Initiating secondary negotiation...');
        this.state = 'FAILOVER_NEGOTIATE';
        this.timer = setTimeout(() => this.runStep(), this.simulationSpeed);
        break;

      case 'FAILOVER_NEGOTIATE':
        this.log('negotiate', 'Opening channel to Texas Spot Agent (0xcc192...8b1e)...');
        this.log('negotiate', 'Negotiated lease rate: 0.0018 USDC/sec. SLA target: Latency < 90ms.');
        this.log('negotiate', 'Texas Agent response: "Terms locked. Awaiting escrow initialization."');
        this.state = 'FAILOVER_DEPLOY';
        this.timer = setTimeout(() => this.runStep(), this.simulationSpeed);
        break;

      case 'FAILOVER_DEPLOY':
        this.log('tx', 'Deploying AgentComputeEscrow to Texas Spot (0x811fa...c3d1)...');
        this.log('tx', 'Tx confirmed. Contract deployed at 0x992fa...12e1. Depository deposit: 118.42 USDC.');
        this.state = 'FAILOVER_STREAMING';
        this.app.startUSDCFlow('texas', 0.0018);
        this.timer = setTimeout(() => this.runStep(), this.simulationSpeed);
        break;

      case 'FAILOVER_STREAMING':
        this.log('think', 'Failover completed successfully. Compute workload migrated. System queue stabilized.');
        this.log('negotiate', 'Active payment stream established with Texas Spot Node. Budget healthy.');
        break;
    }
  }

  triggerSlaBreach() {
    if (this.state !== 'STREAMING') {
      this.log('alert', 'Breach can only be triggered during active Tokyo streaming.');
      return;
    }
    clearTimeout(this.timer);
    this.state = 'BREACH_DETECTED';
    this.runStep();
  }

  stop() {
    clearTimeout(this.timer);
    this.state = 'IDLE';
  }
}
