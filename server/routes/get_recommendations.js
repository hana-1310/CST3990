require('dotenv/config')
const { OpenAI } = require('openai')

const token = process.env.GITHUB_TOKEN

async function getLifestyleRecs(profile) {
  console.log('RECEIVED DATA', profile)
  const rules = `
    1. If eGFR < 60 → let them of the danger and recommend a nephrologist visit at the earliest
    2. If creatinine > 1.5 → suggest a low-protein diet.
    3. If potassium > 5.5 → avoid high-potassium foods (bananas, potatoes).
    4. Always recommend hydration and low sodium.
    5. Do not provide medication advice.
    `
  
  const prompt = `
You are a CKD lifestyle assistant. Your task is to provide general wellness and lifestyle suggestions informed by the user's health data and some predefined wellness rules. Avoid medical or diagnostic language.

Guidance rules:
- If eGFR < 60 → suggest that consulting a kidney specialist could be beneficial.
- If creatinine > 1.5 → recommend considering a diet that is lighter in protein-rich foods.
- If potassium > 5.5 → suggest reducing foods commonly high in potassium (e.g., bananas, potatoes).
- Always promote hydration and a low-sodium lifestyle.
- Do not mention or recommend any medications.

Patient context:
- Diagnosis status: ${profile.diagnosis}
- BMI: ${profile.BMI}
- eGFR: ${profile.GFR}
- Creatinine: ${profile.SerumCreatinine}
- Potassium: ${profile.SerumElectrolytesPotassium}
- Medical History: ${profile.comorbidities}
- Allergies: ${profile.allergies}

Provide clear, user-friendly suggestions for lifestyle habits that could support overall kidney wellness. Avoid medical terminology. Avoid any language that could be interpreted as medical advice.

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