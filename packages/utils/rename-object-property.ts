// TODO remove this file and instead just ignore the _id field

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

// TODO use those in projection db instead of the one above
export const renameIdWrite = (object: any) => renameObjectProperty(object, 'id', '_id');
export const renameIdRead = (object: any) => renameObjectProperty(object, '_id', 'id');
