import helper from "../config/jwtHelper";

export function generateRandomNumber(numLenght = 6) {
  const chars = [..."0123456789"];

  return [...Array(numLenght)]
    .map((i) => chars[(Math.random() * chars.length) | 0])
    .join("");
}

export function generateSecretToken() {
  const key = [...Array(30)]
    .map((n) => ((Math.random() * 36) | 0).toString(36))
    .join("");
  return key;
}

export function generateJwtToken(user) {
  const { _id, email, displayName } = user;
  const jwtAccessToken = helper.sign({
    _id,
    email,
    displayName,
  });

  return jwtAccessToken;
}
