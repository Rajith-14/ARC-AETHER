document.addEventListener('DOMContentLoaded', () => {
  // Initialize App state
  const state = {
    currentView: 'dashboard',
    blockHeight: 109248,
    walletBalance: 250.000000,
    totalCompute: 1248.0,
    totalSettled: 452.84,
    flowLimit: 0.050,
    treasuryAlloc: 250,
    activeStreamNode: null,
    activeStreamRate: 0.0,
    nodes: [
      { id: 'tokyo', name: 'Tokyo H100 Cluster', location: 'Tokyo, JP', price: '0.0035', status: 'IDLE', uptime: '99.98%' },
      { id: 'texas', name: 'Texas L4 Spot', location: 'Texas, US', price: '0.0018', status: 'IDLE', uptime: '99.45%' },
      { id: 'munich', name: 'Munich API Gateway', location: 'Munich, DE', price: '0.0025', status: 'IDLE', uptime: '99.90%' },
      { id: 'frankfurt', name: 'Frankfurt Storage Node', location: 'Frankfurt, DE', price: '0.0010', status: 'IDLE', uptime: '98.80%' }
    ],
    txns: [
      { desc: 'Fund Broker Wallet', time: '10:14 AM', amount: '+250.00', type: 'in' },
      { desc: 'Tokyo Escrow Refund', time: 'Yesterday', amount: '+45.22', type: 'in' },
      { desc: 'Settled Frankfurt Block #10842', time: 'Yesterday', amount: '-12.40', type: 'out' }
    ],
    deployedContractAddress: null,
    contractEscrowBalance: 0.0
  };

  // Instantiate sub-modules
  const renderer = new StreamRenderer('network-canvas');
  renderer.loop();

  // Create references
  const appInterface = {
    appendTerminalLine: (logEntry) => {
      // Append to the active agent simulator console
      const consoleEl = document.getElementById('agent-thought-body');
      if (consoleEl) {
        const line = document.createElement('div');
        line.className = 'terminal-line';
        line.innerHTML = `
          <span class="line-timestamp">[${logEntry.timestamp}]</span>
          <span class="line-tag ${logEntry.tag}">${logEntry.tag}</span>
          <span class="line-content">${logEntry.message}</span>
        `;
        consoleEl.appendChild(line);
        consoleEl.scrollTop = consoleEl.scrollHeight;
      }

      // Also append to the topology side logs
      const topoConsoleEl = document.getElementById('node-logs-body');
      if (topoConsoleEl) {
        const line = document.createElement('div');
        line.className = 'terminal-line';
        line.innerHTML = `
          <span class="line-timestamp">[${logEntry.timestamp}]</span>
          <span class="line-tag ${logEntry.tag}">${logEntry.tag}</span>
          <span class="line-content">${logEntry.message}</span>
        `;
        topoConsoleEl.appendChild(line);
        topoConsoleEl.scrollTop = topoConsoleEl.scrollHeight;
      }
    },
    clearTerminal: () => {
      const consoleEl = document.getElementById('agent-thought-body');
      if (consoleEl) consoleEl.innerHTML = '';
      const topoConsoleEl = document.getElementById('node-logs-body');
      if (topoConsoleEl) topoConsoleEl.innerHTML = '';
    },
    triggerWalletSignaturePrompt: (txMessage, callback) => {
      showWalletPrompt(txMessage, callback);
    },
    startUSDCFlow: (nodeId, rate) => {
      state.activeStreamNode = nodeId;
      state.activeStreamRate = rate;

      // Update node statuses
      state.nodes.forEach(n => {
        if (n.id === nodeId) {
          n.status = 'CONNECTED';
          renderer.satellites.find(s => s.id === nodeId).status = 'CONNECTED';
        } else {
          n.status = 'IDLE';
          renderer.satellites.find(s => s.id === n.id).status = 'IDLE';
        }
      });
      renderNodesTable();
      updateDashboardUI();
    },
    stopUSDCFlow: () => {
      if (state.activeStreamNode) {
        const activeNode = state.nodes.find(n => n.id === state.activeStreamNode);
        if (activeNode) {
          activeNode.status = 'IDLE';
          renderer.satellites.find(s => s.id === state.activeStreamNode).status = 'IDLE';
        }
      }
      state.activeStreamNode = null;
      state.activeStreamRate = 0.0;
      renderNodesTable();
      updateDashboardUI();
    }
  };

  const agentCore = new AgentCore(appInterface);

  // --- View switcher ---
  const navItems = document.querySelectorAll('.nav-item');
  const viewPanels = document.querySelectorAll('.view-panel');
  const currentViewTitle = document.getElementById('current-view-title');

  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const targetView = item.getAttribute('data-view');
      state.currentView = targetView;

      navItems.forEach(nav => nav.classList.remove('active'));
      item.classList.add('active');

      viewPanels.forEach(panel => panel.classList.remove('active'));
      document.getElementById(`view-${targetView}`).classList.add('active');

      // Update headers
      if (targetView === 'dashboard') currentViewTitle.textContent = 'Command Center';
      if (targetView === 'topology') {
        currentViewTitle.textContent = 'P2P Compute Topology';
        renderer.resizeCanvas(); // redraw canvas properly
      }
      if (targetView === 'sandbox') currentViewTitle.textContent = 'Agent Action Simulator';
      if (targetView === 'playground') currentViewTitle.textContent = 'Developer Solidity IDE';
      if (targetView === 'feedback') currentViewTitle.textContent = 'Circle Integration Specs';
    });
  });

  // --- Render Functions ---
  function renderNodesTable() {
    const tbody = document.getElementById('nodes-table-body');
    if (!tbody) return;
    tbody.innerHTML = '';
    state.nodes.forEach(node => {
      let statusColor = '#8e92a8';
      if (node.status === 'CONNECTED') statusColor = '#10b981';
      if (node.status === 'BREACHED') statusColor = '#ef4444';

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td style="font-weight:600;">${node.name}</td>
        <td>${node.location}</td>
        <td style="font-family:var(--font-mono);">${node.price} USDC</td>
        <td style="color:${statusColor}; font-weight:600; font-family:var(--font-mono);">${node.status}</td>
        <td style="font-family:var(--font-mono); color:var(--text-secondary);">${node.uptime}</td>
      `;
      tbody.appendChild(tr);
    });
  }

  function renderTxnsTable() {
    const txnListEl = document.getElementById('wallet-txn-list');
    if (!txnListEl) return;
    txnListEl.innerHTML = '';
    state.txns.slice(0, 4).forEach(tx => {
      const div = document.createElement('div');
      div.className = 'wallet-txn-item';
      div.innerHTML = `
        <div>
          <div class="txn-desc">${tx.desc}</div>
          <div class="txn-time">${tx.time}</div>
        </div>
        <div class="txn-amount ${tx.type}">${tx.amount} USDC</div>
      `;
      txnListEl.appendChild(div);
    });
  }

  function updateDashboardUI() {
    const streamRateEl = document.getElementById('stat-stream-rate');
    const totalComputeEl = document.getElementById('stat-total-compute');
    const totalSettledEl = document.getElementById('stat-total-settled');
    const walletBalanceEl = document.getElementById('wallet-usdc-balance');

    if (streamRateEl) streamRateEl.textContent = `${state.activeStreamRate.toFixed(5)} USDC`;
    if (totalComputeEl) totalComputeEl.textContent = `${state.totalCompute.toFixed(1)} hrs`;
    if (totalSettledEl) totalSettledEl.textContent = `${state.totalSettled.toFixed(2)} USDC`;
    if (walletBalanceEl) walletBalanceEl.textContent = state.walletBalance.toFixed(6);
  }

  // --- Slider Listeners ---
  const sliderFlowLimit = document.getElementById('slider-flow-limit');
  const valFlowLimit = document.getElementById('val-flow-limit');
  if (sliderFlowLimit && valFlowLimit) {
    sliderFlowLimit.addEventListener('input', (e) => {
      state.flowLimit = parseFloat(e.target.value);
      valFlowLimit.textContent = `${state.flowLimit.toFixed(3)} USDC`;
    });
  }

  const sliderTreasuryAlloc = document.getElementById('slider-treasury-alloc');
  const valTreasuryAlloc = document.getElementById('val-treasury-alloc');
  if (sliderTreasuryAlloc && valTreasuryAlloc) {
    sliderTreasuryAlloc.addEventListener('input', (e) => {
      state.treasuryAlloc = parseInt(e.target.value);
      valTreasuryAlloc.textContent = `${state.treasuryAlloc.toFixed(2)} USDC`;
    });
  }

  // --- Real-Time Block ticking & Streaming logic ---
  let lastTime = performance.now();
  setInterval(() => {
    // Tick block height
    state.blockHeight += 1;
    const blockEl = document.getElementById('block-height');
    if (blockEl) blockEl.textContent = state.blockHeight.toLocaleString();

    // Randomize average RPC latency to make dashboard feel alive
    const latencyEl = document.getElementById('stat-avg-latency');
    if (latencyEl) {
      const activeNode = state.nodes.find(n => n.status === 'CONNECTED');
      if (activeNode) {
        const variableLatency = Math.floor(parseInt(activeNode.price * 10000) / 100) + Math.floor(Math.random() * 8) - 4;
        latencyEl.textContent = `${Math.max(10, variableLatency)}ms`;
        latencyEl.style.color = 'var(--accent-emerald)';
      } else {
        latencyEl.textContent = 'N/A';
        latencyEl.style.color = 'var(--text-muted)';
      }
    }
  }, 3000);

  // Micro-tick for USDC streaming deduction
  function animateUSDCStream() {
    const now = performance.now();
    const dt = (now - lastTime) / 1000; // seconds
    lastTime = now;

    if (state.activeStreamNode && state.activeStreamRate > 0) {
      const deduction = state.activeStreamRate * dt;
      if (state.walletBalance > deduction) {
        state.walletBalance -= deduction;
        state.totalSettled += deduction;
        state.totalCompute += dt / 3600; // compute hours increment
        
        // Update contract escrow mockup balance
        if (state.contractEscrowBalance > deduction) {
          state.contractEscrowBalance -= deduction;
          const escBalEl = document.getElementById('contract-escrow-balance');
          if (escBalEl) escBalEl.textContent = `${state.contractEscrowBalance.toFixed(2)} USDC`;
        }
        
        updateDashboardUI();
      } else {
        // Depleted
        agentCore.log('alert', 'Agent wallet balance depleted. Terminating current compute stream.');
        appInterface.stopUSDCFlow();
      }
    }
    requestAnimationFrame(animateUSDCStream);
  }
  requestAnimationFrame(animateUSDCStream);

  // --- Wallet signature popup handler ---
  function showWalletPrompt(message, callback) {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed;
      top: 0; left: 0; width: 100vw; height: 100vh;
      background: rgba(11, 12, 16, 0.85);
      backdrop-filter: blur(8px);
      display: flex; align-items: center; justify-content: center;
      z-index: 1000;
      opacity: 0; transition: opacity 0.25s ease;
    `;
    
    const card = document.createElement('div');
    card.style.cssText = `
      background: var(--bg-panel);
      border: 1px solid var(--accent-amber);
      border-radius: 16px;
      padding: 30px; width: 400px;
      box-shadow: 0 10px 30px rgba(255, 140, 0, 0.2);
      transform: translateY(20px); transition: transform 0.25s ease;
      text-align: center;
    `;

    card.innerHTML = `
      <div style="font-size: 1.1rem; font-weight:700; color: var(--accent-amber); margin-bottom: 15px;">Circle Web3 Signature Request</div>
      <div style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 25px; font-family: var(--font-mono);">${message}</div>
      <div style="display: flex; gap: 12px; justify-content: center;">
        <button class="btn-ctrl danger" id="wallet-reject" style="padding: 10px 20px;">Reject</button>
        <button class="btn-primary" id="wallet-approve" style="padding: 10px 20px;">Approve Tx</button>
      </div>
    `;

    overlay.appendChild(card);
    document.body.appendChild(overlay);

    // Trigger animations
    setTimeout(() => {
      overlay.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, 10);

    const approveBtn = card.querySelector('#wallet-approve');
    const rejectBtn = card.querySelector('#wallet-reject');

    approveBtn.addEventListener('click', () => {
      document.body.removeChild(overlay);
      callback();
    });

    rejectBtn.addEventListener('click', () => {
      document.body.removeChild(overlay);
      agentCore.log('alert', 'Transaction rejected by user/policy. Halting deployment.');
      agentCore.stop();
    });
  }

  // --- Interactive Control Listeners ---
  const btnStartSim = document.getElementById('btn-start-simulation');
  if (btnStartSim) {
    btnStartSim.addEventListener('click', () => {
      agentCore.stop();
      appInterface.stopUSDCFlow();
      
      // Reset variables
      state.walletBalance = 250.00;
      state.totalCompute = 1248.0;
      updateDashboardUI();
      
      agentCore.startSimulation();
    });
  }

  const btnTriggerSla = document.getElementById('btn-trigger-sla');
  if (btnTriggerSla) {
    btnTriggerSla.addEventListener('click', () => {
      const tokyoNode = state.nodes.find(n => n.id === 'tokyo');
      if (tokyoNode && tokyoNode.status === 'CONNECTED') {
        tokyoNode.status = 'BREACHED';
        renderer.satellites.find(s => s.id === 'tokyo').status = 'BREACHED';
        renderer.satellites.find(s => s.id === 'tokyo').latency = 1240;
        renderNodesTable();
        agentCore.triggerSlaBreach();
      } else {
        alert('Tokyo Node is not currently active. Click "Run Agent Workflow" in the SLA Sandbox view first.');
      }
    });
  }

  const btnSimFailoverSandbox = document.getElementById('btn-simulate-failover-sandbox');
  if (btnSimFailoverSandbox) {
    btnSimFailoverSandbox.addEventListener('click', () => {
      btnTriggerSla.click();
    });
  }

  const btnToggleFlow = document.getElementById('btn-toggle-flow');
  if (btnToggleFlow) {
    btnToggleFlow.addEventListener('click', () => {
      renderer.isFlowing = !renderer.isFlowing;
      btnToggleFlow.innerHTML = renderer.isFlowing ? `
        <svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
        Pause Streams
      ` : `
        <svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
        Resume Streams
      `;
    });
  }

  // --- Deployed Solidity Contract interactions ---
  const btnDeployContract = document.getElementById('btn-deploy-contract');
  const btnContractSettle = document.getElementById('btn-contract-settle');
  const btnContractTerminate = document.getElementById('btn-contract-terminate');
  const playgroundConsole = document.getElementById('playground-console');

  if (btnDeployContract) {
    btnDeployContract.addEventListener('click', () => {
      playgroundConsole.textContent = '[COMPILING] Compiling AgentComputeEscrow.sol...\n[COMPILER] Code size: 1422 bytes.\n[DEPLOYING] Deploying AgentComputeEscrow to Arc L1...';
      
      setTimeout(() => {
        state.deployedContractAddress = '0x5b383c86c8a7d25e01868351c4a17b321a7d25e0';
        state.contractEscrowBalance = 150.0;
        
        playgroundConsole.textContent = `[SUCCESS] Contract deployed on-chain at ${state.deployedContractAddress}\n[ESCROW] Locked 150.00 USDC inside contract.\n[BLOCK] Transaction included in Block #109252. Deterministic Finality.`;
        
        const escBalEl = document.getElementById('contract-escrow-balance');
        if (escBalEl) escBalEl.textContent = `${state.contractEscrowBalance.toFixed(2)} USDC`;

        btnContractSettle.disabled = false;
        btnContractTerminate.disabled = false;
      }, 1500);
    });
  }

  if (btnContractSettle) {
    btnContractSettle.addEventListener('click', () => {
      if (!state.deployedContractAddress) return;
      playgroundConsole.textContent = `[TRANSACTION] Call AgentComputeEscrow.settleBalance() initiated.\n[TX] Signatures validated. Balance distributed to Tokyo Provider.`;
    });
  }

  if (btnContractTerminate) {
    btnContractTerminate.addEventListener('click', () => {
      if (!state.deployedContractAddress) return;
      playgroundConsole.textContent = `[TERMINATED] Call AgentComputeEscrow.terminateAndRefund() executed.\n[TX] Escrow halted. Remaining ${state.contractEscrowBalance.toFixed(2)} USDC returned to owner.\n[STATUS] Contract self-destruct state activated.`;
      
      state.contractEscrowBalance = 0.0;
      const escBalEl = document.getElementById('contract-escrow-balance');
      if (escBalEl) escBalEl.textContent = `${state.contractEscrowBalance.toFixed(2)} USDC`;

      btnContractSettle.disabled = true;
      btnContractTerminate.disabled = true;
    });
  }

  // --- AED FX Gateway listener ---
  const btnTriggerFx = document.getElementById('btn-trigger-fx');
  if (btnTriggerFx) {
    btnTriggerFx.addEventListener('click', () => {
      // 1. Add balance
      state.walletBalance += 272.29;
      
      // 2. Add transaction
      state.txns.unshift({
        desc: 'StableFX AED Deposit',
        time: 'Just Now',
        amount: '+272.29',
        type: 'in'
      });
      
      // 3. Render terminal message
      agentCore.log('tx', 'Circle Gateway: 1,000.00 AED auto-conversion confirmed. Rate locked at 3.673 AED/USD. Settled 272.29 USDC to Agent Wallet.');
      
      // 4. Update UI
      renderTxnsTable();
      updateDashboardUI();
    });
  }

  // --- Initial Render Execution ---
  renderNodesTable();
  renderTxnsTable();
  updateDashboardUI();
});
