import { customAlphabet } from "nanoid";

export const generateUserCode = (): string => {
  const generate = customAlphabet(
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    10
  );
  return generate();
};