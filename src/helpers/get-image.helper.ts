export const getImage = (path: string) => {
  return process.env.NEXT_PUBLIC_YULI_API_URL + "/api/file?path=" + path;
};
