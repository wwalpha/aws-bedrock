import { handler } from '../src/index';

describe('authorizer', () => {
  test('api key', async () => {
    const res = await handler({
      version: '2.0',
      type: 'REQUEST',
      routeArn: 'arn:aws:execute-api:ap-northeast-1:999999999999:fhuu62gt15/$default/GET/users/health',
      identitySource: [
        'eyJraWQiOiI5a3JCNHN5YlFqQ1ZCcm04bDhieFVCZFhhZ29LaGxPMWpHNUY1NFNMZWpvPSIsImFsZyI6IlJTMjU2In0.eyJhdF9oYXNoIjoiSjk2NEU1YjR4S3JHYVQ0dkZYQ1Z5USIsInN1YiI6ImNhYzFkNzMyLWEzNDctNGVmMC05NmIyLTkzM2NkMGNiYjk0MiIsImNvZ25pdG86Z3JvdXBzIjpbImFwLW5vcnRoZWFzdC0xX3huazVkUnlGMF9Hb29nbGUiXSwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAuYXAtbm9ydGhlYXN0LTEuYW1hem9uYXdzLmNvbVwvYXAtbm9ydGhlYXN0LTFfeG5rNWRSeUYwIiwiY29nbml0bzp1c2VybmFtZSI6Ikdvb2dsZV8xMDk0Mzk4MDUxMjgyODAwNjU3NzUiLCJub25jZSI6ImVQa1ZlQzlEV0RNNG1KZnJjVkt4cGp1UUlfWjN2NllrV0xTVXlIVTE4WDRHT2c0ZlprTzZROURFbHpDTDMtbnhrbHJwVHdaXzJubmlqQXh6ZkNrbTI4bDl1ZGZqUVMwVjAtV1Z2YnFGRnZxUHNqQUJJMGhzLVZ1bmQzTHpPdFFQaURxSm5yaDh5NFRySGJXWElHNExubkhLNmw2dFBFV1VwRkwtM2tPV01wQSIsIm9yaWdpbl9qdGkiOiJhOTk5NDc5Ni1lMjQ1LTRhZjYtODdiYi1kZWE1MzY2NjNiZDkiLCJhdWQiOiI1MDNsZXZlaWRjOTJkc3M4N2dmMWUzc205aSIsImlkZW50aXRpZXMiOlt7InVzZXJJZCI6IjEwOTQzOTgwNTEyODI4MDA2NTc3NSIsInByb3ZpZGVyTmFtZSI6Ikdvb2dsZSIsInByb3ZpZGVyVHlwZSI6Ikdvb2dsZSIsImlzc3VlciI6bnVsbCwicHJpbWFyeSI6InRydWUiLCJkYXRlQ3JlYXRlZCI6IjE2NDY3MzcwNzQwNjIifV0sInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNjQ4MTEyNjE5LCJleHAiOjE2NDgxMTYyMTksImlhdCI6MTY0ODExMjYxOSwianRpIjoiZmUxNzQwMTQtMDE3MS00ZjJmLWI3NjItMGE4MDMxMDY5NzFmIiwiZW1haWwiOiJjYXRrYW5oaUBnbWFpbC5jb20ifQ.h9sATuP9gbKOzudc12LpaeemgVr79WvpxAEJi8Y1z7_MjdxjjwdMQJVO2ZCTUCQeDntUNhqXpu01lEN2yY0f8h9192F5J0QfIx2H6LNYM9rjD5QxP8-VDb-qr-76lC9jVidP4qZRMuhGcmpllE8-DvbnKVslocMaafAH-3K5saDh2TtSCZBzpf06wU7eqVPKwAOl9hWtvcPJqi9Tu7xlrAlzvs1MOL3NTf1k3seG4RdioRTR2XD1WPdNt2rqWgnFncX0c9HpIrcs1k6R27q4rN9ydQagx4KRr-00QK2BuA4YT-Hik_POtSCCOQ8_iMEXdAF9-_48_ZvtCSeFHXsfFA',
      ],
      routeKey: 'GET /users/health',
      rawPath: '/users/health',
      rawQueryString: '',
      headers: {
        'accept-encoding': 'gzip, deflate',
        authorization:
          'eyJraWQiOiI5a3JCNHN5YlFqQ1ZCcm04bDhieFVCZFhhZ29LaGxPMWpHNUY1NFNMZWpvPSIsImFsZyI6IlJTMjU2In0.eyJhdF9oYXNoIjoiSjk2NEU1YjR4S3JHYVQ0dkZYQ1Z5USIsInN1YiI6ImNhYzFkNzMyLWEzNDctNGVmMC05NmIyLTkzM2NkMGNiYjk0MiIsImNvZ25pdG86Z3JvdXBzIjpbImFwLW5vcnRoZWFzdC0xX3huazVkUnlGMF9Hb29nbGUiXSwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAuYXAtbm9ydGhlYXN0LTEuYW1hem9uYXdzLmNvbVwvYXAtbm9ydGhlYXN0LTFfeG5rNWRSeUYwIiwiY29nbml0bzp1c2VybmFtZSI6Ikdvb2dsZV8xMDk0Mzk4MDUxMjgyODAwNjU3NzUiLCJub25jZSI6ImVQa1ZlQzlEV0RNNG1KZnJjVkt4cGp1UUlfWjN2NllrV0xTVXlIVTE4WDRHT2c0ZlprTzZROURFbHpDTDMtbnhrbHJwVHdaXzJubmlqQXh6ZkNrbTI4bDl1ZGZqUVMwVjAtV1Z2YnFGRnZxUHNqQUJJMGhzLVZ1bmQzTHpPdFFQaURxSm5yaDh5NFRySGJXWElHNExubkhLNmw2dFBFV1VwRkwtM2tPV01wQSIsIm9yaWdpbl9qdGkiOiJhOTk5NDc5Ni1lMjQ1LTRhZjYtODdiYi1kZWE1MzY2NjNiZDkiLCJhdWQiOiI1MDNsZXZlaWRjOTJkc3M4N2dmMWUzc205aSIsImlkZW50aXRpZXMiOlt7InVzZXJJZCI6IjEwOTQzOTgwNTEyODI4MDA2NTc3NSIsInByb3ZpZGVyTmFtZSI6Ikdvb2dsZSIsInByb3ZpZGVyVHlwZSI6Ikdvb2dsZSIsImlzc3VlciI6bnVsbCwicHJpbWFyeSI6InRydWUiLCJkYXRlQ3JlYXRlZCI6IjE2NDY3MzcwNzQwNjIifV0sInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNjQ4MTEyNjE5LCJleHAiOjE2NDgxMTYyMTksImlhdCI6MTY0ODExMjYxOSwianRpIjoiZmUxNzQwMTQtMDE3MS00ZjJmLWI3NjItMGE4MDMxMDY5NzFmIiwiZW1haWwiOiJjYXRrYW5oaUBnbWFpbC5jb20ifQ.h9sATuP9gbKOzudc12LpaeemgVr79WvpxAEJi8Y1z7_MjdxjjwdMQJVO2ZCTUCQeDntUNhqXpu01lEN2yY0f8h9192F5J0QfIx2H6LNYM9rjD5QxP8-VDb-qr-76lC9jVidP4qZRMuhGcmpllE8-DvbnKVslocMaafAH-3K5saDh2TtSCZBzpf06wU7eqVPKwAOl9hWtvcPJqi9Tu7xlrAlzvs1MOL3NTf1k3seG4RdioRTR2XD1WPdNt2rqWgnFncX0c9HpIrcs1k6R27q4rN9ydQagx4KRr-00QK2BuA4YT-Hik_POtSCCOQ8_iMEXdAF9-_48_ZvtCSeFHXsfFA',
        'content-length': '0',
        'content-type': 'application/json',
        host: 'api.pkc.onecloudlabo.com',
        'user-agent': 'vscode-restclient',
        'x-amzn-trace-id': 'Root=1-6247c2a7-5a3428164f59f387122aa3d4',
        'x-forwarded-for': '18.181.230.213',
        'x-forwarded-port': '443',
        'x-forwarded-proto': 'https',
      },
      requestContext: {
        accountId: '999999999999',
        apiId: 'fhuu62gt15',
        domainName: 'api.pkc.onecloudlabo.com',
        domainPrefix: 'api',
        http: {
          method: 'GET',
          path: '/users/health',
          protocol: 'HTTP/1.1',
          sourceIp: '18.181.230.213',
          userAgent: 'vscode-restclient',
        },
        requestId: 'P7taIgOBNjMEMvA=',
        routeKey: 'GET /users/health',
        stage: '$default',
        time: '02/Apr/2022:03:27:35 +0000',
        timeEpoch: 1648870055048,
      },
      cookies: [],
    });

    console.log(JSON.stringify(res));
  });
});
