/**
 * TEST/BYPASS ONLY - DO NOT USE IN PRODUCTION
 * This file provides bypass credentials for local testing
 * 
 * Delete this file before deploying to production!
 */

export const TEST_ADMIN_CREDENTIALS = {
  email: 'admin@replylink.local',
  password: 'admin123',
  role: 'ADMIN'
}

export const TEST_USER_CREDENTIALS = {
  email: 'user@replylink.local',
  password: 'user123',
  role: 'USER'
}

/**
 * Verify if provided credentials are test bypass credentials
 * Returns the user object if valid, null otherwise
 */
export function verifyTestBypass(email: string, password: string) {
  if (email === TEST_ADMIN_CREDENTIALS.email && password === TEST_ADMIN_CREDENTIALS.password) {
    return {
      id: 'test-admin-user-001',
      email: TEST_ADMIN_CREDENTIALS.email,
      name: 'Test Admin',
      role: TEST_ADMIN_CREDENTIALS.role,
      isTestBypass: true
    }
  }

  if (email === TEST_USER_CREDENTIALS.email && password === TEST_USER_CREDENTIALS.password) {
    return {
      id: 'test-user-user-001',
      email: TEST_USER_CREDENTIALS.email,
      name: 'Test User',
      role: TEST_USER_CREDENTIALS.role,
      isTestBypass: true
    }
  }

  return null
}
