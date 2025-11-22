// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import "./ProofOfWomanhood.sol";

/**
 * @title WomansplainQuestions
 * @notice Manages questions, answers, and red flag ratings for Womansplain
 * @dev Works with ProofOfWomanhood contract for access control
 */
contract WomansplainQuestions {
    ProofOfWomanhood public proofOfWomanhood;
    
    struct Question {
        uint256 id;
        address asker;
        string content;
        string screenshot; // IPFS hash or base64 encoded image
        uint256 timestamp;
        bool hasAnswer;
        uint256 redFlagScore; // 0-100, higher = more red flags
        uint256 totalVotes;
    }
    
    struct Answer {
        uint256 questionId;
        address advisor;
        string content;
        uint256 timestamp;
        bool isAnonymous;
    }
    
    struct RedFlagVote {
        address voter;
        uint256 score; // 0-100
        uint256 timestamp;
    }
    
    // Storage
    uint256 public questionCount;
    mapping(uint256 => Question) public questions;
    mapping(uint256 => Answer) public answers;
    mapping(uint256 => RedFlagVote[]) public redFlagVotes;
    mapping(uint256 => mapping(address => bool)) public hasVoted;
    
    // Events
    event QuestionSubmitted(
        uint256 indexed questionId,
        address indexed asker,
        string content,
        uint256 timestamp
    );
    
    event QuestionAnswered(
        uint256 indexed questionId,
        address indexed advisor,
        bool isAnonymous,
        uint256 timestamp
    );
    
    event RedFlagVoted(
        uint256 indexed questionId,
        address indexed voter,
        uint256 score,
        uint256 newAverageScore
    );
    
    /**
     * @notice Constructor
     * @param _proofOfWomanhood Address of the ProofOfWomanhood contract
     */
    constructor(address _proofOfWomanhood) {
        proofOfWomanhood = ProofOfWomanhood(_proofOfWomanhood);
    }
    
    /**
     * @notice Submit a new question (anyone can submit)
     * @param content The question text
     * @param screenshot Optional screenshot (IPFS hash or data URI)
     */
    function submitQuestion(string memory content, string memory screenshot) external returns (uint256) {
        require(bytes(content).length > 0, "Question cannot be empty");
        require(bytes(content).length <= 1000, "Question too long");
        
        questionCount++;
        uint256 questionId = questionCount;
        
        questions[questionId] = Question({
            id: questionId,
            asker: msg.sender,
            content: content,
            screenshot: screenshot,
            timestamp: block.timestamp,
            hasAnswer: false,
            redFlagScore: 0,
            totalVotes: 0
        });
        
        emit QuestionSubmitted(questionId, msg.sender, content, block.timestamp);
        
        return questionId;
    }
    
    /**
     * @notice Answer a question (only verified women)
     * @param questionId The ID of the question to answer
     * @param content The answer content
     * @param isAnonymous Whether to answer anonymously
     */
    function answerQuestion(
        uint256 questionId,
        string memory content,
        bool isAnonymous
    ) external {
        require(proofOfWomanhood.isVerifiedWoman(msg.sender), "Only verified women can answer");
        require(questionId > 0 && questionId <= questionCount, "Invalid question ID");
        require(!questions[questionId].hasAnswer, "Question already answered");
        require(bytes(content).length > 0, "Answer cannot be empty");
        require(bytes(content).length <= 2000, "Answer too long");
        
        questions[questionId].hasAnswer = true;
        
        answers[questionId] = Answer({
            questionId: questionId,
            advisor: msg.sender,
            content: content,
            timestamp: block.timestamp,
            isAnonymous: isAnonymous
        });
        
        // Award points to the advisor
        proofOfWomanhood.awardAnswerPoints(msg.sender, questionId);
        
        emit QuestionAnswered(questionId, msg.sender, isAnonymous, block.timestamp);
    }
    
    /**
     * @notice Vote on red flag severity (only verified women)
     * @param questionId The ID of the question to vote on
     * @param score Red flag score (0-100, where 100 is maximum red flag)
     */
    function voteRedFlag(uint256 questionId, uint256 score) external {
        require(proofOfWomanhood.isVerifiedWoman(msg.sender), "Only verified women can vote");
        require(questionId > 0 && questionId <= questionCount, "Invalid question ID");
        require(score <= 100, "Score must be 0-100");
        require(!hasVoted[questionId][msg.sender], "Already voted on this question");
        
        // Record vote
        redFlagVotes[questionId].push(RedFlagVote({
            voter: msg.sender,
            score: score,
            timestamp: block.timestamp
        }));
        
        hasVoted[questionId][msg.sender] = true;
        
        // Update question's red flag score (average of all votes)
        uint256 totalScore = 0;
        uint256 voteCount = redFlagVotes[questionId].length;
        
        for (uint256 i = 0; i < voteCount; i++) {
            totalScore += redFlagVotes[questionId][i].score;
        }
        
        questions[questionId].redFlagScore = totalScore / voteCount;
        questions[questionId].totalVotes = voteCount;
        
        // Award small points for voting
        proofOfWomanhood.awardRatingPoints(msg.sender, 2);
        
        emit RedFlagVoted(questionId, msg.sender, score, questions[questionId].redFlagScore);
    }
    
    /**
     * @notice Get all questions (paginated)
     * @param offset Starting index
     * @param limit Number of questions to return
     */
    function getQuestions(uint256 offset, uint256 limit) external view returns (Question[] memory) {
        require(offset < questionCount, "Offset out of bounds");
        
        uint256 end = offset + limit;
        if (end > questionCount) {
            end = questionCount;
        }
        
        uint256 resultCount = end - offset;
        Question[] memory result = new Question[](resultCount);
        
        for (uint256 i = 0; i < resultCount; i++) {
            result[i] = questions[offset + i + 1]; // Questions are 1-indexed
        }
        
        return result;
    }
    
    /**
     * @notice Get unanswered questions
     */
    function getUnansweredQuestions(uint256 limit) external view returns (Question[] memory) {
        // Count unanswered questions
        uint256 unansweredCount = 0;
        for (uint256 i = 1; i <= questionCount; i++) {
            if (!questions[i].hasAnswer) {
                unansweredCount++;
                if (unansweredCount >= limit) break;
            }
        }
        
        // Build result array
        Question[] memory result = new Question[](unansweredCount);
        uint256 index = 0;
        
        for (uint256 i = 1; i <= questionCount && index < unansweredCount; i++) {
            if (!questions[i].hasAnswer) {
                result[index] = questions[i];
                index++;
            }
        }
        
        return result;
    }
    
    /**
     * @notice Get answer for a question
     */
    function getAnswer(uint256 questionId) external view returns (Answer memory) {
        require(questionId > 0 && questionId <= questionCount, "Invalid question ID");
        require(questions[questionId].hasAnswer, "Question not answered yet");
        
        return answers[questionId];
    }
    
    /**
     * @notice Get red flag votes for a question
     */
    function getRedFlagVotes(uint256 questionId) external view returns (RedFlagVote[] memory) {
        require(questionId > 0 && questionId <= questionCount, "Invalid question ID");
        return redFlagVotes[questionId];
    }
    
    /**
     * @notice Get question with answer (if available)
     */
    function getQuestionWithAnswer(uint256 questionId) external view returns (
        Question memory question,
        Answer memory answer,
        bool hasAnswer
    ) {
        require(questionId > 0 && questionId <= questionCount, "Invalid question ID");
        
        question = questions[questionId];
        hasAnswer = question.hasAnswer;
        
        if (hasAnswer) {
            answer = answers[questionId];
        }
    }
}


