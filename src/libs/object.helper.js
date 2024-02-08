export const haveEmptyFields = (obj) => {
  return Object.values(obj).some((v) => {
    if (typeof v === "boolean") return false;
    if (typeof v === "number") return false;
    return !v || v.trim() === "";
  });
};
