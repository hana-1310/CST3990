const fs = require('fs').promises
const path = require('path')
const { getLifestyleRecs } = require('../handler/get_recommendations')
const { getEmbedding } = require('./utils/embedding')
// calculates cosine similarity between two vectors
function cosineSimilarity(vecA, vecB) {
  const dotProduct = vecA.reduce((acc, val, i) => acc + val * vecB[i], 0);
  const magnitudeA = Math.sqrt(vecA.reduce((acc, val) => acc + val * val, 0))
  const magnitudeB = Math.sqrt(vecB.reduce((acc, val) => acc + val * val, 0))
  if (magnitudeA === 0 || magnitudeB === 0) return 0
  return dotProduct / (magnitudeA * magnitudeB)
}
// compares the generated recommendation to a list of reference recommendations
async function evaluateRecommendation(generatedText, referenceTexts) {
  const genEmbedding = (await getEmbedding([generatedText]))[0]
  const refEmbeddings = await Promise.all(referenceTexts.map(text => getEmbedding([text]).then(res => res[0])))
  const similarities = refEmbeddings.map(refEmb => cosineSimilarity(genEmbedding, refEmb))
  const maxSimilarity = Math.max(...similarities)
  const avgSimilarity = similarities.reduce((a, b) => a + b, 0) / similarities.length
  return { maxSimilarity, avgSimilarity, similarities }
}

async function main() {
  try {
    const filePath = path.join(__dirname, 'evaluation/sample_profiles.json')
    const data = await fs.readFile(filePath, 'utf-8')
    const profiles = JSON.parse(data)

    const results = []

    for (const profile of profiles) {
      console.log('\nEvaluating profile:', profile)

      const generatedRecs = await getLifestyleRecs(profile)
      // retrieve expected recommendation
      const referenceRecs = [profile.expectedRecommendation]
      // evaluation cosine
      const evalResult = await evaluateRecommendation(generatedRecs, referenceRecs)
      console.log('Generated Recommendations:', generatedRecs)
      console.log('Evaluation:', evalResult)

      results.push({
        profile,
        generatedRecs,
        evaluation: evalResult,
      });
    }
    const outputPath = path.join(__dirname, 'results/evaluation_results.json')
    await fs.writeFile(outputPath, JSON.stringify(results, null, 2), 'utf-8')
    console.log(`\nAll evaluation results saved to ${outputPath}`)

  } catch (err) {
    console.error('Error in evaluation:', err)
  }
}

main()
