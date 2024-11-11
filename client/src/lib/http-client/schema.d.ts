/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */

export interface paths {
    "/api/user/login": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** User Login */
        post: operations["API-user_login"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/user/register": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Create User */
        post: operations["API-create_user"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/load/{user_key}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get Synchronization Data */
        get: operations["API-get_synchronization_data"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/save/progresses": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /** Synchronize Progresses */
        put: operations["API-synchronize_progresses"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/save/builder": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /** Save Builder State */
        put: operations["API-save_builder_state"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
}
export type webhooks = Record<string, never>;
export interface components {
    schemas: {
        /** APIResponse */
        APIResponse: {
            /** Success */
            success: boolean;
            /** Message */
            message?: string | null;
        };
        /** Action */
        Action: {
            /** Text */
            text: string;
            /** Scenekey */
            sceneKey?: string | null;
        };
        /** BuilderParams */
        BuilderParams: {
            position: components["schemas"]["BuilderPosition"];
        };
        /** BuilderPosition */
        BuilderPosition: {
            /** X */
            x: number;
            /** Y */
            y: number;
        };
        /** CreateUserRequest */
        CreateUserRequest: {
            /** Username */
            username: string;
            /** Email */
            email: string;
            /** Password */
            password: string;
            /** Key */
            key: string;
            /** Token */
            token: string;
        };
        /** FullStoriesRequest */
        FullStoriesRequest: {
            /** Stories */
            stories: components["schemas"]["Story"][];
            /** Scenes */
            scenes: components["schemas"]["Scene-Input"][];
        };
        /** FullStory */
        FullStory: {
            /**
             * Key
             * @description The unique key of the story
             */
            key: string;
            /** @description The type of the story */
            type: components["schemas"]["StoryType"];
            /** @description The author of the story */
            author: components["schemas"]["StoryAuthor"] | null;
            /**
             * Title
             * @description The title of the story
             */
            title: string;
            /**
             * Description
             * @description The description of the story
             */
            description: string;
            /**
             * Image
             * @description The URL used for the story thumbnail
             */
            image: string;
            /**
             * Genres
             * @description The genres of story
             */
            genres: components["schemas"]["StoryGenre"][];
            /**
             * Creationdate
             * @description The date at which the story was created
             */
            creationDate: string;
            /**
             * Firstscenekey
             * @description The first scene of the story
             */
            firstSceneKey: string;
            /**
             * Originalstorykey
             * @description The key of the first
             */
            originalStoryKey?: string | null;
            /**
             * Publicationdate
             * @description The date at which the story
             */
            publicationDate?: string | null;
            /** Scenes */
            scenes: components["schemas"]["Scene-Output"][];
        };
        /** HTTPValidationError */
        HTTPValidationError: {
            /** Detail */
            detail?: components["schemas"]["ValidationError"][];
        };
        /** LoginUserRequest */
        LoginUserRequest: {
            /** Usernameoremail */
            usernameOrEmail: string;
            /** Password */
            password: string;
            /** Token */
            token: string;
        };
        /** Scene */
        "Scene-Input": {
            /** Key */
            key: string;
            /** Storykey */
            storyKey: string;
            /** Title */
            title: string;
            /** Content */
            content: string;
            /** Actions */
            actions: components["schemas"]["Action"][];
            builderParams: components["schemas"]["BuilderParams"];
        };
        /** Scene */
        "Scene-Output": {
            /** Key */
            key: string;
            /** Storykey */
            storyKey: string;
            /** Title */
            title: string;
            /** Content */
            content: string;
            /** Actions */
            actions: components["schemas"]["Action"][];
            builderParams: components["schemas"]["BuilderParams"];
        };
        /** Story */
        Story: {
            /**
             * Key
             * @description The unique key of the story
             */
            key: string;
            /** @description The type of the story */
            type: components["schemas"]["StoryType"];
            /** @description The author of the story */
            author: components["schemas"]["StoryAuthor"] | null;
            /**
             * Title
             * @description The title of the story
             */
            title: string;
            /**
             * Description
             * @description The description of the story
             */
            description: string;
            /**
             * Image
             * @description The URL used for the story thumbnail
             */
            image: string;
            /**
             * Genres
             * @description The genres of story
             */
            genres: components["schemas"]["StoryGenre"][];
            /**
             * Creationdate
             * @description The date at which the story was created
             */
            creationDate: string;
            /**
             * Firstscenekey
             * @description The first scene of the story
             */
            firstSceneKey: string;
            /**
             * Originalstorykey
             * @description The key of the first
             */
            originalStoryKey?: string | null;
            /**
             * Publicationdate
             * @description The date at which the story
             */
            publicationDate?: string | null;
        };
        /** StoryAuthor */
        StoryAuthor: {
            /** Key */
            key: string;
            /** Username */
            username: string;
        };
        /**
         * StoryGenre
         * @enum {string}
         */
        StoryGenre: "adventure" | "children" | "detective" | "dystopia" | "fantasy" | "historical" | "horror" | "humor" | "mystery" | "romance" | "science-fiction" | "thriller" | "suspense" | "western";
        /** StoryProgress */
        StoryProgress: {
            /** Key */
            key: string;
            /** Userkey */
            userKey: string;
            /** History */
            history: string[];
            /** Currentscenekey */
            currentSceneKey: string;
            /**
             * Lastplayedat
             * Format: date-time
             */
            lastPlayedAt: string;
            /** Finished */
            finished?: boolean | null;
            /** Storykey */
            storyKey: string;
            /** Lastsyncat */
            lastSyncAt?: string | null;
        };
        /**
         * StoryType
         * @enum {string}
         */
        StoryType: "builder" | "published" | "imported";
        /** SynchronizationPayload */
        SynchronizationPayload: {
            /** Playergames */
            playerGames: components["schemas"]["FullStory"][];
            /** Buildergames */
            builderGames: components["schemas"]["FullStory"][] | null;
            /** Storyprogresses */
            storyProgresses: components["schemas"]["StoryProgress"][];
        };
        /** User */
        User: {
            /** Key */
            key: string;
            /** Email */
            email: string;
            /** Username */
            username: string;
        };
        /** ValidationError */
        ValidationError: {
            /** Location */
            loc: (string | number)[];
            /** Message */
            msg: string;
            /** Error Type */
            type: string;
        };
    };
    responses: never;
    parameters: never;
    requestBodies: never;
    headers: never;
    pathItems: never;
}
export type $defs = Record<string, never>;
export interface operations {
    "API-user_login": {
        parameters: {
            query?: never;
            header: {
                authorization: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["LoginUserRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["User"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    "API-create_user": {
        parameters: {
            query?: never;
            header: {
                authorization: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateUserRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["User"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    "API-get_synchronization_data": {
        parameters: {
            query?: never;
            header: {
                authorization: string;
            };
            path: {
                user_key: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SynchronizationPayload"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    "API-synchronize_progresses": {
        parameters: {
            query?: never;
            header: {
                authorization: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["StoryProgress"][];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["APIResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    "API-save_builder_state": {
        parameters: {
            query?: never;
            header: {
                authorization: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["FullStoriesRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["APIResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
}
