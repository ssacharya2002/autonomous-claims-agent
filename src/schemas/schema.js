import { z } from "zod";

export const ClaimsSchema = z.object({
  policyNumber: z.string().optional(),
  policyholderName: z.string().optional(),
  effectiveDates: z.string().optional(),

  incidentDate: z.string().optional(),
  incidentTime: z.string().optional(),
  incidentLocation: z.string().optional(),
  incidentDescription: z.string().optional(),

  claimant: z.string().optional(),
  thirdParties: z.array(z.string()).optional(),
  contactDetails: z.record(z.string()).optional(),

  assetType: z.string().optional(),
  assetId: z.string().optional(),
  estimatedDamage: z.union([z.string(), z.number()]).optional(),

  claimType: z.string().optional(),
  attachments: z.array(z.string()).optional(),
  initialEstimate: z.union([z.string(), z.number()]).optional(),
});
