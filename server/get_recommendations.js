require('dotenv/config')
const { OpenAI } = require('openai')

const token = process.env.GITHUB_TOKEN

async function getLifestyleRecs(profile) {
  console.log('RECEIVED DATA', profile)
  const rules = `
    1. If eGFR < 60 → alert them of the danger and recommend a nephrologist visit at the earliest
    2. If creatinine > 1.5 → suggest a low-protein diet.
    3. If potassium > 5.5 → avoid high-potassium foods (bananas, potatoes).
    4. Always recommend hydration and low sodium.
    5. Do not provide medication advice.
    `
  
  const prompt = `
  After having been provided a diagnosis by our website (CKD positive or not), 
  there is an aspect of lifestyle recommendations to be presented to the user.
  Here you will a CKD lifestyle assistant. Follow ONLY the medical rules below.
  For example give ideas of diets they can incorporate in their lifestyle. 
  Also start the response with the diagnosis provided by the system. 
  
  Rules:
  ${rules}
  
  Patient data:
  - Diagnosis: ${profile.diagnosis}
  - BMI: ${profile.BMI}
  - eGFR: ${profile.GFR}
  - Creatinine: ${profile.SerumCreatinine}
  - Potassium: ${profile.SerumElectrolytesPotassium}
  - Medical History: ${profile.comorbidities}
  - Allergies: ${profile.allergies}
  
  Generate clear, friendly lifestyle advice based on the rules above.
  Explain how this can help slow the progression of the disease in simple terms.
  End with: "This is not medical advice."
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