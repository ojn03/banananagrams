function hasOnlyAllowedFields<T extends readonly string[]>(
  obj: unknown,
  allowedFields: T
): boolean {
  if (typeof obj !== "object" || obj === null) return false;

  const objKeys = Object.keys(obj);
  return objKeys.every((key) => allowedFields.includes(key));
}

export function isValidUser(maybeUser: unknown) {

  const allowedUserKeys = []

}
