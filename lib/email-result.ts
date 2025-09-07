// Email result types and utilities
export interface EmailResult {
  success: boolean
  message: string
  messageId?: string
  assessmentLink?: string
  isDemo?: boolean
  requiresManualSharing?: boolean
  emailError?: string
  error?: string
}

export const emailResult = {
  success: (message: string, messageId?: string, assessmentLink?: string): EmailResult => ({
    success: true,
    message,
    messageId,
    assessmentLink,
  }),

  demo: (message: string, assessmentLink: string): EmailResult => ({
    success: true,
    message,
    assessmentLink,
    isDemo: true,
    requiresManualSharing: true,
    messageId: `demo_${Date.now()}`,
  }),

  error: (message: string, assessmentLink?: string): EmailResult => ({
    success: false,
    message,
    assessmentLink,
    error: message,
  }),
}
