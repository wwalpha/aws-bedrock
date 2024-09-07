import { APIGatewayAuthorizerResult, APIGatewayRequestAuthorizerEventV2 } from 'aws-lambda';
import { JwtPayload } from 'jsonwebtoken';
import winston from 'winston';
import omit from 'lodash/omit';
import { decodeToken, getPublicKeys, validateToken } from './utils';
import { ApiOptions, AuthPolicy } from './AuthPolicy';

const PEM_KEYS: Record<string, Record<string, string>> = {};
const API_KEYS: string[] = [];
const Logger = winston.createLogger({
  level: 'info',
  defaultMeta: { service: 'authorizer' },
  transports: [new winston.transports.Console()],
});

export const handler = async (event: APIGatewayRequestAuthorizerEventV2): Promise<APIGatewayAuthorizerResult> => {
  Logger.info('event', omit(event, ['identitySource', 'headers.authorization']));

  // authorizator token
  const identitySource: string = event.identitySource[0];

  try {
    const decodedToken = decodeToken(identitySource);

    const token = decodedToken;
    const payload = token.payload as JwtPayload;
    const iss = payload.iss;
    const kid = token.header.kid;

    // iss not exist
    if (!iss || !kid) {
      return authorizationFailure();
    }

    let pems: Record<string, string> | undefined = PEM_KEYS[iss];

    // not cached
    if (!pems) {
      // get public keys
      pems = await getPublicKeys(iss);
      // cache
      PEM_KEYS[iss] = pems;
    }

    // validate token
    validateToken(pems, identitySource);

    // principalId
    const principalId = payload['cognito:username'] as string;

    // policy
    const policy = buildAuthPolicy(event, principalId);

    policy.context = {
      username: principalId,
    };

    console.log(JSON.stringify(policy));

    return policy;
  } catch (err) {
    console.log(err);

    return authorizationFailure();
  }
};

/**
 * Build IAM Policy
 *
 * @param event event
 * @param userInfo user info
 * @returns
 */
const buildAuthPolicy = (
  event: APIGatewayRequestAuthorizerEventV2,
  principalId: string
): APIGatewayAuthorizerResult => {
  const apiOptions: ApiOptions = {};
  const infos = event.routeArn.split(':');
  const region = infos[3];
  const { accountId, apiId, stage } = event.requestContext;

  apiOptions.region = region;
  apiOptions.restApiId = apiId;
  apiOptions.stage = stage;

  const policy = new AuthPolicy(principalId, accountId, apiOptions);

  policy.allowAllMethods();

  return policy.build();
};

/**
 * Authorize failure
 * @returns
 */
const authorizationFailure = (): APIGatewayAuthorizerResult => {
  const policy = new AuthPolicy('*', '*');
  policy.denyAllMethods();

  return policy.build();
};
