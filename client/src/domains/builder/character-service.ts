import {
  CharacterConfiguration,
  CharacterAttribute,
} from "@/lib/storage/domain";
import {
  CharacterRepositoryPort,
  getDexieCharacterRepository,
} from "./character-repository";
import { EntityNotExistError } from "../errors";
import {
  CharacterAttributeNotExistError,
  CharacterAttributeNameAlreadyExistError,
} from "./errors";
import { nanoid } from "nanoid";

export type CharacterServicePort = {
  getCharacter: (storyKey: string) => Promise<CharacterConfiguration | null>;
  /**
   * Creates a character configuration, with empty attributes
   * @param storyKey the key of the story the character is associated with
   * @returns the created character
   */
  createCharacter: (storyKey: string) => Promise<CharacterConfiguration>;
  addAttribute: (
    storyKey: string,
    attribute: Omit<CharacterAttribute, "key">,
  ) => Promise<CharacterConfiguration>;
  updateAttribute: (
    storyKey: string,
    attribute: Partial<Omit<CharacterAttribute, "key" | "type">> & {
      key: string;
    },
  ) => Promise<CharacterConfiguration>;
  removeAttribute: (
    storyKey: string,
    attributeKey: string,
  ) => Promise<CharacterConfiguration>;
  deleteCharacter: (storyKey: string) => Promise<void>;
};

export const _getCharacterService = ({
  repository,
}: {
  repository: CharacterRepositoryPort;
}): CharacterServicePort => {
  return {
    getCharacter: async (storyKey) => {
      console.log("coucou");
      return await repository.get(storyKey);
    },

    createCharacter: async (storyKey) => {
      const key = await repository.create({ storyKey, attributes: {} });
      return { key, storyKey, attributes: {} };
    },

    addAttribute: async (storyKey, attributeToAdd) => {
      const characterConfig = await repository.get(storyKey);
      if (!characterConfig)
        throw new EntityNotExistError("character-configuration", { storyKey });

      if (
        Object.values(characterConfig.attributes).some(
          (attr) => attr.name === attributeToAdd.name,
        )
      )
        throw new CharacterAttributeNameAlreadyExistError(
          storyKey,
          attributeToAdd.name,
        );

      const key = nanoid();
      const updatedConfig = {
        ...characterConfig,
        attributes: {
          ...characterConfig.attributes,
          [key]: { ...attributeToAdd, key },
        },
      } satisfies CharacterConfiguration;

      await repository.update(storyKey, updatedConfig);
      return updatedConfig;
    },

    updateAttribute: async (storyKey, attributePayload) => {
      const characterConfig = await repository.get(storyKey);
      if (!characterConfig)
        throw new EntityNotExistError("character-configuration", { storyKey });

      if (!(attributePayload.key in characterConfig.attributes))
        throw new CharacterAttributeNotExistError(
          storyKey,
          attributePayload.key,
        );

      if (
        "name" in attributePayload &&
        attributePayload?.name !==
          characterConfig.attributes[attributePayload.key]!.name &&
        Object.values(characterConfig.attributes).some(
          (attr) => attr.name === attributePayload.name,
        )
      )
        throw new CharacterAttributeNameAlreadyExistError(
          storyKey,
          attributePayload.name!,
        );

      const key = attributePayload.key;

      const updatedConfig = {
        ...characterConfig,
        attributes: {
          ...characterConfig.attributes,
          [key]: {
            ...characterConfig.attributes[key]!,
            ...attributePayload, // Overwrite existing fields with update payload
          },
        },
      } satisfies CharacterConfiguration;

      await repository.update(storyKey, updatedConfig);
      return updatedConfig;
    },

    removeAttribute: async (storyKey, attributeKey) => {
      const characterConfig = await repository.get(storyKey);
      if (!characterConfig)
        throw new EntityNotExistError("character-configuration", { storyKey });

      if (!(attributeKey in characterConfig.attributes))
        throw new CharacterAttributeNotExistError(storyKey, attributeKey);

      const updatedConfig = {
        ...characterConfig,
        attributes: Object.fromEntries(
          // Filter out attribute with specified key
          Object.entries(characterConfig.attributes).filter(
            ([key]) => key !== attributeKey,
          ),
        ),
      } satisfies CharacterConfiguration;

      await repository.update(storyKey, updatedConfig);
      return updatedConfig;
    },

    deleteCharacter: async (storyKey) => {
      await repository.delete(storyKey);
    },
  };
};

export const getCharacterService = () =>
  _getCharacterService({ repository: getDexieCharacterRepository() });
