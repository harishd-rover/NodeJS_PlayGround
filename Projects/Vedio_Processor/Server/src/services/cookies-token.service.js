export const AUTH_COOKIE = "posterAuth";

export function createToken(...args) {
  return args.join("_");
}

export function extractToken(token) {
  return token.split("_");
}
