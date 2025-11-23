// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {SelfVerificationRoot} from "@selfxyz/contracts/contracts/abstract/SelfVerificationRoot.sol";
import {ISelfVerificationRoot} from "@selfxyz/contracts/contracts/interfaces/ISelfVerificationRoot.sol";
import {SelfStructs} from "@selfxyz/contracts/contracts/libraries/SelfStructs.sol";
import {SelfUtils} from "@selfxyz/contracts/contracts/libraries/SelfUtils.sol";
import {IIdentityVerificationHubV2} from "@selfxyz/contracts/contracts/interfaces/IIdentityVerificationHubV2.sol";

/**
 * @title ProofOfWomanhood
 * @notice Verifies that users are women using Self Protocol gender verification
 * @dev Extends SelfVerificationRoot to enable "proof-of-womanhood" verification
 */
contract ProofOfWomanhood is SelfVerificationRoot {
    // Storage
    SelfStructs.VerificationConfigV2 public verificationConfig;
    bytes32 public verificationConfigId;
    
    // Mapping from user address to verification status (only for women)
    mapping(address => bool) public verifiedWomen;
    
    // Mapping from user address to disclosed gender ("M" or "F")
    mapping(address => string) public userGender;
    
    // Mapping from user address to verification timestamp
    mapping(address => uint256) public verificationTimestamp;
    
    // Mapping from user address to validation points earned
    mapping(address => uint256) public validationPoints;
    
    // Mapping from user address to badges earned (bit flags)
    mapping(address => uint256) public badges;
    
    // Badge constants
    uint256 public constant VERIFIED_BADGE = 1 << 0;      // First verification
    uint256 public constant ADVISOR_BADGE = 1 << 1;       // Answered 5 questions
    uint256 public constant EXPERT_BADGE = 1 << 2;        // Answered 25 questions
    uint256 public constant LEGEND_BADGE = 1 << 3;        // Answered 100 questions
    
    // Events
    event GenderDisclosed(
        address indexed user,
        string gender,
        uint256 timestamp,
        bytes32 nullifier
    );
    
    event WomanVerified(
        address indexed user,
        uint256 timestamp,
        bytes32 nullifier
    );
    
    event PointsAwarded(
        address indexed user,
        uint256 points,
        uint256 totalPoints
    );
    
    event BadgeEarned(
        address indexed user,
        uint256 badge
    );
    
    // Debug events for gender verification
    event DebugVerificationHook(
        string message,
        address user,
        uint256 value
    );
    
    event DebugGenderCheck(
        string message,
        uint256 attestationId,
        uint256 genderValue,
        bool isWoman
    );

    /**
     * @notice Constructor
     * @param identityVerificationHubV2Address The address of the Identity Verification Hub V2
     * @param scopeSeed Scope seed for proof-of-womanhood (e.g., "proof-of-womanhood")
     * @param _verificationConfig Unformatted verification config with gender requirements
     */
    constructor(
        address identityVerificationHubV2Address,
        string memory scopeSeed,
        SelfUtils.UnformattedVerificationConfigV2 memory _verificationConfig
    ) SelfVerificationRoot(identityVerificationHubV2Address, scopeSeed) {
        // Format and register the verification config
        verificationConfig = SelfUtils.formatVerificationConfigV2(_verificationConfig);
        verificationConfigId = IIdentityVerificationHubV2(identityVerificationHubV2Address)
            .setVerificationConfigV2(verificationConfig);
    }
    
    /**
     * @notice Implementation of customVerificationHook
     * @dev Called after hub verification succeeds - stores gender and verifies women
     * @param output The verification output from the hub
     * @param userData The user data passed through verification
     */
    function customVerificationHook(
        ISelfVerificationRoot.GenericDiscloseOutputV2 memory output,
        bytes memory userData
    ) internal override {
        // Derive user address from userIdentifier
        address user = address(uint160(uint256(output.userIdentifier)));
        
        emit DebugVerificationHook("Verification hook called", user, uint256(output.nullifier));
        
        // Check gender from output.gender field
        // Gender is disclosed as a string: "F" for female, "M" for male
        string memory gender = output.gender;
        
        // Convert first character of gender string
        bytes memory genderBytes = bytes(gender);
        require(genderBytes.length > 0, "Gender not disclosed");
        
        // Check if gender is "F" (Female) or "M" (Male)
        bool isWoman = genderBytes[0] == bytes1("F");
        bool isMan = genderBytes[0] == bytes1("M");
        
        require(isWoman || isMan, "Gender must be M (male) or F (female)");
        
        emit DebugGenderCheck(
            "Gender check",
            uint256(output.attestationId),
            uint256(uint8(genderBytes[0])),
            isWoman
        );
        
        // Store gender for this user (accessible by frontend)
        userGender[user] = gender;
        verificationTimestamp[user] = block.timestamp;
        
        // Emit gender disclosure event (frontend can listen to this)
        emit GenderDisclosed(user, gender, block.timestamp, bytes32(output.nullifier));
        
        // Only women get verified status, badges, and points
        if (isWoman) {
            emit DebugVerificationHook("Gender: Female - granting verified status", user, 1);
            
            // Mark as verified woman
            verifiedWomen[user] = true;
            
            // Award verification badge if not already earned
            if (badges[user] & VERIFIED_BADGE == 0) {
                badges[user] |= VERIFIED_BADGE;
                emit BadgeEarned(user, VERIFIED_BADGE);
            }
            
            // Award initial validation points
            _awardPoints(user, 50);
            
            emit WomanVerified(user, block.timestamp, bytes32(output.nullifier));
        } else {
            emit DebugVerificationHook("Gender: Male - no verified status granted", user, 0);
        }
        
        emit DebugVerificationHook("Verification complete", user, validationPoints[user]);
    }

    /**
     * @notice Returns the verification config ID
     */
    function getConfigId(
        bytes32 /* destinationChainId */,
        bytes32 /* userIdentifier */,
        bytes memory /* userDefinedData */
    ) public view override returns (bytes32) {
        return verificationConfigId;
    }
    
    /**
     * @notice Check if an address is a verified woman
     */
    function isVerifiedWoman(address user) external view returns (bool) {
        return verifiedWomen[user];
    }
    
    /**
     * @notice Get the disclosed gender of a user
     * @return gender string - "F" for female, "M" for male, "" if not disclosed
     */
    function getUserGender(address user) external view returns (string memory) {
        return userGender[user];
    }
    
    /**
     * @notice Check if user has disclosed their gender (either M or F)
     */
    function hasDisclosedGender(address user) external view returns (bool) {
        return bytes(userGender[user]).length > 0;
    }
    
    /**
     * @notice Award validation points to a user (internal helper)
     */
    function _awardPoints(address user, uint256 points) internal {
        validationPoints[user] += points;
        emit PointsAwarded(user, points, validationPoints[user]);
        
        // Check for badge milestones
        _checkBadges(user);
    }
    
    /**
     * @notice Award points for answering a question (called by WomansplainQuestions contract)
     */
    function awardAnswerPoints(address user, uint256 questionId) external {
        require(verifiedWomen[user], "User must be verified woman");
        _awardPoints(user, 10);
    }
    
    /**
     * @notice Award points for helpful red flag ratings (called by WomansplainQuestions contract)
     */
    function awardRatingPoints(address user, uint256 points) external {
        require(verifiedWomen[user], "User must be verified woman");
        _awardPoints(user, points);
    }
    
    /**
     * @notice Check and award badges based on validation points
     */
    function _checkBadges(address user) internal {
        uint256 points = validationPoints[user];
        
        // Advisor badge: 50 points (5 answers)
        if (points >= 100 && (badges[user] & ADVISOR_BADGE == 0)) {
            badges[user] |= ADVISOR_BADGE;
            emit BadgeEarned(user, ADVISOR_BADGE);
        }
        
        // Expert badge: 250 points (25 answers)
        if (points >= 300 && (badges[user] & EXPERT_BADGE == 0)) {
            badges[user] |= EXPERT_BADGE;
            emit BadgeEarned(user, EXPERT_BADGE);
        }
        
        // Legend badge: 1000 points (100 answers)
        if (points >= 1050 && (badges[user] & LEGEND_BADGE == 0)) {
            badges[user] |= LEGEND_BADGE;
            emit BadgeEarned(user, LEGEND_BADGE);
        }
    }
    
    /**
     * @notice Get all badges for a user
     */
    function getUserBadges(address user) external view returns (uint256) {
        return badges[user];
    }
    
    /**
     * @notice Check if user has a specific badge
     */
    function hasBadge(address user, uint256 badge) external view returns (bool) {
        return (badges[user] & badge) != 0;
    }
}

