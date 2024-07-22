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
    "/api/builder/save/game": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Save Builder State */
        post: operations["API-save_builder_state"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/store/load": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get Store Items */
        get: operations["API-get_store_items"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/store/download/{key}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Download From Store */
        get: operations["API-download_from_store"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/store/publish": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /** Publish In Store */
        put: operations["API-publish_in_store"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/synchronize/{user_key}": {
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
    "/api/synchronize/progress": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /** Synchronize Progress */
        patch: operations["API-synchronize_progress"];
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
        };
        /** FullStory */
        FullStory: {
            /** Key */
            key: string;
            author: components["schemas"]["StoryAuthor"] | null;
            /** Title */
            title: string;
            /** Description */
            description: string;
            /** Image */
            image: string;
            status: components["schemas"]["StoryStatus"];
            /** Genres */
            genres: components["schemas"]["StoryGenre"][];
            /** Publicationdate */
            publicationDate?: string | null;
            /** Creationdate */
            creationDate: string;
            /** Scenes */
            scenes: components["schemas"]["Scene-Output"][];
        };
        /** FullStoryBuilderRequest */
        FullStoryBuilderRequest: {
            story: components["schemas"]["Story"];
            /** Scenes */
            scenes: components["schemas"]["Scene-Input"][];
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
            /** Key */
            key: string;
            author: components["schemas"]["StoryAuthor"] | null;
            /** Title */
            title: string;
            /** Description */
            description: string;
            /** Image */
            image: string;
            status: components["schemas"]["StoryStatus"];
            /** Genres */
            genres: components["schemas"]["StoryGenre"][];
            /** Publicationdate */
            publicationDate?: string | null;
            /** Creationdate */
            creationDate: string;
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
            /** History */
            history: string[];
            /** Currentscenekey */
            currentSceneKey: string;
            /**
             * Lastplayedat
             * Format: date-time
             */
            lastPlayedAt: string;
        };
        /**
         * StoryStatus
         * @enum {string}
         */
        StoryStatus: "draft" | "saved" | "published";
        /** SynchronizationPayload */
        SynchronizationPayload: {
            /** Playergames */
            playerGames: components["schemas"]["FullStory"][];
            /** Buildergames */
            builderGames: components["schemas"]["FullStory"][] | null;
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
            header?: never;
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
            header?: never;
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
    "API-save_builder_state": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["FullStoryBuilderRequest"];
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
    "API-get_store_items": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
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
                    "application/json": components["schemas"]["Story"][];
                };
            };
        };
    };
    "API-download_from_store": {
        parameters: {
            query?: never;
            header?: never;
            path: {
                key: string;
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
                    "application/json": components["schemas"]["FullStory"];
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
    "API-publish_in_store": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["FullStoryBuilderRequest"];
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
    "API-get_synchronization_data": {
        parameters: {
            query?: never;
            header?: never;
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
    "API-synchronize_progress": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["StoryProgress"];
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
