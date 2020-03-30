export const expectAsyncError = async (check: () => any, expectedError: any) => {
  let error;
  try {
    await check();
  } catch (e) {
    error = e;
  }
  expect(error).toEqual(expectedError);
};
export const expectNoAsyncError = async (check: () => any) => {
  let error;
  try {
    await check();
  } catch (e) {
    error = e;
  }
  expect(error).toEqual(undefined);
};
