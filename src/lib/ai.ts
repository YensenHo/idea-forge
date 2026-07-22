// DeepSeek API (OpenAI-compatible)
const AI_API_KEY = process.env.DEEPSEEK_API_KEY || process.env.OPENAI_API_KEY;
const AI_BASE_URL = process.env.AI_BASE_URL || 'https://api.deepseek.com/v1';
const AI_MODEL = process.env.AI_MODEL || 'deepseek-chat';

interface IdeaAnalysis {
  title: string;
  description: string;
  target_user: string;
  pain_points: string;
  tags: string[];
}

const SYSTEM_PROMPT = `你是一个产品需求分析师。用户会描述一个他们想要的 App 或产品创意，你需要将其拆解为结构化的需求分析。

请严格按照以下 JSON 格式返回（不要包含其他文字）：
{
  "title": "简洁的产品名称（15字以内）",
  "description": "产品描述，将用户的想法整理成清晰的段落，保留用户原意但让表达更清晰（200字以内）",
  "target_user": "目标用户群体描述（30字以内）",
  "pain_points": "核心痛点，分点说明（100字以内）",
  "tags": ["标签1", "标签2", "标签3"]
}

规则：
- title 要简洁有吸引力
- description 要保留用户的所有关键信息和场景
- tags 选择 2-3 个最合适的分类标签，从以下类别中选择或自创合适的：生产力、AI、社交、健康、教育、生活方式、开发工具、职业发展、内容消费、社区、共享经济、远程办公、本地生活、心理健康、宠物、学习、协作、金融、游戏、音乐、旅行`;

export async function analyzeIdea(content: string): Promise<IdeaAnalysis | null> {
  if (!AI_API_KEY) return null;

  try {
    const response = await fetch(`${AI_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${AI_API_KEY}`,
      },
      body: JSON.stringify({
        model: AI_MODEL,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content },
        ],
        temperature: 0.7,
        max_tokens: 800,
        response_format: { type: 'json_object' },
      }),
    });

    if (!response.ok) {
      console.error('AI API error:', response.status, await response.text());
      return null;
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content;
    if (!text) return null;

    const parsed = JSON.parse(text);

    return {
      title: String(parsed.title || '').slice(0, 120),
      description: String(parsed.description || content).slice(0, 2000),
      target_user: String(parsed.target_user || ''),
      pain_points: String(parsed.pain_points || ''),
      tags: Array.isArray(parsed.tags) ? parsed.tags.slice(0, 5) : [],
    };
  } catch (err) {
    console.error('AI analysis failed:', err);
    return null;
  }
}
