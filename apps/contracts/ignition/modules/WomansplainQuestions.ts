import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import ProofOfWomanhoodModule from "./ProofOfWomanhood";

/**
 * Deployment module for WomansplainQuestions contract
 * 
 * This deploys the questions/answers management contract
 * Depends on ProofOfWomanhood being deployed first
 */
const WomansplainQuestionsModule = buildModule("WomansplainQuestionsModule", (m) => {
  // Use the ProofOfWomanhood contract from the previous module
  const { proofOfWomanhood } = m.useModule(ProofOfWomanhoodModule);

  // Deploy WomansplainQuestions contract
  const womansplainQuestions = m.contract("WomansplainQuestions", [
    proofOfWomanhood,
  ]);

  return { proofOfWomanhood, womansplainQuestions };
});

export default WomansplainQuestionsModule;


