export class StringHelper {
  public static substring(text: string, character: string): string {
    return text.substring(0, text.indexOf(character));
  }

  public static replace(
    pattern: RegExp,
    original: string,
    destination: string
  ): string {
    return original.replace(pattern, destination);
  }

  public static replaces(
    patterns: RegExp[],
    original: string,
    destinations: string[]
  ): string {
    for (let i = 0; i < patterns.length; i++) {
      original = original.replace(patterns[i], destinations[i]);
    }

    return original;
  }
  public static isEmptyString(text: string): boolean {
    if (text === "<p></p>") return true;
    return text.trim().length === 0;
  }

  public static isUrl(text: string): boolean {
    if (!text) return false;
    const urlRegex = /https?:\/\/[^ \n]+/i;
    return urlRegex.test(text);
  }
}
