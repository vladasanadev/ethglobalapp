import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

/**
 * Deployment module for ProofOfWomanhood contract
 * 
 * This deploys the proof-of-womanhood verification contract on Celo Sepolia
 * using Self Protocol's Identity Verification Hub V2
 */
const ProofOfWomanhoodModule = buildModule("ProofOfWomanhoodModule", (m) => {
  // Self Protocol Identity Verification Hub V2 address on Celo Sepolia
  // TODO: Update this with the actual deployed address on Celo Sepolia
  // Check: https://docs.self.xyz/contract-integration/deployed-contracts
  const hubV2Address = m.getParameter(
    "hubV2Address",
    "0x0000000000000000000000000000000000000000" // Placeholder - needs actual address
  );

  // Scope seed for proof-of-womanhood verification
  const scopeSeed = m.getParameter("scopeSeed", "proof-of-womanhood");

  // Verification config parameters
  // These define what we're verifying: gender = female, age >= 18
  const verificationConfig = {
    olderThan: 18,
    forbiddenCountries: [], // Empty array means all countries allowed
    ofacEnabled: false,
  };

  // Deploy ProofOfWomanhood contract
  const proofOfWomanhood = m.contract("ProofOfWomanhood", [
    hubV2Address,
    scopeSeed,
    verificationConfig,
  ]);

  return { proofOfWomanhood };
});

export default ProofOfWomanhoodModule;

