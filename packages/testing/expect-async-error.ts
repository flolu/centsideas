export async function expectAsyncError(check: () => Promise<any>, expectedError: any) {
  let error;
  try {
    await check();
  } catch (e) {
    error = e;
  }
  expect(error).toEqual(expectedError);
}

export async function expectNoAsyncError(check: () => Promise<any>) {
  let error;
  try {
    await check();
  } catch (e) {
    error = e;
  }

  // tslint:disable-next-line:no-console
  if (error) console.log('Received async error although expected no error: ', error);
  expect(error).toEqual(undefined);
}
