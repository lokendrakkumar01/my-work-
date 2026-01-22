const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Generate AI content using Gemini
 */
const generateContent = async (prompt) => {
      try {
            const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
            const result = await model.generateContent(prompt);
            const response = await result.response;
            return response.text();
      } catch (error) {
            console.error('AI generation error:', error);
            throw new Error('Failed to generate AI content');
      }
};

/**
 * Generate social media caption
 */
const generateCaption = async (context, platform, language = 'en', tone = 'professional') => {
      const languageMap = {
            'en': 'English',
            'hi': 'Hindi',
            'en-hi': 'Hinglish (mix of English and Hindi)'
      };

      const prompt = `
Generate an engaging ${platform} post caption in ${languageMap[language]}.

Context: ${context}
Tone: ${tone}
Platform: ${platform}

Requirements:
- Make it engaging and authentic
- Include relevant emojis
- Keep it concise for ${platform}
- ${platform === 'twitter' ? 'Keep under 280 characters' : ''}
- ${platform === 'linkedin' ? 'Professional yet personable' : ''}
- ${platform === 'instagram' ? 'Visual and lifestyle-focused' : ''}

Generate ONLY the caption text, no explanations.
  `;

      return await generateContent(prompt);
};

/**
 * Generate YouTube script
 */
const generateYouTubeScript = async (topic, duration = 10, style = 'educational') => {
      const prompt = `
Create a complete YouTube video script for a ${duration}-minute video.

Topic: ${topic}
Style: ${style}
Duration: ${duration} minutes

Format the script with:
1. Hook (first 10 seconds)
2. Introduction
3. Main content with clear sections
4. Call to action
5. Outro

Include:
- Timestamps for chapters
- Estimated speaking time for each section
- Suggestions for visuals
- Clear transition phrases

Make it engaging, informative, and optimized for viewer retention.
  `;

      return await generateContent(prompt);
};

/**
 * Generate content ideas
 */
const generateContentIdeas = async (niche, platform, count = 10) => {
      const prompt = `
Generate ${count} creative content ideas for ${platform}.

Niche: ${niche}

For each idea, provide:
1. Catchy title
2. Brief description
3. Why it would perform well
4. Target audience

Format as a numbered list.
Make ideas trending, engaging, and actionable.
  `;

      return await generateContent(prompt);
};

/**
 * Generate hashtags
 */
const generateHashtags = async (content, platform, count = 20) => {
      const prompt = `
Generate ${count} relevant hashtags for this ${platform} post:

Content: ${content}

Requirements:
- Mix of popular and niche hashtags
- Relevant to the content
- Platform-appropriate
- Include trending tags if relevant

Return ONLY the hashtags separated by spaces, like: #hashtag1 #hashtag2 #hashtag3
  `;

      return await generateContent(prompt);
};

/**
 * Generate productivity plan
 */
const generateProductivityPlan = async (userGoals, timeframe = 'week') => {
      const prompt = `
Create a detailed productivity plan for the next ${timeframe}.

User Goals: ${userGoals}

Include:
1. Daily breakdown of tasks
2. Time allocation for each task
3. Priority levels
4. Focus time blocks
5. Break times
6. Success metrics

Make it realistic and actionable.
  `;

      return await generateContent(prompt);
};

/**
 * Analyze performance and suggest improvements
 */
const analyzePerformance = async (data) => {
      const prompt = `
Analyze this performance data and provide actionable insights:

${JSON.stringify(data, null, 2)}

Provide:
1. Key insights
2. Areas of improvement
3. Specific recommendations
4. Next best actions

Be specific and data-driven.
  `;

      return await generateContent(prompt);
};

/**
 * Generate learning roadmap
 */
const generateLearningRoadmap = async (skill, currentLevel = 'beginner', duration = '3 months') => {
      const prompt = `
Create a comprehensive learning roadmap to master: ${skill}

Current Level: ${currentLevel}
Timeframe: ${duration}

Include:
1. Weekly breakdown
2. Resources (courses, books, projects)
3. Milestones
4. Practice projects
5. Assessment criteria

Make it structured and achievable.
  `;

      return await generateContent(prompt);
};

module.exports = {
      generateContent,
      generateCaption,
      generateYouTubeScript,
      generateContentIdeas,
      generateHashtags,
      generateProductivityPlan,
      analyzePerformance,
      generateLearningRoadmap
};
