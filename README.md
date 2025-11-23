# WOMANSPLAIN

**Anonymous relationship advice from verified women on Farcaster**

A Farcaster mini app where anyone can submit relationship questions and get honest, unfiltered advice from verified women. Built with Self Protocol verification, Celo blockchain, and bold Celo brand design.

![Status](https://img.shields.io/badge/status-ready%20for%20deployment-green)
![Solidity](https://img.shields.io/badge/solidity-0.8.28-blue)
![Next.js](https://img.shields.io/badge/next.js-14-black)

---

## Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Quick Start](#quick-start)
- [Onchain Functionality](#onchain-functionality)
- [Wallet Integration](#wallet-integration)
- [Development Guide](#development-guide)
- [Deployment](#deployment)
- [Resources](#resources)

---

## Features

### For Everyone
- **Submit Questions**: Anonymously ask relationship questions with optional screenshots
- **View Red Flag Ratings**: See community consensus on red flag severity (0-100%)

### For Verified Women Only
- **Advisor Dashboard**: Access to all unanswered questions
- **Answer Questions**: Provide advice anonymously or publicly
- **Vote on Red Flags**: Rate situations from green flag (healthy) to red flag (dangerous)
- **Earn Badges & Points**: Build reputation through helpful contributions

### Badges System
- **VERIFIED** - Complete Self Protocol verification (50 pts)
- **ADVISOR** - Answer 10 questions (100 pts total)
- **EXPERT** - Answer 30 questions (300 pts total)
- **LEGEND** - Answer 105 questions (1050 pts total)

---

## Architecture

### Smart Contracts (Solidity 0.8.28)

#### ProofOfWomanhood.sol
- Extends Self Protocol's `SelfVerificationRoot`
- Verifies gender identity using zero-knowledge proofs
- Manages verification status, points, and badges
- 187 lines of custom logic

#### WomansplainQuestions.sol
- On-chain question and answer storage
- Red flag voting mechanism with weighted scoring
- Access control via ProofOfWomanhood contract
- Anonymous answer support
- 262 lines of custom logic

### Frontend (Next.js 14 + React)

- **Farcaster Mini App** with seamless wallet connection
- **Wagmi + Viem** for blockchain interactions
- **Celo Networks** support (Mainnet, Alfajores, Sepolia)
- **Bold UI** following Celo brand guidelines
- **Tab-based navigation**: Submit / Advisor / Profile

### Design Philosophy

**Bold Celo Brand Aesthetic**:
- High-contrast color palette (Yellow #FCFF52, Forest Green #4E632A, Dark Purple #1A0329)
- Sharp edges, no rounded corners
- Big typography with Playfair Display headlines and Inter body text
- Color block sections with visible structure
- Industrial, poster-like interface

---

## Project Structure

```
womansplain/
├── apps/
│   ├── contracts/              # Hardhat smart contracts
│   │   ├── contracts/
│   │   │   ├── ProofOfWomanhood.sol
│   │   │   └── WomansplainQuestions.sol
│   │   ├── ignition/modules/   # Deployment scripts
│   │   ├── test/               # Contract tests
│   │   └── hardhat.config.ts
│   │
│   └── web/                    # Next.js frontend
│       └── src/
│           ├── app/
│           │   ├── page.tsx
│           │   └── wallet-demo/
│           ├── components/
│           │   ├── tabs/       # Submit, Advisor, Profile
│           │   ├── wallet-connect.tsx
│           │   ├── transaction-status.tsx
│           │   └── verification-gate.tsx
│           ├── hooks/
│           │   ├── use-contract-interaction.ts
│           │   └── use-simple-onchain.ts
│           ├── contexts/
│           │   └── frame-wallet-context.tsx
│           └── lib/
│               ├── contracts.ts
│               └── design-system.ts
│
├── WOMANSPLAIN_SETUP.md
├── SELF_PROTOCOL_INTEGRATION.md
└── FARCASTER_SETUP.md
```

---

## Quick Start

### Prerequisites

- Node.js 18+ and pnpm
- Farcaster account
- Celo Sepolia testnet wallet with test tokens
- Self Protocol Hub V2 address (see [docs](https://docs.self.xyz/contract-integration/deployed-contracts))

### Installation

```bash
# Clone and install dependencies
cd /Users/vladyslavaka/Desktop/eth/womansplain
pnpm install

# Compile contracts
cd apps/contracts
pnpm compile

# Deploy contracts (after updating Hub V2 address)
pnpm deploy:sepolia

# Update contract addresses in apps/web/src/lib/contracts.ts

# Run development server
cd apps/web
pnpm dev
```

### Configuration

1. **Get Self Protocol Hub V2 Address**
   - Visit: https://docs.self.xyz/contract-integration/deployed-contracts
   - Update in `apps/contracts/ignition/modules/ProofOfWomanhood.ts`

2. **Set up Farcaster Mini App**
   - Use ngrok for local testing: `ngrok http 3000`
   - Generate manifest at farcaster.xyz/~/developers/mini-apps/manifest
   - Add credentials to `.env.local` in `apps/web`

3. **Get Testnet Tokens**
   - Visit [Celo Faucet](https://faucet.celo.org/)
   - Request Sepolia testnet CELO

Full setup instructions available in [WOMANSPLAIN_SETUP.md](./WOMANSPLAIN_SETUP.md)

---

## Onchain Functionality

This app implements both simple blockchain operations and custom smart contract logic:

### Simple Operations (Option 1)

Basic blockchain interactions for payments and transfers:

**Available Hooks:**
- `useCeloPayment()` - Send native CELO payments
- `useCeloBalance()` - Check CELO balance
- `useTokenTransfer()` - Transfer ERC-20 tokens (cUSD, cEUR)
- `useTokenBalance()` - Check token balances
- `useTokenApproval()` - Approve token spending

**Example:**
```typescript
import { useCeloPayment } from "@/hooks/use-simple-onchain";

function SendTip() {
  const { sendPayment, isPending, hash } = useCeloPayment();
  
  return (
    <button onClick={() => sendPayment('0x...', '0.1')}>
      Send 0.1 CELO
    </button>
  );
}
```

### Custom Contract Logic (Option 3)

Full-featured custom contract interactions:

**Available Hooks:**
- `useWomansplainQuestions()` - Submit, answer, and vote on questions
- `useWomansplainQuestionsRead()` - Read questions from contract
- `useProofOfWomanhood()` - Verify users via Self Protocol
- `useProofOfWomanhoodRead()` - Check verification status
- `useBatchTransactions()` - Execute multiple transactions in one confirmation

**Example:**
```typescript
import { useWomansplainQuestions } from "@/hooks/use-contract-interaction";

function SubmitQuestion() {
  const { submitQuestion, isPending } = useWomansplainQuestions();
  
  return (
    <button onClick={() => submitQuestion("My question", "")}>
      Submit Question
    </button>
  );
}
```

**Batch Transaction Example:**
```typescript
import { useBatchTransactions } from "@/hooks/use-contract-interaction";
import { encodeFunctionData } from "viem";

function AnswerAndVote({ questionId }) {
  const { sendBatchCalls } = useBatchTransactions();
  
  const handleBatch = async () => {
    await sendBatchCalls([
      {
        to: CONTRACT_ADDRESS,
        data: encodeFunctionData({
          abi: ABI,
          functionName: "answerQuestion",
          args: [questionId, "My answer", false]
        })
      },
      {
        to: CONTRACT_ADDRESS,
        data: encodeFunctionData({
          abi: ABI,
          functionName: "voteRedFlag",
          args: [questionId, 7n]
        })
      }
    ]);
  };
  
  return <button onClick={handleBatch}>Answer & Vote</button>;
}
```

---

## Wallet Integration

This app uses the Farcaster Mini App SDK for seamless wallet connection without popup dialogs.

### Key Features

- **Auto-connect on page load** - No manual wallet selection required
- **No popup dialogs** - Farcaster client handles everything
- **Multi-chain support** - Celo Mainnet, Alfajores, Sepolia
- **Batch transactions** - EIP-5792 support for multiple transactions in one confirmation
- **Transaction tracking** - Built-in status display for all transaction states

### Quick Setup

The wallet is already configured and ready to use. Wagmi is set up with the Farcaster connector in `apps/web/src/contexts/frame-wallet-context.tsx`.

**Basic Usage:**
```typescript
import { WalletConnect, WalletStatus } from "@/components/wallet-connect";
import { TransactionStatus } from "@/components/transaction-status";
import { useAccount } from "wagmi";

function MyComponent() {
  const { isConnected, address } = useAccount();
  
  if (!isConnected) {
    return <WalletConnect />;
  }
  
  return <div>Connected: {address}</div>;
}
```

### Batch Transactions

Execute multiple transactions with a single user confirmation:

```typescript
import { useBatchTransactions } from "@/hooks/use-contract-interaction";

const { sendBatchCalls } = useBatchTransactions();

await sendBatchCalls([
  { to: address1, data: encodedData1 },
  { to: address2, data: encodedData2 }
]);
```

**Use Cases:**
- Approve token + Execute swap
- Answer question + Vote on red flag
- Multiple NFT operations

**Limitations:**
- Executes sequentially, not atomically
- No paymaster support yet
- Available on all EVM chains Farcaster supports

Learn more: [Farcaster Wallet Integration Guide](https://miniapps.farcaster.xyz/docs/guides/wallets)

---

## Development Guide

### Component Patterns

#### Check Wallet Connection
```typescript
const { address, isConnected } = useAccount();

if (!isConnected) {
  return <WalletConnect />;
}
```

#### Submit Transaction
```typescript
const { submitQuestion, hash, isPending, isSuccess, error } = 
  useWomansplainQuestions();

return (
  <>
    <button onClick={() => submitQuestion("content", "")} disabled={isPending}>
      Submit
    </button>
    <TransactionStatus
      hash={hash}
      isPending={isPending}
      isSuccess={isSuccess}
      error={error}
    />
  </>
);
```

#### Read Contract State
```typescript
const { address } = useAccount();
const { isVerified, validationPoints, isLoading } = 
  useProofOfWomanhoodRead(address);

if (isLoading) return <div>Loading...</div>;

return (
  <div>
    <p>Verified: {isVerified ? "Yes" : "No"}</p>
    <p>Points: {validationPoints?.toString()}</p>
  </div>
);
```

### Testing

```bash
# Run contract tests
cd apps/contracts
npx hardhat test

# Start dev server
cd apps/web
npm run dev

# Visit demo page
open http://localhost:3000/wallet-demo
```

The `/wallet-demo` page shows live examples of:
- Simple payment operations
- Custom contract interactions
- Batch transactions
- Transaction status tracking

---

## Deployment

### 1. Deploy Contracts

```bash
cd apps/contracts

# Setup environment
cp .env.example .env
# Add your PRIVATE_KEY

# Get testnet tokens
# Visit https://faucet.celo.org/

# Deploy to Celo Sepolia
npx hardhat ignition deploy ./ignition/modules/ProofOfWomanhood.ts --network celo-sepolia
npx hardhat ignition deploy ./ignition/modules/WomansplainQuestions.ts --network celo-sepolia

# Verify contracts
npx hardhat verify --network celo-sepolia DEPLOYED_ADDRESS
```

### 2. Update Frontend

Edit `apps/web/src/lib/contracts.ts` with deployed addresses:

```typescript
export const CONTRACTS = {
  PROOF_OF_WOMANHOOD: {
    address: '0xYourDeployedAddress' as `0x${string}`,
  },
  WOMANSPLAIN_QUESTIONS: {
    address: '0xYourDeployedAddress' as `0x${string}`,
  },
};
```

### 3. Deploy Frontend

```bash
cd apps/web

# Build for production
npm run build

# Deploy to Vercel/Netlify/your hosting provider
```

### 4. Configure Farcaster Mini App

1. Update your manifest with production URL
2. Submit for review at farcaster.xyz/~/developers/mini-apps
3. Test thoroughly before launch

---

## Privacy & Security

- **Zero-Knowledge Verification**: Self Protocol ensures no personal data is stored on-chain
- **Anonymous Questions**: Submitters remain anonymous
- **Optional Anonymity for Advisors**: Women can choose to answer anonymously or publicly
- **On-Chain Verification**: All verification is cryptographically provable
- **Access Control**: Only verified women can access advisor features

### Security Considerations

Before mainnet deployment:
1. Professional security audit of smart contracts
2. Comprehensive unit and integration tests
3. Testnet stress testing
4. Review by experienced Solidity developers
5. Bug bounty program consideration

---

## Roadmap

### Phase 1: MVP (Complete)
- [x] Core smart contracts
- [x] Submit question functionality
- [x] Advisor dashboard (gated)
- [x] Answer modal
- [x] Red flag voting
- [x] Profile with badges
- [x] Bold Celo brand design
- [x] Wallet integration
- [x] Transaction management

### Phase 2: Self Protocol Integration (In Progress)
- [ ] Complete Self Protocol verification flow
- [ ] QR code verification UI
- [ ] End-to-end verification testing
- [ ] Deploy contracts to Celo Sepolia

### Phase 3: Enhancements
- [ ] IPFS for screenshot storage
- [ ] Question categories and filtering
- [ ] Notifications for answers
- [ ] Advisor reputation scores
- [ ] Additional badge types
- [ ] Mobile optimization

### Phase 4: Production
- [ ] Security audit
- [ ] Gas optimization
- [ ] Production deployment
- [ ] Launch on Farcaster
- [ ] Celo mainnet deployment

---

## Resources

### Documentation
- [WOMANSPLAIN_SETUP.md](./WOMANSPLAIN_SETUP.md) - Complete setup guide
- [SELF_PROTOCOL_INTEGRATION.md](./SELF_PROTOCOL_INTEGRATION.md) - Verification integration
- [FARCASTER_SETUP.md](./FARCASTER_SETUP.md) - Farcaster mini app configuration

### External Resources
- [Self Protocol Docs](https://docs.self.xyz/)
- [Farcaster Mini Apps](https://miniapps.farcaster.xyz/)
- [Wagmi Documentation](https://wagmi.sh/react/getting-started)
- [Viem Documentation](https://viem.sh/)
- [Celo Documentation](https://docs.celo.org/)
- [Celo Sepolia Explorer](https://celo-sepolia.blockscout.com/)

### Token Addresses (Celo Networks)

**Mainnet:**
- cUSD: `0x765DE816845861e75A25fCA122bb6898B8B1282a`
- cEUR: `0xD8763CBa276a3738E6DE85b4b3bF5FDed6D6cA73`
- cREAL: `0xe8537a3d056DA446677B9E9d6c5dB704EaAb4787`

**Alfajores Testnet:**
- cUSD: `0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1`
- cEUR: `0x10c892A6EC43a53E45D0B916B4b7D383B1b78C0F`

**Sepolia Testnet:**
- cUSD: `0x765DE816845861e75A25fCA122bb6898B8B1282a`

---

## Contributing

This is a hackathon/demo project. To extend it:

1. Fork the repository
2. Create a feature branch
3. Follow the Celo brand design guidelines
4. Test thoroughly on Celo Sepolia
5. Submit a pull request

---

## License

MIT License - See LICENSE file for details

---

## Acknowledgments

- **Celo** for the Composer template and brand design
- **Self Protocol** for privacy-preserving identity verification
- **Farcaster** for the mini app platform
- Built with wagmi, viem, Next.js, and TailwindCSS

---

**Built for the Celo and Farcaster communities**

*Note: This is a demo/hackathon project. Full Self Protocol integration requires the actual Hub V2 address and SDK setup. See SELF_PROTOCOL_INTEGRATION.md for details.*
