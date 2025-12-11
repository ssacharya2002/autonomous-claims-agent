export default function routeClaim(fields) {

  const mandatory = [
    "policyNumber", "policyholderName", "effectiveDates",
    "incidentDate", "incidentLocation", "incidentDescription",
    "claimType", "estimatedDamage"
  ];

  const missing = mandatory.filter(k => !fields[k]);

  // Rule: Mandatory fields missing → Manual Review
  if (missing.length) {
    return {
      missingFields: missing,
      route: "Manual Review",
      reason: `Missing fields: ${missing.join(", ")}`
    };
  }

  // Rule: Fraud keywords → Investigation
  const fraudWords = ["fraud", "inconsistent", "staged"];
  const desc = fields.incidentDescription?.toLowerCase() || "";

  if (fraudWords.some(w => desc.includes(w))) {
    return {
      missingFields: [],
      route: "Investigation",
      reason: "Fraud keyword detected"
    };
  }

  // Rule: Claim type = injury → Specialist Queue
  if (fields.claimType?.toLowerCase() === "injury") {
    return {
      missingFields: [],
      route: "Specialist Queue",
      reason: "Injury claim requires specialist review"
    };
  }

  // Rule: estimatedDamage < 25,000 → Fast-track
  let damage = null;
  if (fields.estimatedDamage) {
    // Handle string values like "$25,000" or "25000"
    const damageStr = String(fields.estimatedDamage).replace(/[^0-9.-]/g, "");
    damage = parseFloat(damageStr);
  }

  if (damage !== null && !isNaN(damage) && damage < 25000) {
    return {
      missingFields: [],
      route: "Fast-track",
      reason: "Damage < 25000"
    };
  }

  return {
    missingFields: [],
    route: "Standard Review",
    reason: "No special routes triggered"
  };
}
