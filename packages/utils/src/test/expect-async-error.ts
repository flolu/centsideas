export const expectAsyncError = async (check: Function, expectedError: any) => {
  let error;
  try {
    await check();
  } catch (e) {
    error = e;
  }
  expect(error).toEqual(expectedError);
};
export const expectNoAsyncError = async (check: Function) => {
  let error;
  try {
    await check();
  } catch (e) {
    error = e;
  }
  expect(error).toEqual(undefined);
};
