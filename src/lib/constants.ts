
export const AUDIT_CATEGORIES = [
  {
    id: "security",
    name: "Security",
    description: "Assessment of security vulnerabilities and risks",
    max_score: 25,
  },
  {
    id: "logic",
    name: "Business Logic",
    description: "Evaluation of the contract's business logic implementation",
    max_score: 20,
  },
  {
    id: "gas",
    name: "Gas Optimization",
    description: "Analysis of gas usage and optimization opportunities",
    max_score: 15,
  },
  {
    id: "reentry",
    name: "Reentrancy Protection",
    description: "Assessment of reentrancy protection mechanisms",
    max_score: 15,
  },
  {
    id: "standard",
    name: "Standards Compliance",
    description: "Adherence to Ethereum standards and best practices",
    max_score: 15,
  },
  {
    id: "code",
    name: "Code Quality",
    description: "Review of code quality, readability, and documentation",
    max_score: 10,
  },
];

export const SEVERITY_COLORS = {
  high: "bg-audit-high text-white",
  medium: "bg-audit-medium text-black",
  low: "bg-audit-low text-white",
  info: "bg-audit-info text-white",
  safe: "bg-audit-safe text-white",
};

export const SCORE_COLORS = {
  excellent: "text-audit-safe",
  good: "text-blockchain-primary",
  average: "text-audit-medium",
  poor: "text-audit-high",
};

export const getScoreColor = (score: number) => {
  if (score >= 90) return SCORE_COLORS.excellent;
  if (score >= 75) return SCORE_COLORS.good;
  if (score >= 60) return SCORE_COLORS.average;
  return SCORE_COLORS.poor;
};

export const getScoreLabel = (score: number) => {
  if (score >= 90) return "Excellent";
  if (score >= 75) return "Good";
  if (score >= 60) return "Average";
  return "Poor";
};

export const SAMPLE_SOLIDITY_CODE = `
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SimpleStorage {
    uint256 private storedData;
    
    function set(uint256 x) public {
        storedData = x;
    }
    
    function get() public view returns (uint256) {
        return storedData;
    }
}
`;
