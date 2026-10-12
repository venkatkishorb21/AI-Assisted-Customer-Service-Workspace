import { SupportCase, AiSuggestionData } from '../types';

/**
 * Deterministic AI Engine for OnGround CallOps
 * Uses rule-based heuristics, sentiment analysis keywords, customer tiering,
 * and category playbooks to generate transparent call-centre guidance.
 */
export function generateAiSuggestions(caseItem: Partial<SupportCase>): AiSuggestionData {
  const category = caseItem.category || 'Technical & API Outage';
  const priority = caseItem.priority || 'Medium';
  const customerTier = caseItem.customer?.tier || 'Growth Corporate';
  const customerName = caseItem.customer?.name || 'Customer';
  const companyName = caseItem.customer?.company || 'their organization';
  const transcript = caseItem.transcript || [];
  
  const allText = transcript.map(m => m.text.toLowerCase()).join(' ') + ' ' + (caseItem.title || '').toLowerCase();

  // Keyword flags
  const hasCancellation = allText.includes('cancel') || allText.includes('terminate') || allText.includes('churn') || allText.includes('switch');
  const hasLegalOrEscalation = allText.includes('legal') || allText.includes('lawyer') || allText.includes('sue') || allText.includes('executive') || allText.includes('vp');
  const hasOutage = allText.includes('outage') || allText.includes('down') || allText.includes('offline') || allText.includes('production') || allText.includes('crash');
  const hasBillingDispute = allText.includes('charge') || allText.includes('refund') || allText.includes('invoice') || allText.includes('overcharge') || allText.includes('double');
  const hasHardwareIssue = allText.includes('device') || allText.includes('sensor') || allText.includes('telematics') || allText.includes('gps') || allText.includes('signal');
  const hasUrgency = allText.includes('urgent') || allText.includes('asap') || allText.includes('emergency') || allText.includes('immediately');

  let sentiment: AiSuggestionData['sentiment'] = 'Neutral';
  let escalationRisk: AiSuggestionData['escalationRisk'] = 'Low';
  let escalationTriggerReason = 'Routine issue within standard operating parameters.';
  let confidenceScore = 91;

  if (hasLegalOrEscalation || (hasCancellation && customerTier === 'Enterprise VIP')) {
    sentiment = 'Frustrated / Urgent';
    escalationRisk = 'High';
    escalationTriggerReason = 'Detected high-churn risk keywords & Enterprise tier contractual impact.';
    confidenceScore = 97;
  } else if (hasCancellation || hasOutage || priority === 'Critical') {
    sentiment = 'Frustrated / Urgent';
    escalationRisk = 'High';
    escalationTriggerReason = 'High severity impact: Service disruption or explicit churn indicator flagged.';
    confidenceScore = 94;
  } else if (hasBillingDispute || hasHardwareIssue || hasUrgency || priority === 'High') {
    sentiment = 'Dissatisfied';
    escalationRisk = 'Moderate';
    escalationTriggerReason = 'Dispute or hardware anomaly detected; requires supervisor authorization or expedited triage.';
    confidenceScore = 89;
  } else if (allText.includes('thank') || allText.includes('helpful') || allText.includes('great')) {
    sentiment = 'Pleased';
    escalationRisk = 'Low';
    escalationTriggerReason = 'Positive engagement detected. Standard resolution trajectory.';
    confidenceScore = 96;
  } else {
    sentiment = 'Inquiring';
    escalationRisk = 'Low';
    escalationTriggerReason = 'Standard query pattern adhering to normal SLA timelines.';
    confidenceScore = 92;
  }

  // Generate category-specific guidance
  let summary = '';
  let keyConcerns: string[] = [];
  let suggestedResponse = '';
  let recommendedAction = '';
  let explanation = '';
  let applicablePolicy = 'SOP-GENERAL-101';

  switch (category) {
    case 'Billing & Invoicing':
      summary = `Customer ${customerName} from ${companyName} reported discrepancies on their latest invoice cycle. They request an audited reconciliation and potential credit adjustment.`;
      keyConcerns = [
        'Disputed line-item pricing vs contractual quote',
        'Automatic billing charge reversal requested',
        'Risk of delayed account settlement'
      ];
      suggestedResponse = `"Hello ${customerName}, thank you for bringing this billing discrepancy to our attention. I am pulling up your contractual rate card for ${companyName} right now. I can freeze automatic recurring debits for 7 business days while our finance team reviews the variance, and apply an instant credit for any confirmed overages."`;
      recommendedAction = 'Verify contract billing tier, issue temporary hold on auto-pay, and route credit adjustment token (up to $500 max limit).';
      explanation = 'Rule BILLING_VARIANCE_DISPUTE triggered: Customer identified unexpected fee jump. Immediate transparency prevents formal dispute filing.';
      applicablePolicy = 'SOP-FIN-204 (Enterprise Billing Reconciliation & Instant Credit Limit)';
      break;

    case 'Technical & API Outage':
      summary = `${companyName} is experiencing unexpected webhook latency and intermittent HTTP 504 Gateway Timeouts impacting their live dispatch operations.`;
      keyConcerns = [
        'Webhook callback delivery dropped by 38%',
        'Real-time field worker telemetry delayed',
        'SLA uptime threshold risk'
      ];
      suggestedResponse = `"Hi ${customerName}, our Site Reliability Engineering (SRE) team is actively investigating degraded performance in the US-East gateway cluster. I have flagged your account (${companyName}) with high-priority failover routing and will provide live updates every 15 minutes."`;
      recommendedAction = 'Engage Tier 2 SRE incident bridge, activate alternate endpoint routing, and tag ticket with Master Incident #INC-4481.';
      explanation = 'Rule API_SLA_BREACH_ALERT: Production traffic affected for critical customer. Immediate failover coordination required to preserve 99.9% uptime commitments.';
      applicablePolicy = 'SOP-TECH-302 (P1 Incident Escalation & SRE Failover Protocol)';
      break;

    case 'Hardware & Telematics':
      summary = `Hardware diagnostics indicate loss of heartbeat telemetry on 4 in-vehicle OnGround telematics units for ${companyName}'s logistics fleet.`;
      keyConcerns = [
        'Firmware sync failure on v3.2.1 devices',
        'Lost GPS real-time breadcrumb tracking',
        'Physical unit replacement or remote reboot needed'
      ];
      suggestedResponse = `"Hi ${customerName}, I have initiated an Over-The-Air (OTA) hard diagnostic reboot for the 4 offline telematics serials. If telemetry does not restore in 8 minutes, I will immediately dispatch expedited replacement units with pre-configured SIM profiles."`;
      recommendedAction = 'Execute OTA command packet #9928, confirm satellite uplink, and prepare RMA exchange kit if reboot fails.';
      explanation = 'Rule TELEMATICS_HEARTBEAT_LOSS: Loss of telemetry directly impacts field driver safety and cargo monitoring regulations.';
      applicablePolicy = 'SOP-HW-410 (Field Device Diagnostics & Expedited RMA Fulfillment)';
      break;

    case 'Account & Access':
      summary = `Administrator user locked out after Multi-Factor Authentication (MFA) reset request following phone number migration.`;
      keyConcerns = [
        'Blocked access for organizational workspace owner',
        'Urgent password & TOTP recovery needed',
        'Identity verification compliance'
      ];
      suggestedResponse = `"Hello ${customerName}, I understand you need immediate access restored to manage your team. For security compliance, I have generated a one-time secure verification link sent to your registered corporate email."`;
      recommendedAction = 'Complete secondary knowledge-based verification (KBV), invalidate previous authenticator sessions, and generate 1-hour bypass token.';
      explanation = 'Rule ACCESS_RECOVERY_SEC: Fast recovery without compromising SOC2 identity proofing standards.';
      applicablePolicy = 'SOP-SEC-105 (Secure MFA De-provisioning & Identity Challenge)';
      break;

    case 'On-Ground Logistics':
      summary = `Dispatch route reroute failure during peak hour delivery schedule in metropolitan sector. Field operators unable to mark job completion.`;
      keyConcerns = [
        'Offline mobile sync for 12 field agents',
        'Customer delivery ETA deviation exceeding 45 minutes',
        'Manual override needed on dispatch portal'
      ];
      suggestedResponse = `"Hi ${customerName}, I have manually bypassed the geofence validation for the 12 pending shipments in your dispatch queue. Your drivers can now mark deliveries complete via the fallback offline code 7741."`;
      recommendedAction = 'Broadcast fallback sync token to field drivers, enable geofence manual override, and notify district logistics supervisor.';
      explanation = 'Rule LOGISTICS_DISPATCH_FREEZE: Driver delay propagates to SLA penalties; manual override clears immediate bottleneck.';
      applicablePolicy = 'SOP-OPS-501 (Field Dispatch Exception & Geofence Override)';
      break;

    case 'Service Cancellation':
      summary = `Customer indicated consideration of competitor platform due to pricing and missing enterprise reporting features.`;
      keyConcerns = [
        'High value churn risk for ${customerTier} account',
        'Dissatisfaction with contract price-to-feature ratio',
        'Requires customer success executive intervention'
      ];
      suggestedResponse = `"Dear ${customerName}, we value ${companyName}'s partnership tremendously and want to ensure our platform delivers 10x value for your operations. Before making any decisions, I would like to schedule a 15-minute call with our Principal Solution Architect to review our upcoming Q4 enterprise reporting release and discuss a loyalty pricing grandfather clause."`;
      recommendedAction = 'Offer immediate 20% loyalty retention concession and book urgent consultation with Dedicated Customer Success Manager within 2 hours.';
      explanation = 'Rule RETENTION_URGENT_INTERVENE: Immediate empathetic outreach with executive access significantly decreases enterprise churn rates.';
      applicablePolicy = 'SOP-RET-901 (Enterprise Customer Retention & Concession Matrix)';
      break;

    default:
      summary = `General support inquiry from ${customerName}. Issue undergoing investigation.`;
      keyConcerns = ['Standard service inquiry', 'Follow-up timeline request'];
      suggestedResponse = `"Hello ${customerName}, thank you for contacting OnGround CallOps support. I am reviewing the details of your inquiry and will guide you step by step to a complete resolution."`;
      recommendedAction = 'Log customer requirements, document internal ticket trail, and provide estimated resolution timeframe.';
      explanation = 'Standard support inquiry operating under standard baseline SLA.';
      applicablePolicy = 'SOP-GEN-101 (Standard Operating Procedure)';
      break;
  }

  return {
    summary,
    keyConcerns,
    sentiment,
    escalationRisk,
    escalationTriggerReason,
    suggestedResponse,
    recommendedAction,
    explanation,
    confidenceScore,
    applicablePolicy
  };
}
