import argon2 from "argon2";

export const hashSecret = async (secret: string): Promise<string> => {
  const hashedSecret = await argon2.hash(secret, {
    type: argon2.argon2id,
    memoryCost: 19456,
    timeCost: 2,
    parallelism: 1,
  });
  return hashedSecret;
};

export const matchSecret = async (
  hashedSecret: string,
  secret: string,
): Promise<boolean> => {
  return await argon2.verify(hashedSecret, secret);
};
