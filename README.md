# WOMANSPLAIN

**Anonymous relationship advice from verified women on Farcaster**

A Farcaster mini app where anyone can submit relationship questions and get honest, unfiltered advice from verified women. Built with Self Protocol for zero-knowledge gender verification, deployed on Celo Sepolia testnet, and designed with a bold brutalist aesthetic.

![Status](https://img.shields.io/badge/status-deployed-green)
![Solidity](https://img.shields.io/badge/solidity-0.8.28-blue)
![Next.js](https://img.shields.io/badge/next.js-14-black)
![Celo](https://img.shields.io/badge/celo-sepolia-brightgreen)

---

## 🎯 Overview

WOMANSPLAIN creates a **verified women-only advisory space** on-chain where:
- Anyone can submit relationship questions anonymously
- Only verified women can provide advice
- All verification is privacy-preserving (zero-knowledge proofs)
- Advisors earn points and badges for contributions
- Red flag voting provides community consensus

**Key Innovation:** Uses Self Protocol's zkSNARK-based identity verification to cryptographically prove gender without revealing personal information.

---

## ✨ Features

### For Everyone
- 📝 **Submit Questions** - Ask relationship questions anonymously with optional screenshots
- 🚩 **Red Flag Detection** - Vote on situations from green (healthy) to red flag (dangerous)
- 📊 **Community Consensus** - See weighted red flag ratings from verified women

### For Verified Women Only
- ✅ **Verification via Self Protocol** - Prove gender with government ID via zkSNARK
- 💬 **Answer Questions** - Provide advice (anonymously or publicly)
- 🎖️ **Earn Badges & Points** - Build reputation through helpful contributions
- 📈 **Track Progress** - View verification status, points, and achievements

### Badges System
| Badge | Requirement | Points |
|-------|-------------|---------|
| 🔐 VERIFIED | Complete Self Protocol verification | 50 pts |
| 👩‍🏫 ADVISOR | Answer 10 questions | 100 pts |
| 💎 EXPERT | Answer 30 questions | 300 pts |
| 🏆 LEGEND | Answer 105 questions | 1050 pts |

---

## 🏗️ Architecture

### Smart Contracts (Celo Sepolia)

**ProofOfWomanhood.sol** - `0x7D03a457A5919Df05a37bDC424126A1C4D37E97D`
- Extends Self Protocol's `SelfVerificationRoot`
- Verifies gender using zero-knowledge proofs
- Manages user verification status, points, and badges
- Stores gender on-chain for frontend redirection
- Custom verification hook processes Self Protocol proofs

**WomansplainQuestions.sol** - `TBD`
- On-chain storage for questions and answers
- Red flag voting with weighted scoring
- Access control via ProofOfWomanhood contract
- Anonymous answer support

### Frontend Stack

- **Next.js 14** - React framework with App Router
- **Wagmi 2.14** - React hooks for Ethereum
- **Viem 2.27** - TypeScript Ethereum library
- **Farcaster Frame SDK** - Seamless wallet integration
- **TailwindCSS** - Brutalist design system
- **TypeScript** - Full type safety

### Partner Technologies

**Self Protocol** - Privacy-preserving identity verification
- zkSNARK proofs for gender verification
- No personal data stored on-chain
- Government ID backed verification
- Nullifier system prevents replay attacks

**Celo Blockchain** - Mobile-first EVM Layer-1
- Fast (~5s block times) and affordable transactions
- EVM compatible (all Solidity tools work)
- Sepolia testnet for development

**Farcaster** - Decentralized social protocol
- MiniApp SDK for embedded experiences
- Auto-connecting wallet (no MetaMask popup)
- Built-in user base for discovery

---

## 🎨 Design Philosophy

**Brutalist Aesthetic:**
- High-contrast color palette (Yellow `#FCFF52`, Forest Green `#4E632A`, Dark Purple `#1A0329`)
- Bold geometric shapes with sharp edges
- Large typography (Playfair Display + Inter)
- Industrial, poster-like interface
- Mobile-first responsive design

---

## 📁 Project Structure

```
womansplain/
├── apps/
│   ├── contracts/              # Hardhat smart contracts
│   │   ├── contracts/
│   │   │   ├── ProofOfWomanhood.sol       (deployed ✅)
│   │   │   ├── WomansplainQuestions.sol
│   │   │   └── Lock.sol
│   │   ├── ignition/modules/   # Deployment scripts
│   │   ├── test/               # Contract tests
│   │   └── hardhat.config.ts
│   │
│   └── web/                    # Next.js frontend
│       └── src/
│           ├── app/
│           │   ├── page.tsx                # Main app
│           │   └── api/                    # API routes
│           ├── components/
│           │   ├── tabs/                   # Submit, RedFlags, Profile
│           │   ├── logo.tsx                # Geometric logo
│           │   ├── image-upload.tsx        # Drag & drop
│           │   └── verification-gate.tsx
│           ├── hooks/
│           │   ├── use-contract-interaction.ts
│           │   └── use-simple-onchain.ts
│           ├── contexts/
│           │   ├── miniapp-context.tsx     # Farcaster SDK
│           │   └── frame-wallet-context.tsx # Wagmi config
│           └── lib/
│               ├── contracts.ts            # ABIs & addresses
│               └── utils.ts
│
├── PROJECT_DESCRIPTION.md      # Full project details
├── HOW_ITS_MADE.md            # Technical deep-dive
├── SUBMISSION_SHORT.md        # Concise submission text
└── README.md                  # This file
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and pnpm
- Farcaster account (for testing)
- Celo Sepolia testnet wallet with test tokens
- Self Protocol mobile app (for verification)

### Installation

```bash
# Clone and install
git clone <your-repo>
cd womansplain
pnpm install

# Compile contracts
cd apps/contracts
pnpm compile

# Run tests
pnpm test

# Start frontend
cd apps/web
pnpm dev

# Visit http://localhost:3000
```

### Environment Variables

**For contracts** (`apps/contracts/.env`):
```bash
PRIVATE_KEY=your_private_key
SELF_HUB_V2_ADDRESS=0x16ECBA51e18a4a7e61fdC417f0d47AFEeDfbed74
SELF_SCOPE_SEED=womansplain
CELOSCAN_API_KEY=your_api_key
```

**For frontend** (`apps/web/.env.local`):
```bash
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_project_id
NEXT_PUBLIC_ALCHEMY_API_KEY=your_alchemy_key
```

### Get Testnet Tokens

Visit [Celo Faucet](https://faucet.celo.org/) and request Sepolia testnet CELO.

---

## 🔧 Development

### Deploy Contracts

```bash
cd apps/contracts

# Deploy ProofOfWomanhood
npx hardhat ignition deploy ignition/modules/ProofOfWomanhood.ts --network sepolia

# Deployed at: 0x7D03a457A5919Df05a37bDC424126A1C4D37E97D

# Update frontend with deployed address
# Edit: apps/web/src/lib/contracts.ts
```

### Run Frontend

```bash
cd apps/web
pnpm dev

# Auto-connect wallet via Farcaster
# No manual wallet selection required!
```

### Build for Production

```bash
cd apps/web
pnpm build

# Deploy to Vercel
vercel deploy
```

---

## 🔐 How Gender Verification Works

### Flow Diagram

```
User Opens App
     ↓
Auto-connects wallet (Farcaster)
     ↓
Reads gender status from contract
     ↓
   ┌─────────────┴──────────────┐
   │                            │
   ↓                            ↓
Not Verified              Verified (M/F)
   │                            │
   ↓                            ↓
Self Protocol              Redirect based on gender:
Verification               • Men: Submit tab
   │                       • Women: Red Flags tab
   ↓
Scan QR → Prove gender with ID
   ↓
zkSNARK proof generated
   ↓
Submit to Self Hub V2
   ↓
Hub calls ProofOfWomanhood contract
   ↓
Contract stores gender + awards points/badges
   ↓
Frontend updates, user can now advise
```

### Zero-Knowledge Proof

Users prove gender **without revealing**:
- ❌ Name
- ❌ Date of birth
- ❌ ID number
- ❌ Address
- ❌ Photo

Only disclosed: **Gender (M/F)**

Powered by zkSNARKs via Self Protocol.

---

## 💻 Key Components

### Auto-Connecting Wallet

The app automatically connects wallets via Farcaster's embedded wallet:

```typescript
// Automatic connection on load
useEffect(() => {
  const connector = connectors.find(c => 
    c.id.includes('farcaster') || c.id.includes('miniapp')
  ) || connectors[0];
  
  await connect({ connector });
}, [isMiniAppReady, connectors]);
```

**Benefits:**
- No popup dialogs
- No MetaMask required
- Works seamlessly in Farcaster app
- Connects in ~2 seconds

### Gender-Based Routing

```typescript
const { gender } = useProofOfWomanhoodRead(address);

useEffect(() => {
  if (isConnected && gender) {
    if (gender === "F") {
      setActiveTab("redflags"); // Women can advise
    } else {
      setActiveTab("submit");   // Men can only submit
    }
  }
}, [isConnected, gender]);
```

### Contract Interactions

```typescript
// Read verification status
const { isVerified, gender, validationPoints } = 
  useProofOfWomanhoodRead(address);

// Submit question
const { submitQuestion } = useWomansplainQuestions();
await submitQuestion("My question", "screenshot_base64");

// Vote on red flags
const { voteRedFlag } = useWomansplainQuestions();
await voteRedFlag(questionId, 8); // 0-10 scale
```

---

## 📱 Mobile-First Design

Every component is optimized for mobile:

```tsx
<div className="
  px-4 py-4           // Mobile padding
  md:px-8 md:py-6     // Desktop padding
  text-5xl            // Mobile text
  md:text-7xl         // Desktop text
  flex-col            // Mobile stack
  md:flex-row         // Desktop horizontal
">
  {/* Content */}
</div>
```

**Features:**
- Swipeable tabs on mobile
- Touch-friendly tap targets
- Responsive typography
- Optimized images
- Fast loading (<3s on 3G)

---

## 🎯 Smart Contract Details

### ProofOfWomanhood.sol

**Key Functions:**

```solidity
// Custom verification hook (called by Self Hub)
function customVerificationHook(
    GenericDiscloseOutputV2 memory output,
    bytes memory userData
) internal override

// Public getters
function getUserGender(address user) external view returns (string memory)
function isVerifiedWoman(address user) external view returns (bool)
function getValidationPoints(address user) external view returns (uint256)
function getUserBadges(address user) external view returns (uint256)
```

**Events:**
```solidity
event GenderDisclosed(address indexed user, string gender, uint256 timestamp, bytes32 nullifier)
event WomanVerified(address indexed user, uint256 timestamp, bytes32 nullifier)
event PointsAwarded(address indexed user, uint256 points, uint256 totalPoints)
event BadgeEarned(address indexed user, uint256 badgeType)
```

### WomansplainQuestions.sol

**Key Functions:**

```solidity
function submitQuestion(string memory questionText, string memory screenshotData) external returns (uint256)
function answerQuestion(uint256 questionId, string memory answerText, bool anonymous) external
function voteRedFlag(uint256 questionId, uint256 severity) external
function getQuestion(uint256 questionId) external view returns (Question memory)
```

**Access Control:**
- Anyone can submit questions
- Only verified women can answer
- Only verified women can vote on red flags

---

## 🔗 Deployed Contracts (Celo Sepolia)

| Contract | Address | Status |
|----------|---------|--------|
| ProofOfWomanhood | [`0x7D03a457A5919Df05a37bDC424126A1C4D37E97D`](https://celo-sepolia.blockscout.com/address/0x7D03a457A5919Df05a37bDC424126A1C4D37E97D) | ✅ Deployed |
| WomansplainQuestions | TBD | 🚧 Pending |
| Self Hub V2 | [`0x16ECBA51e18a4a7e61fdC417f0d47AFEeDfbed74`](https://celo-sepolia.blockscout.com/address/0x16ECBA51e18a4a7e61fdC417f0d47AFEeDfbed74) | ✅ Live |

---

## 📊 Project Status

### ✅ Complete
- [x] ProofOfWomanhood contract (deployed)
- [x] Self Protocol integration
- [x] Gender verification flow
- [x] Auto-connecting wallet
- [x] Mobile-responsive UI
- [x] Geometric logo design
- [x] Tab navigation (Submit, Red Flags, Profile)
- [x] Image upload with drag & drop
- [x] Gender-based routing
- [x] Vercel deployment ready

### 🚧 In Progress
- [ ] WomansplainQuestions contract deployment
- [ ] IPFS integration for screenshots
- [ ] Full end-to-end testing

### 🔮 Future Enhancements
- [ ] Question categories/filtering
- [ ] Push notifications for answers
- [ ] Advisor leaderboard
- [ ] Token rewards for contributions
- [ ] Mainnet deployment

---

## 📚 Documentation

- **[PROJECT_DESCRIPTION.md](./PROJECT_DESCRIPTION.md)** - Comprehensive project overview
- **[HOW_ITS_MADE.md](./HOW_ITS_MADE.md)** - Technical architecture deep-dive
- **[SUBMISSION_SHORT.md](./SUBMISSION_SHORT.md)** - Concise project summary

---

## 🔗 Resources

### Official Documentation
- [Self Protocol Docs](https://docs.self.xyz/)
- [Farcaster MiniApps](https://miniapps.farcaster.xyz/)
- [Celo Documentation](https://docs.celo.org/)
- [Wagmi Documentation](https://wagmi.sh/)

### Explorers
- [Celo Sepolia Blockscout](https://celo-sepolia.blockscout.com/)
- [Celo Faucet](https://faucet.celo.org/)

### Tools
- [Farcaster Developer Portal](https://farcaster.xyz/~/developers)
- [Hardhat](https://hardhat.org/)
- [Vercel](https://vercel.com/)

---

## 🛡️ Security & Privacy

### Smart Contract Security
- ✅ Uses audited Self Protocol contracts
- ✅ Access control on all sensitive functions
- ✅ No reentrancy vulnerabilities
- ✅ Event logging for transparency
- ⚠️ **Not audited** - For testnet/demo only

### Privacy Features
- ✅ Zero-knowledge gender verification
- ✅ No personal data on-chain
- ✅ Optional anonymous answers
- ✅ Nullifiers prevent identity reuse
- ✅ No tracking or analytics

**Before mainnet:** Professional security audit required.

---

## 🤝 Contributing

This is a hackathon/demo project. To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing`)
5. Open a Pull Request

Please maintain the brutalist design aesthetic and ensure mobile responsiveness.

---

## 📄 License

MIT License - See LICENSE file for details

---

## 🙏 Acknowledgments

- **Celo** - For the mobile-first blockchain and testnet support
- **Self Protocol** - For privacy-preserving identity verification
- **Farcaster** - For the decentralized social protocol and MiniApp SDK
- **OpenZeppelin** - For secure smart contract libraries
- **Vercel** - For seamless deployment

Built with ❤️ using Next.js, Wagmi, Viem, TailwindCSS, and Solidity.

---

## 🎉 Try It Out

**Live Demo:** TBD (Deploy to Vercel)

**Test on Celo Sepolia:**
1. Get testnet CELO from [faucet](https://faucet.celo.org/)
2. Connect via Farcaster MiniApp
3. Complete Self Protocol verification
4. Start advising!

---

**Built for the Celo and Farcaster communities** 🌍

*Empowering women to share knowledge, earn recognition, and make a difference in a privacy-preserving way.*
