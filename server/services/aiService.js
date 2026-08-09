const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const analyzeResume = async (resumeText) => {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: {
      responseMimeType: "application/json",
    },
  });

  const prompt = `
You are an expert technical recruiter and resume reviewer.

Analyze the resume below and return a JSON object.

The JSON must follow exactly this structure:

{
  "score": 0,
  "summary": "",
  "strongSkills": [],
  "missingSkills": [],
  "improvements": [],
  "careerSuggestions": []
}

Rules:
- score must be a number between 0 and 100.
- summary must be a short professional summary.
- strongSkills must contain skills clearly present in the resume.
- missingSkills must contain useful skills that could improve the candidate's profile.
- improvements must contain practical resume improvements.
- careerSuggestions must contain suitable career/job roles.
- Return only JSON.
- Do not use markdown.
- Do not use code fences.

Resume:
${resumeText}
`;

  const result = await model.generateContent(prompt);

  const responseText = result.response.text();

  try {
    return JSON.parse(responseText);
  } catch (error) {
    console.error("AI JSON parsing failed:", responseText);
    throw new Error("AI returned an invalid JSON response");
  }
};

const matchResumeToJob = async (
  resumeText,
  jobDescription
) => {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: {
      responseMimeType: "application/json",
    },
  });

  const prompt = `
You are an expert technical recruiter.

Compare the candidate resume with the job description.

Return ONLY valid JSON using exactly this structure:

{
  "matchScore": 0,
  "summary": "",
  "matchingSkills": [],
  "missingSkills": [],
  "experienceMatch": "",
  "recommendations": [],
  "interviewTopics": []
}

Rules:
- matchScore must be between 0 and 100.
- matchingSkills should contain skills present in both resume and job description.
- missingSkills should contain important job skills missing from the resume.
- experienceMatch should briefly explain how well the candidate experience matches.
- recommendations should contain practical actions to improve the candidate's chances.
- interviewTopics should contain topics the candidate should prepare.
- Return only JSON.

RESUME:
${resumeText}

JOB DESCRIPTION:
${jobDescription}
`;

  const result = await model.generateContent(prompt);

  const responseText = result.response.text();

  try {
    return JSON.parse(responseText);
  } catch (error) {
    console.error(
      "Job match JSON parsing failed:",
      responseText
    );

    throw new Error(
      "AI returned an invalid job match response"
    );
  }
};

const generateResumeContent = async ({
  name,
  role,
  skills,
  experience,
  projects,
}) => {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: {
      responseMimeType: "application/json",
    },
  });

  const prompt = `
You are an expert ATS resume writer.

Create professional resume content for the candidate.

Return ONLY valid JSON with this exact structure:

{
  "professionalSummary": "",
  "technicalSkills": [],
  "experience": [],
  "projects": [],
  "keywords": []
}

Rules:
- Keep the content truthful to the provided information.
- Do not invent companies, job titles, dates or achievements.
- Make the professional summary ATS-friendly.
- Use strong action-oriented language.
- Experience should contain concise bullet points.
- Projects should contain concise bullet points.
- Keywords should contain relevant ATS keywords for the target role.

Candidate Name:
${name}

Target Role:
${role}

Skills:
${skills}

Experience:
${experience}

Projects:
${projects}
`;

  const result = await model.generateContent(prompt);

  const responseText = result.response.text();

  try {
    return JSON.parse(responseText);
  } catch (error) {
    console.error(
      "Resume builder JSON parsing failed:",
      responseText
    );

    throw new Error(
      "AI returned an invalid resume response"
    );
  }
};

module.exports = {
  analyzeResume,
  matchResumeToJob,
  generateResumeContent,
};