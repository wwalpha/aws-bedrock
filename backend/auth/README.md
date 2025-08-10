## Auth Service (NestJS)

AWS Cognito-backed authentication microservice.

### Requirements

- Node.js 22+
- Yarn
- AWS credentials with permission to use Cognito

### Configuration

Create `.env` at project root with:

```
AWS_REGION=us-east-1
COGNITO_CLIENT_ID=your_cognito_app_client_id
```

Optional fallbacks:

- Uses `AWS_DEFAULT_REGION` if `AWS_REGION` is not set

### Install

```
yarn install
```

### Run

```
# dev (watch)
yarn start:dev

# prod
yarn build && yarn start:prod
```

### Test

```
yarn test          # unit
yarn test:e2e      # e2e
yarn test:cov      # coverage
```

---


## API

Base path: `/auth`

| Method & Path            | Request Body                                      | 200 Response                                              | 400/401 Response                |
|-------------------------|---------------------------------------------------|-----------------------------------------------------------|---------------------------------|
| POST `/auth/login`      | `{ username: string, password: string }`           | `{ accessToken: string, idToken: string, refreshToken: string }` | 400: username/password missing<br>401: invalid credentials |
| POST `/auth/logout`     | `{ accessToken: string }`                          | `{ message: "Logged out" }`                               | 400: accessToken missing        |
| POST `/auth/signup`     | `{ username: string, password: string }` <br>※usernameはemail | `{ userConfirmed: boolean, userSub: string }`              | 400: email/password missing<br>400: client misconfig      |
| POST `/auth/confirmSignup` | `{ username: string, confirmationCode: string }` | `{ message: "Signup confirmed" }`                         | 400: fields missing             |

### Notes

- Cognito App Client ID is required via `COGNITO_CLIENT_ID`.
- `AWS_REGION` defaults to `us-east-1` if not provided.
