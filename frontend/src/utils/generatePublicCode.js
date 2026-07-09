export function generatePublicCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

  function block() {
    let result = "";

    for (let i = 0; i < 4; i++) {
      result += chars.charAt(
        Math.floor(Math.random() * chars.length)
      );
    }

    return result;
  }

  return `${block()}-${block()}-${block()}-${block()}`;
}