import { decode, verify, JwtPayload } from 'jsonwebtoken';
import jwkToPem from 'jwk-to-pem';
import axios from 'axios';

export const decodeToken = (token: string) => {
  // Fail if the token is not jwt
  const decodedJwt = decode(token, { complete: true });

  if (decodedJwt === null) {
    throw new Error('Not a valid JWT token');
  }

  return decodedJwt;
};

/**
 * Get public keys
 *
 * @param iss issuer
 * @returns
 */
export const getPublicKeys = async (iss: string): Promise<Record<string, string>> => {
  const url = iss + '/.well-known/jwks.json';
  const res = await axios.get(url);

  if (res.status !== 200) {
    throw new Error(`Failed to get public keys. ${url}`);
  }

  const keys = res.data['keys'];
  const pems: Record<string, string> = {};

  for (let i = 0; i < keys.length; i++) {
    // Convert each key to PEM
    const key_id = keys[i].kid;
    const modulus = keys[i].n;
    const exponent = keys[i].e;
    const key_type = keys[i].kty;
    const jwk = { kty: key_type, n: modulus, e: exponent };
    const pem = jwkToPem(jwk);

    pems[key_id] = pem;
  }

  return pems;
};

export const validateToken = (pems: Record<string, string>, token: string) => {
  // Fail if the token is not jwt
  const decodedJwt = decodeToken(token);
  const payload = decodedJwt.payload as JwtPayload;
  const iss = payload.iss;

  if (!decodedJwt) {
    throw new Error('Not a valid JWT token');
  }

  // Fail if token is not from your UserPool
  if (!iss) {
    throw new Error('Invalid issuer');
  }

  // Reject the jwt if it's not an 'Access Token'
  if (payload.token_use != 'id') {
    throw new Error('Not an access token');
  }

  // Get the kid from the token and retrieve corresponding PEM
  const kid = decodedJwt.header.kid;

  if (!kid || !pems[kid]) {
    throw new Error('Invalid access token');
  }

  // Verify the signature of the JWT token to ensure it's really coming from your User Pool
  verify(token, pems[kid], { issuer: iss });
};
