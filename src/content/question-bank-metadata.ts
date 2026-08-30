export const questionBankMetadata = {
  datasetVersion: '1.10.0',
  assetPath: 'generated/question-bank.1.10.0.json',
} as const

export function resolveQuestionBankUrl(baseUrl: string): string {
  const normalizedBaseUrl = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`
  return `${normalizedBaseUrl}${questionBankMetadata.assetPath}`
}
