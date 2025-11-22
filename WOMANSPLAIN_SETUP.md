# WOMANSPLAIN - Setup & Deployment Guide

A Farcaster mini app for anonymous relationship advice from verified women, built with Self Protocol verification on Celo Sepolia.

## 🎨 Design System

The app uses **bold Celo brand design** with:
- **Colors**: Yellow (#FCFF52), Forest Green (#4E632A), Dark Purple (#1A0329), accents
- **Typography**: Playfair Display (headlines), Inter (body text)
- **Style**: High-contrast, sharp edges, big color blocks, raw structural design

## 📋 Features

1. **Submit Question Tab** - Anyone can submit relationship questions anonymously
2. **Advisor Dashboard** - Gated for verified women only to answer questions
3. **Answer Modal** - Women can respond anonymously or publicly
4. **Red Flag Rating** - Community votes on red flag severity (0-100%)
5. **Profile** - Shows earned badges and validation points

## 🛠 Tech Stack

- **Frontend**: Next.js 14, React, TailwindCSS
- **Wallet**: Wagmi + Farcaster MiniApp Connector (auto-connects)
- **Blockchain**: Celo Sepolia Testnet
- **Verification**: Self Protocol (proof-of-womanhood)
- **Smart Contracts**: Solidity 0.8.28, Hardhat

## 📦 Prerequisites

1. Node.js 18+ and pnpm
2. Farcaster account for testing mini app
3. Celo Sepolia testnet wallet with test tokens
4. Self Protocol app installed (for verification)

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd /Users/vladyslavaka/Desktop/eth/womansplain
pnpm install
```

### 2. Deploy Smart Contracts

**Important**: Update the Self Protocol Hub V2 address first!

1. Get the Hub V2 address for Celo Sepolia from: https://docs.self.xyz/contract-integration/deployed-contracts

2. Update the address in `/apps/contracts/ignition/modules/ProofOfWomanhood.ts`:
   ```typescript
   const hubV2Address = m.getParameter(
     "hubV2Address",
     "0xYOUR_ACTUAL_HUB_V2_ADDRESS_HERE"
   );
   ```

3. Set your private key:
   ```bash
   cd apps/contracts
   cp .env.example .env
   # Edit .env and add your PRIVATE_KEY
   ```

4. Deploy contracts:
   ```bash
   cd apps/contracts
   pnpm deploy:sepolia
   ```

5. Copy the deployed contract addresses and update `/apps/web/src/lib/contracts.ts`:
   ```typescript
   export const CONTRACTS = {
     PROOF_OF_WOMANHOOD: {
       address: '0xYOUR_DEPLOYED_ADDRESS' as `0x${string}`,
     },
     WOMANSPLAIN_QUESTIONS: {
       address: '0xYOUR_DEPLOYED_ADDRESS' as `0x${string}`,
     },
   };
   ```

### 3. Configure Farcaster Miniapp

1. Set up ngrok for local development:
   ```bash
   ngrok http 3000
   ```

2. Generate Farcaster manifest at:
   https://farcaster.xyz/~/developers/mini-apps/manifest?domain=YOUR_NGROK_URL

3. Create `.env.local` in `/apps/web/`:
   ```bash
   NEXT_PUBLIC_URL=https://your-ngrok-url.ngrok-free.app
   NEXT_PUBLIC_FARCASTER_HEADER=your_header_here
   NEXT_PUBLIC_FARCASTER_PAYLOAD=your_payload_here
   NEXT_PUBLIC_FARCASTER_SIGNATURE=your_signature_here
   ```

### 4. Run Development Server

```bash
cd apps/web
pnpm dev
```

Open your ngrok URL in Warpcast to test the mini app!

## 🔐 Self Protocol Integration

### Current Status

The UI is ready with a verification gate. **Full Self Protocol integration is pending** and requires:

1. **Get Self Protocol SDK**: Check if there's a frontend SDK for verification flow
2. **Implement Verification Flow**:
   - User initiates verification in the app
   - Self Protocol generates zero-knowledge proof
   - User submits proof to `ProofOfWomanhood` contract via `verifySelfProof()`
3. **Update VerificationGate Component**: Replace the placeholder with actual Self Protocol integration

### How Verification Works

1. User clicks "START VERIFICATION" in the Advisor Dashboard
2. Self Protocol verifies gender identity using zero-knowledge proofs (privacy-protected)
3. Proof is submitted to `ProofOfWomanhood` contract on Celo Sepolia
4. Contract verifies proof via Self's Identity Verification Hub V2
5. User is marked as verified woman on-chain
6. User earns "VERIFIED" badge and 50 validation points

### Verification Config

The `ProofOfWomanhood` contract is configured with:
- **Scope**: "proof-of-womanhood"
- **Gender**: Female required
- **Age**: 18+ required
- **Countries**: All allowed
- **OFAC**: Disabled

## 📝 Smart Contract Architecture

### ProofOfWomanhood.sol

- Extends `SelfVerificationRoot` from Self Protocol
- Verifies gender identity using Self's Hub V2
- Tracks verification status, points, and badges
- Awards points for answering questions and voting

### WomansplainQuestions.sol

- Stores questions and answers on-chain
- Enforces access control via ProofOfWomanhood
- Manages red flag voting
- Anonymous answer support

## 🎮 User Flows

### Submit Question (Anyone)
1. Connect wallet (auto via Farcaster)
2. Go to "SUBMIT QUESTION" tab
3. Enter question and optional screenshot
4. Submit transaction

### Answer Question (Verified Women Only)
1. Get verified via Self Protocol
2. Access "ADVISOR DASHBOARD" tab
3. Review unanswered questions
4. Click "ANSWER QUESTION"
5. Write answer (choose anonymous/public)
6. Submit and earn 10 points

### Vote Red Flag (Verified Women Only)
1. From Advisor Dashboard
2. Click "VOTE RED FLAG" on a question
3. Rate severity 0-100%
4. Submit and earn 2 points

### View Profile
1. Check verification status
2. See total validation points
3. View earned badges:
   - VERIFIED (initial verification)
   - ADVISOR (100 points / 10 answers)
   - EXPERT (300 points / 30 answers)
   - LEGEND (1050 points / 105 answers)

## 🎨 Customization

### Colors

Edit `/apps/web/src/lib/design-system.ts` to customize the Celo brand colors.

### Typography

The app uses:
- **Playfair Display** as GT Alpina alternative (headlines)
- **Inter** for body text

To use actual GT Alpina, purchase the font and update the font imports in `globals.css`.

### Components

All UI components follow the design system in `/apps/web/src/lib/design-system.ts` with:
- Sharp edges (no border-radius)
- Bold color inversions on hover
- High contrast
- Big typography

## 🐛 Troubleshooting

### "Chain 11142220 not supported" error
This is Celo Sepolia. Make sure you've added it to your wallet context (already done in `frame-wallet-context.tsx`).

### Contract deployment fails
1. Check you have Celo Sepolia test tokens
2. Verify the Self Protocol Hub V2 address is correct
3. Ensure Foundry is updated: `foundryup --install 0.3.0`

### Wallet not connecting
The Farcaster miniapp connector should auto-connect. If not:
1. Make sure you're opening the app in Warpcast
2. Check your Farcaster manifest is correctly configured
3. Verify the ngrok URL matches the signed domain

### Verification not working
Full Self Protocol integration is not yet complete. See "Self Protocol Integration" section above.

## 📚 Resources

- [Self Protocol Docs](https://docs.self.xyz/contract-integration/basic-integration)
- [Farcaster Mini Apps](https://miniapps.farcaster.xyz/)
- [Celo Sepolia Faucet](https://faucet.celo.org/)
- [Celo Explorer](https://celo-sepolia.blockscout.com/)

## 🚧 Next Steps

1. **Complete Self Protocol Integration**
   - Implement actual verification flow in `verification-gate.tsx`
   - Connect Self Protocol SDK/QRCode flow
   - Test end-to-end verification

2. **Add IPFS for Screenshots**
   - Integrate IPFS upload for question screenshots
   - Store IPFS hashes in contract

3. **Production Deployment**
   - Deploy to production domain
   - Update Farcaster manifest for prod
   - Deploy contracts to Celo mainnet (optional)

4. **Enhanced Features**
   - Notification system for new answers
   - Question categories/filtering
   - Advisor reputation scores
   - More badge types

## 📄 License

MIT

---

Built with 💛 using Celo Composer & Self Protocol


