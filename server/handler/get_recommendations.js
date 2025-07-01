require('dotenv/config')
const { OpenAI } = require('openai')

const token = process.env.GITHUB_TOKEN

async function getLifestyleRecs(profile) {
  console.log('RECEIVED DATA', profile)
  const rules = {
  "eGFR < 60": "Suggest seeing a kidney specialist, convey the seriousness of the situation",
  "Serum Creatinine > 1.5": "Recommend low-protein diet, for instance Mediteranean Diet",
  "Potassium > 5.5": "Advise reducing high-potassium foods such as bananas",
  "Hydration & sodium": "Encourage hydration and a low-sodium diet",
  "BMI > 30": "Encourage increased physical activity",
  "ACR > 30": "Lose weight",
  "Hemoglobin < 12": "Suggest iron intake",
  "Muscle Cramps > 1 episodes/week": "Promote hydration and evaluate electrolyte levels"
}
  const prompt = `
You are a CKD lifestyle assistant. Your task is to provide general wellness and 
lifestyle suggestions informed by the user's health data and some predefined wellness rules. Avoid medical or diagnostic language.

Guidance rules:
- ${Object.values(rules).join("\n- ")}

Patient context:
- Diagnosis status: ${profile.diagnosis}
- BMI: ${profile.BMI}
- eGFR: ${profile.GFR}
- Serum Creatinine: ${profile.SerumCreatinine}
- Potassium: ${profile.SerumElectrolytesPotassium}
- Albumin Ratio: ${profile.ACR}
- Muscle Cramps (weekly episodes): ${profile.MuscleCramps}
- Hemoglobin: ${profile.HemoglobinLevels}
- Medical History: ${profile.comorbidities}
- Allergies: ${profile.allergies}

Provide clear, user-friendly suggestions for lifestyle habits that 
could support overall kidney wellness. Avoid medical terminology. 
Avoid any language that could be interpreted as medical advice.

The above rules should only be applied if the diagnosis status is positive.
If the status is negative, then provide general wellness advice on hydration
and suggest to the user to conduct these yearly CKD checks.

Close the response with: "This is for general wellness guidance only."
`

  const client = new OpenAI({
      baseURL: "https://models.github.ai/inference",
      apiKey: token
    });
  
  const response = await client.chat.completions.create({
    messages: [
      { role: "system", content: "" },
      { role: "user", content: prompt }
    ],
    model: "openai/gpt-4o",
    temperature: 1,
    max_tokens: 4096,
    top_p: 1
  });
  
  const recommendations = response.choices[0].message.content
  console.log('FIRSt ', recommendations)
  return recommendations
}

module.exports = {getLifestyleRecs}