# ArcAether: 3-Minute Video Pitch Script & Slide Outline

Use this guide to record your hackathon submission video. Keep the video length **under 3 minutes** for maximum impact.

---

## 🎥 Video Structure Breakdown

| Segment | Timing | Visual Focus | Voiceover Core Message |
| :--- | :--- | :--- | :--- |
| **1. The Hook & Problem** | 0:00 - 0:30 | Title slide / Landing page | Explain why AI agents need programmable stablecoins to buy APIs and GPU. |
| **2. The Solution** | 0:30 - 1:00 | Dashboard & Topology | Show ArcAether's interface and the live compute nodes. |
| **3. Live Simulation (Normal)** | 1:00 - 1:45 | Sandbox & Web3 Wallet | Run the simulation, sign the transaction, and show the flowing USDC stream. |
| **4. Failover & Self-Healing** | 1:45 - 2:30 | Topology map during SLA breach | Trigger the breach and show the agent autonomously rerouting payments. |
| **5. Circle Value & Outro** | 2:30 - 3:00 | Submission Specs tab | Reiterate the value of USDC, Circle Wallets, and closing wrap-up. |

---

## 🛝 Slide Outline (Presentation Deck)

### Slide 1: Title
- **Text:** ArcAether: Autonomous Compute & API Brokerage on Arc L1
- **Subtitle:** Powering the Agentic Economy with Circle Web3 Wallets & USDC Nanopayments
- **Visual:** Premium minimal dark theme, project logo.

### Slide 2: The Infrastructure Bottleneck for AI
- **Bullet Points:**
  - AI agents require highly volatile compute, storage, and API resources.
  - Traditional monthly billing and credit cards are manual, static, and slow.
  - Machine-to-Machine commerce requires automated discovery, SLA contracting, and real-time micropayments.

### Slide 3: ArcAether's Architecture
- **Diagram:** (Show the system diagram from the `README.md` file)
- **Key Highlights:**
  - **Circle Developer-Controlled Wallets** manage agent treasury securely.
  - **Arc L1 Smart Contracts** escrow stablecoins and enforce SLA targets.
  - **StableFX Gateway** handles fiat (AED) deposits converted directly into USDC.

---

## 🎙️ Word-for-Word Voiceover Script

### **Segment 1: The Hook & The Problem (0:00 - 0:30)**
> *"Hello, everyone! In the emerging agentic economy, AI agents are no longer just text generators—they are autonomous businesses. But to perform tasks, they need to consume massive amounts of API endpoints and raw GPU compute. Today's payment rails, like corporate credit cards, are built for humans. They cannot support machine-to-machine transactions happening hundreds of times a minute. 
> 
> Introducing **ArcAether**—a decentralized, autonomous compute brokerage protocol built on Circle's developer stack and the Arc L1 blockchain."*

### **Segment 2: Introducing the Solution (0:30 - 1:00)**
> *(Action: Show the **Dashboard** view of the running application)*
> 
> *"This is the ArcAether Command Center. Here, an enterprise administrator can set budget guardrails and spending limits for their AI agents. In the center, we see our **Embedded Agent Wallet**, powered by Circle's developer-controlled Web3 Wallets.
> 
> To demonstrate a localized corridor, we've integrated **Circle Gateway's StableFX** simulation. With a single click, an enterprise can deposit AED dirhams which are automatically converted and settled into the agent's wallet as USDC on Arc."*
> 
> *(Action: Click the **Fund 272.29 USDC (Auto-Route AED)** button. Point out the instant conversion log)*

### **Segment 3: Running the Simulation & Web3 Wallets (1:00 - 1:45)**
> *(Action: Switch to the **SLA Sandbox** tab, and click **Run Agent Workflow**)*
> 
> *"Let’s see the agent in action. When our local server load spikes, the agent autonomously discovers providers on the Arc blockchain, contacts their agents, and negotiates a rate. 
> 
> To deploy the payment escrow, the agent requests a cryptographic signature. This triggers Circle’s Web3 Wallet prompt. Once approved..."*
> 
> *(Action: Click **Approve Tx** on the wallet prompt overlay)*
> 
> *"...the transaction is broadcast to the Arc L1 blockchain, instantiating a custom `AgentComputeEscrow` Solidity contract with zero settlement friction."*
> 
> *(Action: Switch to the **P2P Compute Map** tab)*
> 
> *"We now see real-time USDC nanopayments streaming directly to the Tokyo H100 Cluster node. The particles represent micro-payments settling per second of GPU usage."*

### **Segment 4: SLA Violation & Self-Healing (1:45 - 2:30)**
> *(Action: Click **Inject Tokyo SLA Breach** at the bottom of the map view)*
> 
> *"What happens if a provider fails? Traditionally, this causes outages and requires human intervention. 
> 
> In ArcAether, the agent continuously monitors network latency. When Tokyo's latency spikes above our SLA threshold, the agent detects the breach, stops the payment stream, triggers the contract's refund function, recovers the unused USDC, discovers a backup node in Texas, and instantly redirects the workload and payment stream. 
> 
> The entire self-healing loop completes on-chain in seconds without any human developer lifting a finger."*

### **Segment 5: Why Circle & Outro (2:30 - 3:00)**
> *(Action: Switch to the **Hackathon Specs** tab)*
> 
> *"We chose Circle's tools because the programmable nature of USDC, combined with the predictable fees of Arc L1, makes high-frequency machine commerce viable. By bridging AI agents with secure cryptographic wallets, we are unlocking the next tier of the agentic economy.
> 
> Thank you, and we look forward to your feedback!"*
