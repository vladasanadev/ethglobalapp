/**
 * Smart Contract Addresses and ABIs
 * 
 * Update these addresses after deploying contracts to Celo Sepolia
 */

export const CONTRACTS = {
  PROOF_OF_WOMANHOOD: {
    address: '0x7D03a457A5919Df05a37bDC424126A1C4D37E97D' as `0x${string}`,
    // Deployed to Celo Sepolia - Updated with gender storage
  },
  WOMANSPLAIN_QUESTIONS: {
    address: '0x0000000000000000000000000000000000000000' as `0x${string}`,
    // TODO: Deploy this contract
  },
};

// Self Protocol Hub V2 on Celo Sepolia
export const SELF_HUB_V2_ADDRESS = '0x16ECBA51e18a4a7e61fdC417f0d47AFEeDfbed74' as `0x${string}`;

// Chain ID for Celo Sepolia
export const CELO_SEPOLIA_CHAIN_ID = 11142220;

// Simplified ABIs for the functions we need
export const PROOF_OF_WOMANHOOD_ABI = [
  {
    "inputs": [{"internalType": "address", "name": "user", "type": "address"}],
    "name": "isVerifiedWoman",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "user", "type": "address"}],
    "name": "getUserGender",
    "outputs": [{"internalType": "string", "name": "", "type": "string"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "user", "type": "address"}],
    "name": "hasDisclosedGender",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "user", "type": "address"}],
    "name": "validationPoints",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "user", "type": "address"}],
    "name": "getUserBadges",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "bytes", "name": "proofPayload", "type": "bytes"},
      {"internalType": "bytes", "name": "userContextData", "type": "bytes"}
    ],
    "name": "verifySelfProof",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "address", "name": "user", "type": "address"},
      {"indexed": false, "internalType": "string", "name": "gender", "type": "string"},
      {"indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256"},
      {"indexed": false, "internalType": "bytes32", "name": "nullifier", "type": "bytes32"}
    ],
    "name": "GenderDisclosed",
    "type": "event"
  }
] as const;

export const WOMANSPLAIN_QUESTIONS_ABI = [
  {
    "inputs": [],
    "name": "questionCount",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "string", "name": "content", "type": "string"},
      {"internalType": "string", "name": "screenshot", "type": "string"}
    ],
    "name": "submitQuestion",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint256", "name": "questionId", "type": "uint256"},
      {"internalType": "string", "name": "content", "type": "string"},
      {"internalType": "bool", "name": "isAnonymous", "type": "bool"}
    ],
    "name": "answerQuestion",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint256", "name": "questionId", "type": "uint256"},
      {"internalType": "uint256", "name": "score", "type": "uint256"}
    ],
    "name": "voteRedFlag",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "limit", "type": "uint256"}],
    "name": "getUnansweredQuestions",
    "outputs": [{
      "components": [
        {"internalType": "uint256", "name": "id", "type": "uint256"},
        {"internalType": "address", "name": "asker", "type": "address"},
        {"internalType": "string", "name": "content", "type": "string"},
        {"internalType": "string", "name": "screenshot", "type": "string"},
        {"internalType": "uint256", "name": "timestamp", "type": "uint256"},
        {"internalType": "bool", "name": "hasAnswer", "type": "bool"},
        {"internalType": "uint256", "name": "redFlagScore", "type": "uint256"},
        {"internalType": "uint256", "name": "totalVotes", "type": "uint256"}
      ],
      "internalType": "struct WomansplainQuestions.Question[]",
      "name": "",
      "type": "tuple[]"
    }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "questionId", "type": "uint256"}],
    "name": "getQuestionWithAnswer",
    "outputs": [
      {
        "components": [
          {"internalType": "uint256", "name": "id", "type": "uint256"},
          {"internalType": "address", "name": "asker", "type": "address"},
          {"internalType": "string", "name": "content", "type": "string"},
          {"internalType": "string", "name": "screenshot", "type": "string"},
          {"internalType": "uint256", "name": "timestamp", "type": "uint256"},
          {"internalType": "bool", "name": "hasAnswer", "type": "bool"},
          {"internalType": "uint256", "name": "redFlagScore", "type": "uint256"},
          {"internalType": "uint256", "name": "totalVotes", "type": "uint256"}
        ],
        "internalType": "struct WomansplainQuestions.Question",
        "name": "question",
        "type": "tuple"
      },
      {
        "components": [
          {"internalType": "uint256", "name": "questionId", "type": "uint256"},
          {"internalType": "address", "name": "advisor", "type": "address"},
          {"internalType": "string", "name": "content", "type": "string"},
          {"internalType": "uint256", "name": "timestamp", "type": "uint256"},
          {"internalType": "bool", "name": "isAnonymous", "type": "bool"}
        ],
        "internalType": "struct WomansplainQuestions.Answer",
        "name": "answer",
        "type": "tuple"
      },
      {"internalType": "bool", "name": "hasAnswer", "type": "bool"}
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const;


