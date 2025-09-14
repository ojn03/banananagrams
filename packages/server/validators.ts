import { isValidObjectId } from "mongoose";

function validateObject<T extends Record<string, unknown>>(
  obj: unknown,
  validators: { [K in keyof T]: (val: unknown) => T[K] }
): T {
  if (typeof obj !== "object" || obj === null) {
    throw new Error("Expected object, got " + typeof obj);
  }

  const allowedFields = Object.keys(validators);
  const input = obj as Record<string, unknown>;

  // Check for extra fields
  const extraFields = Object.keys(input).filter(
    (key) => !allowedFields.includes(key)
  );
  if (extraFields.length > 0) {
    throw new Error(
      `Unexpected fields: ${extraFields.join(
        ", "
      )}. Allowed: ${allowedFields.join(", ")}`
    );
  }

  // Check for missing required fields and validate
  const result = {} as T;
  for (const [key, validator] of Object.entries(validators)) {
    try {
      result[key as keyof T] = validator(input[key]);
    } catch (error) {
      throw new Error(
        `Field '${key}': ${error instanceof Error ? error.message : error}`
      );
    }
  }

  return result;
}

export function isValidOIDString(val: unknown): string {
  if (typeof val === "string" && isValidObjectId(val)) {
    return val;
  }

  throw new Error("invalid object id string: " + val);
}

export function isString(val: unknown): string {
  if (typeof val === "string" && val.length >= 1) {
    return val;
  }
  throw new Error("invalid or empty string: " + val);
}

export function validateAddUserToRoomInput(val: unknown) {
  return validateObject<{ roomCode: string; userId: string }>(val, {
    roomCode: isString,
    userId: isValidOIDString,
  });
}

export function validateCreateRoomInput(val: unknown) {
  return validateObject<{ roomName: string; userId: string }>(val, {
    roomName: isString,
    userId: isValidOIDString,
  });
}

export function validateDumpInput(val: unknown) {
  return validateObject<{ roomCode: string; letter: string }>(val, {
    roomCode: isString,
    letter: isString,
  });
}
