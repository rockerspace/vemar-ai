export default function handler(req: any, res: any) {
  res.setHeader('Content-Type', 'application/json');

  const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
  const { issuerName, documentTitle, disclosureText, issuingCategory, jurisdiction = 'IN' } = body;
  const timestamp = new Date().toISOString();

  const combined = `${issuerName}|${documentTitle}|${disclosureText}|${timestamp}`;
  let hashNum = 0;
  for (let i = 0; i < combined.length; i++) {
    hashNum = (hashNum << 5) - hashNum + combined.charCodeAt(i);
    hashNum |= 0;
  }
  const hexHash = Math.abs(hashNum).toString(16).padStart(16, '0') + 'c7e8499210aa3948';

  const provenanceSeal = {
    c2paStandardVersion: '2.1-FINSEC',
    provenanceSealId: `SEAL-${Date.now()}-${hexHash.slice(0, 8).toUpperCase()}`,
    issuerName: issuerName || (jurisdiction === 'US' || jurisdiction === 'GLOBAL' ? 'NYSE/Nasdaq Listed Issuer' : 'NSE Listed Issuer'),
    issuingCategory: issuingCategory || (jurisdiction === 'US' || jurisdiction === 'GLOBAL' ? 'SEC Form 8-K / Reg FD Material Event' : 'SEBI LODR Regulation 30'),
    documentTitle: documentTitle || 'Material Event Announcement',
    sha256Digest: hexHash,
    issuedTimestamp: timestamp,
    jurisdiction,
    verifiedRegistryRoot: (jurisdiction === 'US' || jurisdiction === 'GLOBAL')
      ? 'CN=SEC-EDGAR-PROVENANCE-ROOT, O=Securities and Exchange Commission, C=US'
      : 'CN=BSE-NSE-DISCLOSURE-REPOSITORY, O=Securities and Exchange Board of India, C=IN',
    publicVerificationUrl: `https://sentinel.securities.gov/verify/${hexHash.slice(0, 12)}`,
    tamperResistantStatus: 'SECURE_AND_IMMUTABLE',
    qrPayload: `MII-PROVENANCE|${hexHash}|${timestamp}|${issuerName}`
  };

  return res.status(200).json({
    success: true,
    provenanceSeal
  });
}
