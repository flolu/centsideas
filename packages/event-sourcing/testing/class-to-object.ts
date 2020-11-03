export const classToObject = (theClass: any) => {
  const obj = {}
  for (const x in theClass) {
    if (x === 'toJSON' || x === 'constructor') continue
    ;(obj as any)[x] = theClass[x]
  }
  // to remove undefined values
  return JSON.parse(JSON.stringify(obj, (k, v) => v ?? undefined))
}
