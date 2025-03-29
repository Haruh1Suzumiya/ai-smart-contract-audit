import { GoogleGenAI, Type } from '@google/genai';
import { getApiKey } from './supabase';

// Audit Schema
const auditSchema = {
  type: Type.OBJECT,
  properties: {
    'score': {
      type: Type.INTEGER,
      description: 'Overall score from 0-100',
    },
    'summary': {
      type: Type.STRING,
      description: 'Summary of the audit findings',
    },
    'categories': {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          'name': {
            type: Type.STRING,
            description: 'Category name',
          },
          'score': {
            type: Type.INTEGER,
            description: 'Score for this category',
          },
          'max_score': {
            type: Type.INTEGER,
            description: 'Maximum possible score for this category',
          },
          'description': {
            type: Type.STRING,
            description: 'Description of this category',
          },
          'issues': {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                'title': {
                  type: Type.STRING,
                  description: 'Title of the issue',
                },
                'description': {
                  type: Type.STRING,
                  description: 'Description of the issue',
                },
                'severity': {
                  type: Type.STRING,
                  enum: ['high', 'medium', 'low', 'info', 'safe'],
                  description: 'Severity level of the issue',
                },
                'code_reference': {
                  type: Type.STRING,
                  description: 'Reference to the code where the issue was found',
                  nullable: true,
                },
                'recommendation': {
                  type: Type.STRING,
                  description: 'Recommendation to fix the issue',
                },
              },
              required: ['title', 'description', 'severity', 'recommendation'],
            },
          },
        },
        required: ['name', 'score', 'max_score', 'description', 'issues'],
      },
    },
  },
  required: ['score', 'summary', 'categories'],
};

export async function performAudit(userId: string, solidityCode: string) {
  // Gemini APIキーを取得
  const apiKey = await getApiKey(userId, 'gemini');
  if (!apiKey) {
    throw new Error('Gemini API key not found. Please add your API key in settings.');
  }

  const genAI = new GoogleGenAI({ apiKey });

  // プロンプトの作成
  const prompt = `
  You are an expert smart contract auditor. Analyze the following Solidity code and provide a comprehensive security audit.
  Focus on these four main categories with equal importance (25 points each):
  
  1. Security Vulnerabilities: Look for reentrancy, integer overflow/underflow, access control issues, etc.
  2. Gas Optimization: Identify inefficient code patterns, unnecessary storage usage, etc.
  3. Code Quality: Evaluate code structure, readability, and maintainability.
  4. Smart Contract Best Practices: Check for proper use of modifiers, events, error handling, etc.
  
  For each category, assign a score out of 25 and identify specific issues with their severity levels.
  
  CODE TO AUDIT:
  \`\`\`solidity
  ${solidityCode}
  \`\`\`
  
  Your analysis should be thorough and actionable. For each issue, include a specific code reference and recommendation.
  `;

  try {
    const response = await genAI.models.generateContent({
      model: "gemini-2.5-pro-exp-03-25",
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: auditSchema,
      },
    });

    // 結果をJSONとしてパース
    let auditResult;
    try {
      const textResult = response.text;
      if (textResult) {
        auditResult = JSON.parse(textResult);
      } else {
        throw new Error('Empty response from Gemini');
      }
    } catch (e) {
      console.error('Failed to parse JSON response:', e);
      throw new Error('Failed to parse audit results');
    }

    return auditResult;
  } catch (error) {
    console.error('Gemini API error:', error);
    throw error;
  }
}

// GitHub からコードを取得する関数
export async function fetchCodeFromGithub(repoUrl: string): Promise<string> {
  try {
    // GitHub URLからユーザー名とリポジトリ名を抽出
    const urlParts = repoUrl.replace(/\/$/, '').split('/');
    const username = urlParts[urlParts.length - 2];
    const repo = urlParts[urlParts.length - 1];
    
    // GitHubのAPIを使用してソースコードを取得
    const apiUrl = `https://api.github.com/repos/${username}/${repo}/contents`;
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error(`GitHub API returned ${response.status}`);
    }
    
    const files = await response.json();
    
    // .solファイルを探す
    const solidityFiles = files.filter((file: { name: string }) => file.name.endsWith('.sol'));
    
    if (solidityFiles.length === 0) {
      throw new Error('No Solidity files found in the repository');
    }
    
    // 最初のSolidityファイルの内容を取得
    const fileUrl = solidityFiles[0].download_url;
    const codeResponse = await fetch(fileUrl);
    
    if (!codeResponse.ok) {
      throw new Error(`Failed to fetch Solidity code: ${codeResponse.status}`);
    }
    
    return await codeResponse.text();
  } catch (error) {
    console.error('Error fetching code from GitHub:', error);
    throw error;
  }
}