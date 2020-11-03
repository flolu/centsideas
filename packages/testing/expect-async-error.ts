export async function expectAsyncError(check: () => Promise<any>, expectedError: any) {
  let error
  try {
    await check()
  } catch (e) {
    error = e
  }
  expect(error).toEqual(expectedError)
}
