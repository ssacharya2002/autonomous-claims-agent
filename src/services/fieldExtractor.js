import { generateObject } from "ai";
import { groq } from "@ai-sdk/groq";
import { ClaimsSchema } from "../schemas/schema.js";

export default async function extractFields(text) {
  if (!process.env.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY environment variable is not set");
  }

  const prompt = `
Extract these FNOL fields and return ONLY valid JSON:

{
  "policyNumber": "",
  "policyholderName": "",
  "effectiveDates": "", (Extract the insurance coverage period. If coverage dates are missing or the incident date is outside the coverage period, return an empty string.)
  "incidentDate": "",
  "incidentTime": "",
  "incidentLocation": "",
  "incidentDescription": "",
  "claimant": "",
  "thirdParties": [],
  "contactDetails": {},(name, phone, email)
  "assetType": "",
  "assetId": "",
  "estimatedDamage": "",
  "claimType": "",
  "attachments": [],
  "initialEstimate": ""
}

Document content:
${text}
  `;

  try {
    const result = await generateObject({
      model: groq("openai/gpt-oss-120b"), 
      schema: ClaimsSchema,
      prompt,
    });

    return result.object; // already validated by Zod
  } catch (error) {
    console.error("Field extraction error:", error);
    throw new Error(`Failed to extract fields: ${error.message}`);
  }
}
