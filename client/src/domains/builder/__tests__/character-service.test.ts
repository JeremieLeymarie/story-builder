import { beforeEach, describe, expect, test, vi } from "vitest";
import {
  getStubCharacterRepository,
  MockCharacterRepository,
} from "../stubs/stub-character-repository";
import {
  _getCharacterService,
  CharacterServicePort,
} from "../character-service";
import { getTestFactory } from "@/lib/testing/factory";
import { EntityNotExistError } from "@/domains/errors";
import {
  CharacterAttributeNameAlreadyExistError,
  CharacterAttributeNotExistError,
} from "../errors";
import { nanoid } from "nanoid";

const factory = getTestFactory();

vi.mock("nanoid", () => ({
  nanoid: vi.fn(() => "fake-key"),
}));

describe("character-service", () => {
  let repository: MockCharacterRepository;
  let svc: CharacterServicePort;
  let touchStory: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    repository = getStubCharacterRepository();
    touchStory = vi.fn(() => Promise.resolve());
    svc = _getCharacterService({ repository, touchStory });
  });

  describe("getCharacter", () => {
    test("simple", async () => {
      const mockCharacter = factory.characterConfig();
      repository.get.mockResolvedValue(mockCharacter);

      const character = await svc.getCharacter(mockCharacter.storyKey);

      expect(character).toStrictEqual(mockCharacter);
    });

    test("character config does not exist", async () => {
      repository.get.mockResolvedValue(null);

      const character = await svc.getCharacter("plouf");

      expect(character).toBeNull();
    });
  });

  describe("createCharacter", () => {
    test("simple", async () => {
      const result = await svc.createCharacter("plouf");

      expect(repository.create).toHaveBeenCalledWith({
        storyKey: "plouf",
        attributes: {},
      });
      expect(touchStory).toHaveBeenCalledWith("plouf");
      expect(result).toStrictEqual({
        key: expect.any(String),
        storyKey: "plouf",
        attributes: {},
      });
    });
  });

  describe("addAttribute", () => {
    test("character config does not exist", async () => {
      repository.get.mockResolvedValueOnce(null);
      const randomAttr = factory.characterConfigAttribute();

      await expect(svc.addAttribute("plouf", randomAttr)).rejects.toThrowError(
        EntityNotExistError,
      );
      expect(repository.update).not.toHaveBeenCalled();
    });

    test("attribute name is taken", async () => {
      const attr = factory.characterConfigAttribute({ name: "dexterity" });
      repository.get.mockResolvedValueOnce({
        storyKey: "plouf",
        key: "key",
        attributes: {
          [attr.key]: attr,
        },
      });

      await expect(
        svc.addAttribute("plouf", {
          type: "numeric",
          name: "dexterity", // same name
          description: "hihi",
          initialValue: 12,
          visibility: "visible",
        }),
      ).rejects.toThrowError(CharacterAttributeNameAlreadyExistError);
      expect(repository.update).not.toHaveBeenCalled();
    });

    test("no attributes", async () => {
      repository.get.mockResolvedValueOnce({
        storyKey: "plouf",
        key: "key",
        attributes: {},
      });
      vi.mocked(nanoid).mockReturnValue("attr-key");

      const { key, ...attr } = factory.characterConfigAttribute();
      const result = await svc.addAttribute("plouf", attr);

      expect(repository.update).toHaveBeenCalledWith("plouf", {
        key: "key",
        storyKey: "plouf",
        attributes: { "attr-key": { ...attr, key: "attr-key" } },
      });
      expect(touchStory).toHaveBeenCalledWith("plouf");
      expect(Object.values(result.attributes)).toStrictEqual([
        {
          ...attr,
          key: "attr-key",
        },
      ]);
    });

    test("multiple attributes", async () => {
      const attrs = Array(3)
        .fill(null)
        .map(() => factory.characterConfigAttribute());
      repository.get.mockResolvedValueOnce({
        storyKey: "plouf",
        key: "key",
        attributes: Object.fromEntries(attrs.map((attr) => [attr.key, attr])),
      });
      vi.mocked(nanoid).mockReturnValue("attr-key");

      const attr = {
        type: "numeric",
        name: "vroum", // same name
        description: "hihi",
        initialValue: 12,
        visibility: "visible",
      } as const;
      const result = await svc.addAttribute("plouf", attr);

      const expectedAttrs = {
        [attrs[0]!.key]: attrs[0]!,
        [attrs[1]!.key]: attrs[1]!,
        [attrs[2]!.key]: attrs[2]!,
        "attr-key": { ...attr, key: "attr-key" },
      };
      expect(repository.update).toHaveBeenCalledWith("plouf", {
        key: "key",
        storyKey: "plouf",
        attributes: expectedAttrs,
      });
      expect(touchStory).toHaveBeenCalledWith("plouf");
      expect(result.attributes).toStrictEqual(expectedAttrs);
    });
  });

  describe("updateAttribute", () => {
    test("character config does not exist", async () => {
      repository.get.mockResolvedValueOnce(null);
      const randomAttr = factory.characterConfigAttribute();

      await expect(
        svc.updateAttribute("plouf", randomAttr),
      ).rejects.toThrowError(EntityNotExistError);
      expect(repository.update).not.toHaveBeenCalled();
    });

    test("attribute does not exist", async () => {
      repository.get.mockResolvedValueOnce({
        key: "key",
        storyKey: "plouf",
        attributes: {},
      });

      const randomAttr = factory.characterConfigAttribute();
      await expect(
        svc.updateAttribute("plouf", randomAttr),
      ).rejects.toThrowError(CharacterAttributeNotExistError);
      expect(repository.update).not.toHaveBeenCalled();
    });

    test("attribute name is taken", async () => {
      const attr1 = factory.characterConfigAttribute({
        key: "attr1-key",
        name: "dexterity",
      });
      const attr2 = factory.characterConfigAttribute({
        key: "attr2-key",
        name: "something else",
      });
      repository.get.mockResolvedValueOnce({
        key: "key",
        storyKey: "plouf",
        attributes: { [attr1.key]: attr1, [attr2.key]: attr2 },
      });

      await expect(
        svc.updateAttribute("plouf", { ...attr2, name: "dexterity" }), // taken by attr1
      ).rejects.toThrowError(CharacterAttributeNameAlreadyExistError);
    });

    test("only one attribute", async () => {
      const attr = factory.characterConfigAttribute();
      repository.get.mockResolvedValueOnce({
        key: "key",
        storyKey: "plouf",
        attributes: { [attr.key]: attr },
      });

      const result = await svc.updateAttribute("plouf", {
        ...attr,
        initialValue: 10,
      });

      const expectedAttrs = {
        [attr.key]: { ...attr, initialValue: 10 },
      };
      expect(repository.update).toHaveBeenCalledWith("plouf", {
        key: "key",
        storyKey: "plouf",
        attributes: expectedAttrs,
      });
      expect(touchStory).toHaveBeenCalledWith("plouf");
      expect(result.attributes).toStrictEqual(expectedAttrs);
    });

    test("multiple attributes", async () => {
      const attrs = Array(3)
        .fill(null)
        .map((_, i) =>
          factory.characterConfigAttribute({ key: `attr-key-${i}` }),
        );
      repository.get.mockResolvedValueOnce({
        storyKey: "plouf",
        key: "key",
        attributes: Object.fromEntries(attrs.map((attr) => [attr.key, attr])),
      });

      const result = await svc.updateAttribute("plouf", {
        ...attrs[1]!,
        description: "another description",
      });

      const expectedAttrs = {
        [attrs[0]!.key]: attrs[0]!,
        [attrs[1]!.key]: { ...attrs[1]!, description: "another description" },
        [attrs[2]!.key]: attrs[2]!,
      };

      expect(repository.update).toHaveBeenCalledWith("plouf", {
        key: "key",
        storyKey: "plouf",
        attributes: expectedAttrs,
      });
      expect(touchStory).toHaveBeenCalledWith("plouf");
      expect(result.attributes).toStrictEqual(expectedAttrs);
    });
  });

  describe("removeAttribute", () => {
    test("character config does not exist", async () => {
      repository.get.mockResolvedValueOnce(null);
      const randomAttr = factory.characterConfigAttribute();

      await expect(
        svc.removeAttribute("plouf", randomAttr.key),
      ).rejects.toThrowError(EntityNotExistError);
      expect(repository.update).not.toHaveBeenCalled();
    });

    test("attribute does not exist", async () => {
      repository.get.mockResolvedValueOnce({
        key: "key",
        storyKey: "plouf",
        attributes: {},
      });

      const randomAttr = factory.characterConfigAttribute();
      await expect(
        svc.removeAttribute("plouf", randomAttr.key),
      ).rejects.toThrowError(CharacterAttributeNotExistError);
      expect(repository.update).not.toHaveBeenCalled();
    });

    test("only one attribute", async () => {
      const attr = factory.characterConfigAttribute();
      repository.get.mockResolvedValueOnce({
        key: "key",
        storyKey: "plouf",
        attributes: { [attr.key]: attr },
      });

      const result = await svc.removeAttribute("plouf", attr.key);

      expect(repository.update).toHaveBeenCalledWith("plouf", {
        key: "key",
        storyKey: "plouf",
        attributes: {},
      });
      expect(touchStory).toHaveBeenCalledWith("plouf");
      expect(result.attributes).toStrictEqual({});
    });

    test("multiple attributes", async () => {
      const attrs = Array(3)
        .fill(null)
        .map((_, i) =>
          factory.characterConfigAttribute({ key: `attr-key-${i}` }),
        );
      repository.get.mockResolvedValueOnce({
        storyKey: "plouf",
        key: "key",
        attributes: Object.fromEntries(attrs.map((attr) => [attr.key, attr])),
      });

      const result = await svc.removeAttribute("plouf", attrs[1]!.key);

      const expectedAttrs = {
        [attrs[0]!.key]: attrs[0]!,
        [attrs[2]!.key]: attrs[2]!,
      };

      expect(repository.update).toHaveBeenCalledWith("plouf", {
        key: "key",
        storyKey: "plouf",
        attributes: expectedAttrs,
      });
      expect(touchStory).toHaveBeenCalledWith("plouf");
      expect(result.attributes).toStrictEqual(expectedAttrs);
    });
  });

  describe("deleteCharacter", () => {
    test("should delete character", async () => {
      await svc.deleteCharacter("plouf");

      expect(repository.delete).toHaveBeenCalledWith("plouf");
      expect(touchStory).toHaveBeenCalledWith("plouf");
    });
  });
});
