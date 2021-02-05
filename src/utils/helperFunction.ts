export function generateRandomNumber(numLenght = 4) {
  const chars = [..."0123456789"];

  return [...Array(numLenght)]
    .map((i) => chars[(Math.random() * chars.length) | 0])
    .join("");
}
