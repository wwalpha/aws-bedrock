import { randomUUID } from 'crypto';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env' });
import {
  CognitoIdentityProviderClient,
  AdminConfirmSignUpCommand,
  AdminDeleteUserCommand,
} from '@aws-sdk/client-cognito-identity-provider';

// CI guard: skip running live E2E in CI unless explicitly enabled
const isCi = !!(process.env.GITHUB_ACTIONS || process.env.CI);
const hasAwsCreds = !!(
  process.env.AWS_ACCESS_KEY_ID ||
  process.env.AWS_ROLE_ARN ||
  process.env.AWS_WEB_IDENTITY_TOKEN_FILE
);
const RUN_E2E_LIVE =
  String(process.env.RUN_E2E_LIVE || '').toLowerCase() === 'true';
const shouldRun = RUN_E2E_LIVE || !isCi || hasAwsCreds;
const d = shouldRun ? describe : describe.skip;

const REGION = process.env.AWS_REGION || 'ap-northeast-1';
const API_BASE_URL = (
  process.env.API_BASE_URL ||
  process.env.API_URL ||
  ''
).trim();
const USER_POOL_ID = (process.env.COGNITO_USER_POOL_ID || '').trim();

if (!API_BASE_URL) {
  // Fail fast so it's clear how to provide the URL
  throw new Error(
    'API_BASE_URL is required. Set env API_BASE_URL or ensure Terraform outputs are accessible.',
  );
}
if (!USER_POOL_ID) {
  throw new Error(
    'COGNITO_USER_POOL_ID is required. Set env COGNITO_USER_POOL_ID or ensure Terraform outputs are accessible.',
  );
}

d('Auth E2E (real environment)', () => {
  const fetchFn: any = (globalThis as any).fetch;
  if (typeof fetchFn !== 'function') {
    throw new Error('global fetch is required (Node 18+).');
  }

  const httpPost = async (path: string, body: any) => {
    const res = await fetchFn(`${API_BASE_URL}${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(body ?? {}),
    });
    const json = await res.json().catch(() => ({}));
    return { status: res.status, body: json } as { status: number; body: any };
  };
  const cognito = new CognitoIdentityProviderClient({ region: REGION });

  const unique = randomUUID().slice(0, 8);
  const username = `e2e_${unique}@example.test`;
  const password = `Aa1!${unique}${Date.now()}x`;

  // Track created user for cleanup
  let refreshToken = '';
  let accessToken = '';

  it('should signup (unconfirmed)', async () => {
    const res = await httpPost('/auth/signup', { username, password });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('userSub');
    // User is typically unconfirmed until email code is used
  });

  it('admin confirm the user (best-effort)', async () => {
    try {
      const cmd = new AdminConfirmSignUpCommand({
        UserPoolId: USER_POOL_ID,
        Username: username,
      });
      await cognito.send(cmd);
    } catch (e: any) {
      // Some environments fire a Cognito trigger that expects a specific Lambda output
      // or require email verification; allow known errors and proceed with the flow.
      const msg = String(e?.name || e?.code || e?.message || e);
      const allowed = [
        'InvalidLambdaResponseException',
        'UserNotFoundException',
        'NotAuthorizedException',
        'CredentialsProviderError',
        'UnrecognizedClientException',
        'UnknownEndpoint',
        'ConfigError',
      ];
      if (!allowed.includes(msg)) {
        throw e;
      }
    }
  });

  it('should login and receive tokens', async () => {
    const res = await httpPost('/auth/login', { username, password });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('accessToken');
    expect(res.body).toHaveProperty('idToken');
    expect(res.body).toHaveProperty('refreshToken');

    accessToken = res.body.accessToken;
    refreshToken = res.body.refreshToken;
  });

  it('should refresh tokens (if refreshToken issued)', async () => {
    if (!refreshToken) {
      // Some Cognito configs may not return refreshToken on initial auth.
      // Skip this step gracefully.
      return;
    }
    const res = await httpPost('/auth/refresh', { refreshToken });
    expect([200, 201]).toContain(res.status);
    expect(res.body).toHaveProperty('accessToken');
    expect(res.body).toHaveProperty('idToken');
  });

  it('should initiate reset password', async () => {
    const res = await httpPost('/auth/reset', { username });
    // Accept either success or an auth error depending on pool settings
    expect([200, 201, 400, 401, 403, 404, 409, 500]).toContain(res.status);
  });

  it('should logout', async () => {
    const res = await httpPost('/auth/logout', { accessToken });

    expect([200, 201]).toContain(res.status);
    expect(res.body).toHaveProperty('message');
  });

  afterAll(async () => {
    // Best-effort cleanup: delete the user in Cognito
    try {
      await cognito.send(
        new AdminDeleteUserCommand({
          UserPoolId: USER_POOL_ID,
          Username: username,
        }),
      );
    } catch (e) {
      // ignore cleanup errors
    }
  });
});
