const importLocationsApi = async (
  jsonURL: string,
): Promise<{ valid: boolean }> => {
  const res = await fetch(jsonURL);
  const success = res.status === 200;

  if (!success) {
    throw new Error(
      `Import code validation API failed with status code: ${res.status}`,
    );
  }
  return await res.json();
};

export default importLocationsApi;
