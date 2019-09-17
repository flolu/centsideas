export const renameObjectProperty = <T = any>(object: T, from: string, to: string): T => {
  if (from === to) {
    return object;
  }
  if (object && object[from]) {
    object[to] = object[from];
    delete object[from];
  }
  return { ...object };
};
