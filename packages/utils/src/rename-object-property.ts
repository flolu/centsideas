export const renameObjectProperty = (object: any, from: string, to: string): any => {
  if (from === to) {
    return object;
  }
  if (object && object[from]) {
    object[to] = object[from];
    delete object[from];
  }
  return { ...object };
};
