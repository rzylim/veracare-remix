export async function simulateFetch<T>(returnData: T): Promise<T> {
  return new Promise((resolve) =>
    // fake loading of data.
    setTimeout(() => {
      resolve(returnData);
    }, 1000)
  );
}
