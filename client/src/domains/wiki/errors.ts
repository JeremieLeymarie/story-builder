export class WikiCategoryNameTaken extends Error {
  constructor(wikiKey: string, name: string) {
    super(`Category name [${name}] already taken for wiki ${wikiKey}`);
  }
}
