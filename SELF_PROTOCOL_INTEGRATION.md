# Self Protocol Integration Guide

## Current Status: ⚠️ Placeholder Implementation

The WOMANSPLAIN app has the **UI and smart contracts ready** for Self Protocol verification, but the actual verification flow needs to be implemented.

## What's Already Done ✅

1. **Smart Contract** (`ProofOfWomanhood.sol`)
   - Extends `SelfVerificationRoot` abstract contract
   - Has `verifySelfProof()` function exposed
   - Handles `customVerificationHook()` to mark users as verified
   - Awards badges and validation points

2. **Verification Gate UI**
   - Component at `/apps/web/src/components/verification-gate.tsx`
   - Shows verification required message
   - Has placeholder button for "START VERIFICATION"
   - Reads verification status from contract

3. **Contract ABI**
   - Includes `verifySelfProof()` function in ABI
   - Ready to call from frontend

## What Needs Implementation 🚧

### 1. Get Self Protocol Hub V2 Address

**Critical First Step!**

Visit: https://docs.self.xyz/contract-integration/deployed-contracts

Find the Hub V2 address for **Celo Sepolia** and update:
```typescript
// File: apps/contracts/ignition/modules/ProofOfWomanhood.ts
const hubV2Address = m.getParameter(
  "hubV2Address",
  "0xACTUAL_HUB_V2_ADDRESS_HERE" // Replace this!
);
```

### 2. Understand Self Protocol Verification Flow

Based on the docs, the flow should be:

```
User clicks "Verify" 
  → Opens Self Protocol interface (QR code or deep link)
  → User completes gender verification in Self app
  → Self Protocol generates zero-knowledge proof
  → Proof returned to your app
  → Your app calls contract.verifySelfProof(proofPayload, userContextData)
  → Hub V2 verifies proof
  → If valid, Hub calls back your contract's onVerificationSuccess
  → Your customVerificationHook marks user as verified
```

### 3. Check for Self Protocol Frontend SDK

Look for:
- `@selfxyz/frontend-sdk` or similar package
- QR Code generator for verification
- Examples in Self Protocol documentation

Possible integration methods:
- **QR Code Flow**: Display QR code, user scans with Self app
- **Deep Link**: Direct link to Self Protocol app
- **iframe/modal**: Embedded verification UI

### 4. Implement in `verification-gate.tsx`

Replace the placeholder function:

```typescript
const handleStartVerification = () => {
  // TODO: Replace with actual Self Protocol flow
  alert("Placeholder - integrate Self Protocol here");
};
```

With actual implementation:

```typescript
const handleStartVerification = async () => {
  try {
    // 1. Generate verification request
    const verificationRequest = await selfProtocol.createVerificationRequest({
      scope: "proof-of-womanhood",
      contractAddress: CONTRACTS.PROOF_OF_WOMANHOOD.address,
      config: {
        gender: "female",
        minimumAge: 18,
        // ... other config
      }
    });

    // 2. Show QR code or redirect to Self app
    // ... display verification UI ...

    // 3. Wait for proof generation
    const proof = await waitForProof(verificationRequest.id);

    // 4. Submit proof to contract
    const tx = await writeContract({
      address: CONTRACTS.PROOF_OF_WOMANHOOD.address,
      abi: PROOF_OF_WOMANHOOD_ABI,
      functionName: "verifySelfProof",
      args: [proof.proofPayload, proof.userContextData],
    });

    // 5. Wait for confirmation
    await waitForTransaction(tx.hash);

    // 6. Update UI - user is now verified!
    setIsVerified(true);
    
  } catch (error) {
    console.error("Verification failed:", error);
    alert("Verification failed. Please try again.");
  }
};
```

### 5. Frontend-Contract Config Matching

**CRITICAL**: The frontend verification config MUST match the contract's verification config!

Contract config (set in constructor):
```solidity
verificationConfig = SelfUtils.formatVerificationConfigV2(_verificationConfig);
```

Frontend config must use the SAME parameters:
- Same gender requirement
- Same age requirement  
- Same forbidden countries
- Same OFAC setting
- Same scope seed

Otherwise, Hub V2 will reject the proof with a config mismatch error.

### 6. Scope Calculation

The contract calculates scope from:
- Contract address (automatically)
- Scope seed string ("proof-of-womanhood")

The frontend MUST use the same scope when generating the verification request.

You can read the actual scope from the contract:
```typescript
const scope = await readContract({
  address: CONTRACTS.PROOF_OF_WOMANHOOD.address,
  abi: PROOF_OF_WOMANHOOD_ABI,
  functionName: "scope",
});
```

## Implementation Checklist

- [ ] Find Self Protocol Hub V2 address for Celo Sepolia
- [ ] Update `ProofOfWomanhood.ts` deployment script with Hub address
- [ ] Deploy contracts to Celo Sepolia
- [ ] Research Self Protocol frontend integration options
- [ ] Install Self Protocol frontend SDK (if available)
- [ ] Implement verification flow in `verification-gate.tsx`
- [ ] Test verification end-to-end:
  - [ ] User clicks "START VERIFICATION"
  - [ ] Self Protocol verification completes
  - [ ] Proof submitted to contract
  - [ ] User marked as verified
  - [ ] Advisor Dashboard unlocks
  - [ ] Badge awarded
  - [ ] Points credited
- [ ] Handle error cases (rejection, timeout, invalid proof)
- [ ] Add loading states and user feedback

## Testing Without Full Integration

For development/testing, you can:

1. **Hardcode Verification** (temporary):
   ```solidity
   // Add to ProofOfWomanhood.sol for testing only
   function testVerify(address user) external {
     verifiedWomen[user] = true;
     verificationTimestamp[user] = block.timestamp;
     badges[user] |= VERIFIED_BADGE;
     _awardPoints(user, 50);
   }
   ```

2. **Mock the Verification Gate**:
   ```typescript
   // Temporarily skip verification check
   if (!isVerified && process.env.NODE_ENV === 'development') {
     setIsVerified(true);
   }
   ```

**Remember to remove test code before production!**

## Resources

- [Self Protocol Contract Integration](https://docs.self.xyz/contract-integration/basic-integration)
- [Self Protocol QR Code SDK](https://docs.self.xyz/frontend-integration/qrcode-sdk) (if available)
- [Self Protocol Deployed Contracts](https://docs.self.xyz/contract-integration/deployed-contracts)
- [Self Protocol Examples](https://docs.self.xyz/contract-integration/airdrop-example)

## Questions?

If stuck, check:
1. Self Protocol Discord/community
2. Self Protocol GitHub (look for example integrations)
3. Celo Discord (for Celo Sepolia specific issues)

---

**Note**: Once Self Protocol integration is complete, the app will be fully functional with privacy-preserving gender verification! 🎉


