/*
 * Query parameter are typed as string | string[]
 * Converts a string or string array to a string array.
 */
const toArray = (
  value: string | string[] | undefined,
  defaultValue: string[]
): string[] => {
  let result: string[] = [];

  if (!value || value.length === 0) {
    result = defaultValue;
  } else {
    result = Array.isArray(value) ? value : [value];
  }

  return result;
};

export default toArray;
