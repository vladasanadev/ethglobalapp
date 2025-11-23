import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

/**
 * Deployment module for ProofOfWomanhood contract
 * 
 * This deploys the proof-of-womanhood verification contract using Self Protocol.
 * The contract verifies users' gender on-chain by extracting the disclosed gender
 * from Self Protocol's verification output.
 * 
 * HOW IT WORKS:
 * 1. User proves identity via Self Protocol app with gender disclosure
 * 2. Proof is submitted to this contract
 * 3. IdentityVerificationHub validates the proof
 * 4. Contract extracts output.gender and checks if it's "F" (female)
 * 5. Only users with gender "F" are marked as verified women
 * 
 * IMPORTANT: Your frontend MUST request gender disclosure:
 *   disclosures: { gender: true }
 * 
 * Hub addresses: https://docs.self.xyz/contract-integration/deployed-contracts
 * - Celo Mainnet: 0xe57F4773bd9c9d8b6Cd70431117d353298B9f5BF
 * - Celo Sepolia: Check Self docs for latest testnet address
 */
const ProofOfWomanhoodModule = buildModule("ProofOfWomanhoodModule", (m) => {
  // Self Protocol Identity Verification Hub V2 address
  // Celo Sepolia: 0x16ECBA51e18a4a7e61fdC417f0d47AFEeDfbed74
  // Get from: https://docs.self.xyz/contract-integration/deployed-contracts
  const hubV2Address = m.getParameter(
    "hubV2Address",
    process.env.SELF_HUB_V2_ADDRESS || "0x16ECBA51e18a4a7e61fdC417f0d47AFEeDfbed74"
  );

  // Scope seed - unique identifier for this application
  // Keep it short (<=31 bytes). Used to prevent cross-app proof replay.
  // Changing this changes the scope and requires new frontend config.
  const scopeSeed = m.getParameter("scopeSeed", "womansplain");

  // Verification config - minimal since we only check gender on-chain
  // Age, country, and OFAC checks happen via Self Protocol off-chain
  const verificationConfig = {
    olderThan: 0,           // No age requirement (or set to 18 if needed)
    forbiddenCountries: [], // Allow all countries
    ofacEnabled: false      // No OFAC check
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

/**
 * DEPLOYMENT CHECKLIST:
 * 
 * 1. Update hubV2Address above with the actual Self Protocol hub address
 * 2. Deploy: npx hardhat ignition deploy ./ignition/modules/ProofOfWomanhood.ts --network celo-sepolia
 * 3. Note the deployed contract address
 * 4. Get the verificationConfigId from the deployed contract
 * 5. Update frontend to:
 *    - Use the correct contract address
 *    - Use the correct scope (will be computed from contract address + scopeSeed)
 *    - Request gender disclosure: disclosures: { gender: true }
 *    - Match the verification config
 * 
 * FRONTEND CONFIGURATION EXAMPLE:
 * 
 * const disclosures = {
 *   gender: true,  // REQUIRED - contract checks this field
 *   // Add other fields as needed:
 *   // nationality: true,
 *   // dateOfBirth: true,
 * };
 * 
 * const verificationConfig = {
 *   minimumAge: 0,           // Must match contract config
 *   forbiddenCountries: [],  // Must match contract config
 *   ofacCheck: false         // Must match contract config
 * };
 */

