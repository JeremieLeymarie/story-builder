import { beforeEach, describe, expect, test, vi } from "vitest";
import {
  _getDexieWikiRepository,
  WikiRepositoryPort,
} from "../wiki-repository";
import { getTestDatabase, TEST_USER } from "@/lib/storage/dexie/test-db";
import { DexieDatabase } from "@/lib/storage/dexie/dexie-db";
import { Factory, getTestFactory } from "@/lib/testing/factory";
import { WikiSection } from "../types";

const DATE = new Date();

describe("wiki repository", () => {
  let repo: WikiRepositoryPort;
  let testDB: DexieDatabase;
  let factory: Factory;

  beforeEach(async () => {
    testDB = await getTestDatabase();
    repo = _getDexieWikiRepository(testDB);
    factory = getTestFactory();
  });

  describe("get user wikis", () => {
    test("should get all wikis of specified user", async () => {
      const wiki1 = factory.wiki({
        author: { username: TEST_USER.username, key: TEST_USER.key },
        type: "created",
      });
      const wiki2 = factory.wiki({ author: undefined, type: "created" });
      const wiki3 = factory.wiki({
        // Other author
        author: {
          username: "peter_peter",
          key: "peter-peter",
        },
        type: "created",
      });
      const wiki4 = factory.wiki({
        // Imported
        author: { username: TEST_USER.username, key: TEST_USER.key },
        type: "imported",
      });

      const key1 = await testDB.wikis.add(wiki1);
      const key2 = await testDB.wikis.add(wiki2);
      await testDB.wikis.add(wiki3);
      await testDB.wikis.add(wiki4);

      const wikis = await repo.getUserWikis(TEST_USER.key);
      const keys = wikis.map(({ key }) => key);
      expect(wikis).toHaveLength(2);
      expect(keys).toContain(key1);
      expect(keys).toContain(key2);
    });

    test("should get all wikis without account", async () => {
      const wiki1 = await testDB.wikis.add(
        factory.wiki({ author: undefined, type: "created" }),
      );

      // Other author
      await testDB.wikis.add(
        factory.wiki({
          author: {
            username: "peter_peter",
            key: "peter-peter",
          },
          type: "created",
        }),
      );

      const wikis = await repo.getUserWikis(undefined);
      expect(wikis).toHaveLength(1);
      expect(wikis[0]!.key).toStrictEqual(wiki1);
    });
  });

  test("should update wikis correctly", async () => {
    await testDB.wikis.bulkAdd([
      {
        image: "image.fr",
        name: "wiki #1",
        author: { username: TEST_USER.username, key: TEST_USER.key },
        description: "description",
        key: "wiki1-key",
        type: "created",
        createdAt: DATE,
      },
      {
        image: "photo.fr",
        name: "wiki #2",
        author: undefined,
        description: "vrouuuum",
        key: "wiki2-key",
        type: "imported",
        createdAt: DATE,
      },
      {
        image: "avion.png",
        name: "wiki #3",
        author: { username: TEST_USER.username, key: TEST_USER.key },
        description: "pas modifié",
        key: "wiki3-key",
        type: "created",
        createdAt: DATE,
      },
    ]);
    expect(await testDB.wikis.toArray()).toHaveLength(3);

    await repo.bulkUpdate([
      {
        key: "wiki1-key",
        description: "une autre description",
        name: "coucou",
      },
      {
        key: "wiki2-key",
        author: { key: "peter-key", username: "peter_peter" },
      },
      {
        key: "wiki4-key", // Does not exist
        name: "tutu",
      },
      { key: "wiki3-key" },
    ]);

    const wikis = await testDB.wikis.toArray();

    expect(wikis).toHaveLength(3);
    expect(wikis).toContainEqual({
      image: "image.fr",
      name: "coucou",
      author: { username: TEST_USER.username, key: TEST_USER.key },
      description: "une autre description",
      key: "wiki1-key",
      type: "created",
      createdAt: DATE,
    });
    expect(wikis).toContainEqual({
      image: "photo.fr",
      name: "wiki #2",
      author: { key: "peter-key", username: "peter_peter" },
      description: "vrouuuum",
      key: "wiki2-key",
      type: "imported",
      createdAt: DATE,
    });
    expect(wikis).toContainEqual({
      image: "avion.png",
      name: "wiki #3",
      author: { username: TEST_USER.username, key: TEST_USER.key },
      description: "pas modifié",
      key: "wiki3-key",
      type: "created",
      createdAt: DATE,
    });
  });

  test("should not authorize same wiki multiple times", async () => {
    expect(
      async () =>
        await repo.bulkUpdate([{ key: "a" }, { key: "b" }, { key: "a" }]),
    ).rejects.toThrowError("Each wiki can only be present once in the input");
  });

  describe("create", () => {
    test("should create wiki", async () => {
      const existingWiki = factory.wiki();
      await testDB.wikis.add(existingWiki);

      const wikiToAdd = factory.wiki();
      const wikiKey = await repo.create(wikiToAdd);

      const allWikis = await testDB.wikis.toArray();
      expect(allWikis).toHaveLength(2);
      expect(await testDB.wikis.get(wikiKey)).toStrictEqual({
        ...wikiToAdd,
        key: wikiKey,
      });
    });
  });

  describe("get", () => {
    test("should get wiki from key", async () => {
      await testDB.wikis.add(factory.wiki());
      const wiki = factory.wiki();
      await testDB.wikis.add(wiki);
      await testDB.wikis.add(factory.wiki());

      const result = await repo.get(wiki.key);

      expect(result).toStrictEqual(wiki);
    });

    test("should return null if not found", async () => {
      await testDB.wikis.bulkAdd([
        factory.wiki(),
        factory.wiki(),
        factory.wiki(),
      ]);

      const wiki = await repo.get("zioummm");

      expect(wiki).toBeNull();
    });
  });

  describe("getSections", () => {
    test("should get wiki sections", async () => {
      const wiki = factory.wiki();

      const categories = [
        factory.wikiCategory({ wikiKey: wiki.key }),
        factory.wikiCategory({ wikiKey: wiki.key }),
        factory.wikiCategory({ wikiKey: wiki.key }),
      ];
      const art1 = factory.wikiArticle({
        wikiKey: wiki.key,
        categoryKey: categories[0]?.key,
      });
      const art2 = factory.wikiArticle({
        wikiKey: wiki.key,
        categoryKey: categories[1]?.key,
      });
      const art3 = factory.wikiArticle({
        wikiKey: wiki.key,
        categoryKey: categories[1]?.key,
      });
      const art4 = factory.wikiArticle({
        wikiKey: wiki.key,
        categoryKey: undefined,
      });
      const art5 = factory.wikiArticle();
      await testDB.wikiCategories.bulkAdd(categories);
      await testDB.wikiArticles.bulkAdd([art1, art2, art3, art4, art5]);

      const sections = await repo.getSections(wiki.key);

      // TODO: this is horrible, we should find a more idiomatic way to deeply compare arrays in tests without taking order into account
      const _sort = (data: WikiSection[]) => {
        return data
          .sort((a, b) =>
            (a.category?.key ?? "").localeCompare(b.category?.key ?? ""),
          )
          .map(({ articles, ...rest }) => ({
            ...rest,
            articles: articles.sort((a, b) => a.key.localeCompare(b.key)),
          }));
      };

      expect(sections).toHaveLength(4);

      expect(_sort(sections)).toStrictEqual(
        _sort([
          {
            category: {
              name: categories[0]!.name,
              key: categories[0]!.key,
              color: categories[0]!.color,
            },
            articles: [{ title: art1.title, key: art1.key }],
          },
          {
            category: {
              name: categories[1]!.name,
              key: categories[1]!.key,
              color: categories[1]!.color,
            },
            articles: [
              { title: art2.title, key: art2.key },
              { title: art3.title, key: art3.key },
            ],
          },
          {
            category: {
              name: categories[2]!.name,
              key: categories[2]!.key,
              color: categories[2]!.color,
            },
            articles: [],
          },
          { category: null, articles: [{ title: art4.title, key: art4.key }] },
        ]),
      );
    });
  });

  describe("create article", () => {
    test("should create wiki article", async () => {
      const existingArticle = factory.wikiArticle();
      await testDB.wikiArticles.add(existingArticle);

      const articleToAdd = factory.wikiArticle();
      const articleKey = await repo.createArticle(articleToAdd);

      const allArticles = await testDB.wikiArticles.toArray();
      expect(allArticles).toHaveLength(2);
      expect(await testDB.wikiArticles.get(articleKey)).toStrictEqual({
        ...articleToAdd,
        key: articleKey,
      });
    });
  });

  describe("get article", () => {
    test("should get article from key", async () => {
      await testDB.wikiArticles.add(factory.wikiArticle());
      const expected = factory.wikiArticle();
      await testDB.wikiArticles.add(expected);
      await testDB.wikiArticles.add(factory.wikiArticle());

      const article = await repo.getArticle(expected.key);

      expect(article).toStrictEqual(expected);
    });

    test("should return null if not found", async () => {
      await testDB.wikiArticles.bulkAdd([
        factory.wikiArticle(),
        factory.wikiArticle(),
        factory.wikiArticle(),
      ]);

      const article = await repo.getArticle("zioummm");

      expect(article).toBeNull();
    });
  });

  describe("remove article", () => {
    test("should remove article", async () => {
      const wikiArticle = factory.wikiArticle();
      const wikiArticle2 = factory.wikiArticle();
      const wikiArticleLink = factory.wikiArticleLink({
        articleKey: wikiArticle.key,
      });
      const wikiArticleLink2 = factory.wikiArticleLink({
        articleKey: wikiArticle.key,
      });
      const wikiArticleLink3 = factory.wikiArticleLink({
        articleKey: wikiArticle2.key,
      });
      await testDB.wikiArticles.add(wikiArticle);
      await testDB.wikiArticles.add(wikiArticle2);
      await testDB.wikiArticleLinks.add(wikiArticleLink);
      await testDB.wikiArticleLinks.add(wikiArticleLink2);
      await testDB.wikiArticleLinks.add(wikiArticleLink3);

      await repo.removeArticle(wikiArticle.key);

      const result = await repo.getArticle(wikiArticle.key);
      const result2 = await repo.getArticle(wikiArticle2.key);
      const resultKey = await repo.getArticleLink(
        wikiArticleLink.key,
        wikiArticleLink.entityKey,
      );
      const resultKey2 = await repo.getArticleLink(
        wikiArticleLink2.key,
        wikiArticleLink2.entityKey,
      );
      const resultKey3 = await repo.getArticleLink(
        wikiArticleLink3.key,
        wikiArticleLink3.entityKey,
      );
      expect(result).toStrictEqual(null);
      expect(result2).toStrictEqual(wikiArticle2);
      expect(resultKey).toStrictEqual(null);
      expect(resultKey2).toStrictEqual(null);
      expect(resultKey3).toStrictEqual(wikiArticleLink3);
    });
  });

  describe("update article", () => {
    test("should update article", async () => {
      vi.setSystemTime(new Date());

      const art1 = factory.wikiArticle();
      const art2 = factory.wikiArticle();
      await testDB.wikiArticles.bulkAdd([art1, art2]);
      const category = factory.wikiCategory();

      await repo.updateArticle(art2.key, {
        title: "A new title",
        categoryKey: category.key,
      });

      const art1FromDB = await testDB.wikiArticles.get(art1.key);
      const art2FromDB = await testDB.wikiArticles.get(art2.key);
      expect(art1FromDB).toEqual(art1); // Unchanged
      expect(art2FromDB).toEqual({
        ...art2,
        title: "A new title",
        categoryKey: category.key,
        updatedAt: new Date(),
      });
    });
  });

  describe("create category", () => {
    test("should create wiki category", async () => {
      const existingCategory = factory.wikiCategory({ name: "culture" });
      await testDB.wikiCategories.add(existingCategory);

      const categoryToAdd = factory.wikiCategory({ name: "person" });
      const articleKey = await repo.createCategory(categoryToAdd);

      const allCategories = await testDB.wikiCategories.toArray();
      expect(allCategories).toHaveLength(2);
      expect(await testDB.wikiCategories.get(articleKey)).toStrictEqual({
        ...categoryToAdd,
        key: articleKey,
      });
    });
  });
});
