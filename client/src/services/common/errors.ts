class ImportError extends Error {}

export class KeyNotFoundError extends ImportError {
  constructor(keyField: string, objectType: string, objectKey: string) {
    super(
      `${keyField} not found in old key to new key mapping, for ${objectType} [${objectKey}]`,
    );
  }
}
