'use client'

import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Shield, Lock, Key, UserCheck } from 'lucide-react'

export default function AuthenticationPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Authentication System</h1>
          <p className="text-muted-foreground">
            User authentication and authorization in AFPI
          </p>
        </div>

        {/* Current Implementation */}
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-start gap-4">
            <Lock className="h-8 w-8 text-primary mt-1" />
            <div>
              <h2 className="text-xl font-semibold mb-3">Current Implementation (Development)</h2>
              <p className="text-muted-foreground mb-4">
                The current authentication system uses localStorage for session management with demo user accounts.
                This is suitable for development and testing but should be replaced with a production-ready solution.
              </p>
              
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold mb-2">Demo Users</h3>
                  <div className="space-y-2">
                    <div className="rounded-lg bg-muted/50 p-3 text-sm">
                      <div className="font-mono">admin@afpi.com</div>
                      <div className="text-muted-foreground">Role: Administrator • Full access</div>
                    </div>
                    <div className="rounded-lg bg-muted/50 p-3 text-sm">
                      <div className="font-mono">analyst@afpi.com</div>
                      <div className="text-muted-foreground">Role: Analyst • Read/write access</div>
                    </div>
                    <div className="rounded-lg bg-muted/50 p-3 text-sm">
                      <div className="font-mono">viewer@afpi.com</div>
                      <div className="text-muted-foreground">Role: Viewer • Read-only access</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Production Authentication */}
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-start gap-4">
            <Shield className="h-8 w-8 text-green-500 mt-1" />
            <div className="flex-1">
              <h2 className="text-xl font-semibold mb-3">Production Authentication (Planned)</h2>
              <p className="text-muted-foreground mb-4">
                For production deployment, implement one of these authentication strategies:
              </p>
              
              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h3 className="font-semibold text-blue-600 dark:text-blue-400 mb-1">Option 1: GCP Identity Platform</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Fully managed authentication with OAuth 2.0, SAML, and social providers
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                    <li>Native GCP integration</li>
                    <li>Built-in MFA support</li>
                    <li>User management dashboard</li>
                    <li>Automatic session handling</li>
                  </ul>
                </div>

                <div className="border-l-4 border-purple-500 pl-4">
                  <h3 className="font-semibold text-purple-600 dark:text-purple-400 mb-1">Option 2: Auth0 / Okta</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Third-party authentication platform with advanced features
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                    <li>Enterprise SSO support</li>
                    <li>Extensive customization</li>
                    <li>Detailed analytics</li>
                    <li>Easy integration</li>
                  </ul>
                </div>

                <div className="border-l-4 border-green-500 pl-4">
                  <h3 className="font-semibold text-green-600 dark:text-green-400 mb-1">Option 3: NextAuth.js + Cloud SQL</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Self-hosted authentication with full control
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                    <li>Open source and free</li>
                    <li>Database session storage</li>
                    <li>OAuth provider support</li>
                    <li>Flexible customization</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Authorization */}
        <div className="rounded-lg border bg-card p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <UserCheck className="h-6 w-6 text-primary" />
            Role-Based Access Control (RBAC)
          </h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Administrator</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Full platform access including user management, system configuration, and all data operations
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-green-500/10 text-green-600 dark:text-green-400 rounded text-xs">Full Access</span>
                <span className="px-2 py-1 bg-green-500/10 text-green-600 dark:text-green-400 rounded text-xs">User Management</span>
                <span className="px-2 py-1 bg-green-500/10 text-green-600 dark:text-green-400 rounded text-xs">Settings</span>
                <span className="px-2 py-1 bg-green-500/10 text-green-600 dark:text-green-400 rounded text-xs">AI Config</span>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Analyst</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Read and write access to data sources, agents, and reports. Can configure AI settings.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded text-xs">Read/Write Data</span>
                <span className="px-2 py-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded text-xs">Create Reports</span>
                <span className="px-2 py-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded text-xs">AI Assistant</span>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Viewer</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Read-only access to dashboards, reports, and analytics. Can use AI assistant for research.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-gray-500/10 text-gray-600 dark:text-gray-400 rounded text-xs">Read Only</span>
                <span className="px-2 py-1 bg-gray-500/10 text-gray-600 dark:text-gray-400 rounded text-xs">View Reports</span>
                <span className="px-2 py-1 bg-gray-500/10 text-gray-600 dark:text-gray-400 rounded text-xs">AI Research</span>
              </div>
            </div>
          </div>
        </div>

        {/* Security Best Practices */}
        <div className="rounded-lg border bg-card p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Key className="h-6 w-6 text-primary" />
            Security Best Practices
          </h2>
          
          <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
            <li>Use HTTPS for all authentication endpoints</li>
            <li>Implement JWT tokens with short expiration times (15 minutes)</li>
            <li>Store refresh tokens securely (httpOnly cookies)</li>
            <li>Enable multi-factor authentication (MFA) for production</li>
            <li>Implement rate limiting on login endpoints</li>
            <li>Log all authentication attempts for audit purposes</li>
            <li>Use secure password hashing (bcrypt with cost factor 12+)</li>
            <li>Implement account lockout after failed attempts</li>
          </ul>
        </div>

        {/* Documentation Reference */}
        <div className="rounded-lg border bg-muted/50 p-6">
          <h3 className="font-semibold mb-2">Detailed Documentation</h3>
          <code className="block bg-muted p-3 rounded text-sm">
            docs/AUTHENTICATION.md
          </code>
          <p className="text-sm text-muted-foreground mt-2">
            Contains implementation details, code examples, and migration guide from demo to production authentication.
          </p>
        </div>
      </div>
    </DashboardLayout>
  )
}
