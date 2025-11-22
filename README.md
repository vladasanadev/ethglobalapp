# 🌟 WOMANSPLAIN

**Anonymous relationship advice from verified women on Farcaster**

A Farcaster mini app where anyone can submit relationship questions and get honest, unfiltered advice from verified women. Built with Self Protocol verification, Celo blockchain, and bold Celo brand design.

![Status](https://img.shields.io/badge/status-ready%20for%20deployment-green)
![Solidity](https://img.shields.io/badge/solidity-0.8.28-blue)
![Next.js](https://img.shields.io/badge/next.js-14-black)

## ✨ Features

### For Everyone
- **Submit Questions**: Anonymously ask relationship questions with optional screenshots
- **View Red Flag Ratings**: See community consensus on red flag severity (0-100%)

### For Verified Women Only
- **Advisor Dashboard**: Access to all unanswered questions
- **Answer Questions**: Provide advice anonymously or publicly
- **Vote on Red Flags**: Rate situations from green flag (healthy) to red flag (dangerous)
- **Earn Badges & Points**: Build reputation through helpful contributions

### Badges System
- 🔥 **VERIFIED** - Complete Self Protocol verification (50 pts)
- 💬 **ADVISOR** - Answer 10 questions (100 pts total)
- ⭐ **EXPERT** - Answer 30 questions (300 pts total)
- 👑 **LEGEND** - Answer 105 questions (1050 pts total)

## 🎨 Design Philosophy

**Bold Celo Brand Aesthetic**:
- High-contrast color palette (Yellow #FCFF52, Forest Green #4E632A, Dark Purple #1A0329)
- Sharp edges, no rounded corners
- Big typography with Playfair Display headlines and Inter body text
- Color block sections with visible structure
- Industrial, poster-like interface

## 🏗 Architecture

### Smart Contracts (Solidity 0.8.28)

1. **ProofOfWomanhood.sol**
   - Extends Self Protocol's `SelfVerificationRoot`
   - Verifies gender identity using zero-knowledge proofs
   - Manages verification status, points, and badges
   - Deployed on Celo Sepolia testnet

2. **WomansplainQuestions.sol**
   - On-chain question and answer storage
   - Red flag voting mechanism
   - Access control via ProofOfWomanhood contract
   - Anonymous answer support

### Frontend (Next.js 14 + React)

- **Farcaster Mini App** with auto wallet connection
- **Wagmi** for blockchain interactions
- **Celo Sepolia** testnet integration
- **Bold UI** following Celo brand guidelines
- **Tab-based navigation**: Submit / Advisor / Profile

## 📂 Project Structure

```
womansplain/
├── apps/
│   ├── contracts/          # Hardhat smart contracts
│   │   ├── contracts/
│   │   │   ├── ProofOfWomanhood.sol
│   │   │   └── WomansplainQuestions.sol
│   │   └── ignition/modules/  # Deployment scripts
│   │
│   └── web/               # Next.js frontend
│       └── src/
│           ├── app/       # Main app pages
│           ├── components/
│           │   ├── tabs/  # Submit, Advisor, Profile
│           │   ├── answer-modal.tsx
│           │   ├── red-flag-voter.tsx
│           │   └── verification-gate.tsx
│           └── lib/
│               ├── contracts.ts      # ABIs & addresses
│               └── design-system.ts  # Celo brand styles
│
├── WOMANSPLAIN_SETUP.md          # Full setup guide
├── SELF_PROTOCOL_INTEGRATION.md  # Verification integration notes
└── FARCASTER_SETUP.md            # Farcaster mini app setup
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and pnpm
- Farcaster account
- Celo Sepolia testnet wallet
- Self Protocol Hub V2 address (see docs)

### Installation

   ```bash
# Clone and install
cd /Users/vladyslavaka/Desktop/eth/womansplain
pnpm install

# Deploy contracts (after updating Hub V2 address)
cd apps/contracts
pnpm compile
pnpm deploy:sepolia

# Update contract addresses in apps/web/src/lib/contracts.ts

# Run development server
cd apps/web
   pnpm dev
   ```

### Configuration

1. **Get Self Protocol Hub V2 Address**
   - Visit: https://docs.self.xyz/contract-integration/deployed-contracts
   - Update in `/apps/contracts/ignition/modules/ProofOfWomanhood.ts`

2. **Set up Farcaster Mini App**
   - Use ngrok for local testing
   - Generate manifest at farcaster.xyz/~/developers/mini-apps/manifest
   - Add credentials to `.env.local`

3. **Deploy & Configure**
   - Deploy contracts to Celo Sepolia
   - Update contract addresses in frontend
   - Test in Warpcast

📖 **Full instructions in [WOMANSPLAIN_SETUP.md](./WOMANSPLAIN_SETUP.md)**

## 🔐 Privacy & Security

- **Zero-Knowledge Verification**: Self Protocol ensures no personal data is stored on-chain
- **Anonymous Questions**: Submitters remain anonymous
- **Optional Anonymity for Advisors**: Women can choose to answer anonymously
- **On-Chain Verification**: All verification is cryptographically provable

## 🛣 Roadmap

### Phase 1: MVP ✅ (Current)
- [x] Core smart contracts
- [x] Submit question functionality
- [x] Advisor dashboard (gated)
- [x] Answer modal
- [x] Red flag voting
- [x] Profile with badges
- [x] Bold Celo brand design

### Phase 2: Self Protocol Integration (Next)
- [ ] Complete Self Protocol verification flow
- [ ] QR code verification UI
- [ ] End-to-end verification testing
- [ ] Deploy to Celo Sepolia

### Phase 3: Enhancements
- [ ] IPFS for screenshot storage
- [ ] Question categories/filtering
- [ ] Notifications for answers
- [ ] Advisor reputation scores
- [ ] More badge types

### Phase 4: Production
- [ ] Security audit
- [ ] Deploy to production
- [ ] Launch on Farcaster
- [ ] Optional: Celo mainnet deployment

## 🤝 Contributing

This is a hackathon/demo project. To extend it:

1. Fork the repository
2. Create a feature branch
3. Follow the Celo brand design guidelines
4. Test thoroughly on Celo Sepolia
5. Submit a pull request

## 📚 Documentation

- **[WOMANSPLAIN_SETUP.md](./WOMANSPLAIN_SETUP.md)** - Complete setup & deployment guide
- **[SELF_PROTOCOL_INTEGRATION.md](./SELF_PROTOCOL_INTEGRATION.md)** - Verification integration details
- **[FARCASTER_SETUP.md](./FARCASTER_SETUP.md)** - Farcaster mini app configuration

## 🔗 Resources

- [Self Protocol Docs](https://docs.self.xyz/)
- [Farcaster Mini Apps](https://miniapps.farcaster.xyz/)
- [Celo Docs](https://docs.celo.org/)
- [Celo Sepolia Explorer](https://celo-sepolia.blockscout.com/)

## 📄 License

MIT License - See LICENSE file for details

## 🙏 Acknowledgments

- **Celo** for the amazing Composer template and brand design
- **Self Protocol** for privacy-preserving identity verification
- **Farcaster** for the mini app platform
- Built using wagmi, viem, Next.js, and TailwindCSS

---

**Built with 💛 for Celo and Farcaster communities**

*Note: This is a demo/hackathon project. Full Self Protocol integration requires the actual Hub V2 address and SDK setup. See SELF_PROTOCOL_INTEGRATION.md for details.*
# ethglobalapp
