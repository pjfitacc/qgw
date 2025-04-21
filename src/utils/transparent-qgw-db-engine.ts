export function toggleYesOrNO(boolean?: boolean): "Y" | "N" | undefined {
  if (boolean === undefined) return undefined;
  return boolean ? "Y" : "N";
}

export function toggleBinary(boolean?: boolean): "1" | "2" | undefined {
  if (boolean === undefined) return undefined;
  return boolean ? "1" : "2";
}
