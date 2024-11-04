/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as AboutImport } from './routes/about'
import { Route as IndexImport } from './routes/index'
import { Route as LibraryIndexImport } from './routes/library/index'
import { Route as LibraryStoryKeyImport } from './routes/library/$storyKey'
import { Route as BuilderStoriesImport } from './routes/builder/stories'
import { Route as BuilderStoryKeyImport } from './routes/builder/$storyKey'
import { Route as GameGameKeySceneKeyImport } from './routes/game/$gameKey/$sceneKey'
import { Route as GameTestGameKeySceneKeyImport } from './routes/game/test/$gameKey/$sceneKey'

// Create/Update Routes

<<<<<<< HEAD
<<<<<<< HEAD
=======
const StoreRoute = StoreImport.update({
  id: '/store',
  path: '/store',
  getParentRoute: () => rootRoute,
} as any)

>>>>>>> 6c8b761 (:sparkles: Use story type instead of status to determine if a story is in the builder or in the library)
=======
>>>>>>> 12d5460 (:fire: Remove store from client)
const AboutRoute = AboutImport.update({
  id: '/about',
  path: '/about',
  getParentRoute: () => rootRoute,
} as any)

const IndexRoute = IndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

const LibraryIndexRoute = LibraryIndexImport.update({
  id: '/library/',
  path: '/library/',
  getParentRoute: () => rootRoute,
} as any)

const LibraryStoryKeyRoute = LibraryStoryKeyImport.update({
  id: '/library/$storyKey',
  path: '/library/$storyKey',
  getParentRoute: () => rootRoute,
} as any)

const BuilderStoriesRoute = BuilderStoriesImport.update({
  id: '/builder/stories',
  path: '/builder/stories',
  getParentRoute: () => rootRoute,
} as any)

const BuilderStoryKeyRoute = BuilderStoryKeyImport.update({
  id: '/builder/$storyKey',
  path: '/builder/$storyKey',
  getParentRoute: () => rootRoute,
} as any)

const GameGameKeySceneKeyRoute = GameGameKeySceneKeyImport.update({
  id: '/game/$gameKey/$sceneKey',
  path: '/game/$gameKey/$sceneKey',
  getParentRoute: () => rootRoute,
} as any)

const GameTestGameKeySceneKeyRoute = GameTestGameKeySceneKeyImport.update({
  id: '/game/test/$gameKey/$sceneKey',
  path: '/game/test/$gameKey/$sceneKey',
  getParentRoute: () => rootRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/about': {
      id: '/about'
      path: '/about'
      fullPath: '/about'
      preLoaderRoute: typeof AboutImport
      parentRoute: typeof rootRoute
    }
    '/builder/$storyKey': {
      id: '/builder/$storyKey'
      path: '/builder/$storyKey'
      fullPath: '/builder/$storyKey'
      preLoaderRoute: typeof BuilderStoryKeyImport
      parentRoute: typeof rootRoute
    }
    '/builder/stories': {
      id: '/builder/stories'
      path: '/builder/stories'
      fullPath: '/builder/stories'
      preLoaderRoute: typeof BuilderStoriesImport
      parentRoute: typeof rootRoute
    }
    '/library/$storyKey': {
      id: '/library/$storyKey'
      path: '/library/$storyKey'
      fullPath: '/library/$storyKey'
      preLoaderRoute: typeof LibraryStoryKeyImport
      parentRoute: typeof rootRoute
    }
    '/library/': {
      id: '/library/'
      path: '/library'
      fullPath: '/library'
      preLoaderRoute: typeof LibraryIndexImport
      parentRoute: typeof rootRoute
    }
    '/game/$gameKey/$sceneKey': {
      id: '/game/$gameKey/$sceneKey'
      path: '/game/$gameKey/$sceneKey'
      fullPath: '/game/$gameKey/$sceneKey'
      preLoaderRoute: typeof GameGameKeySceneKeyImport
      parentRoute: typeof rootRoute
    }
    '/game/test/$gameKey/$sceneKey': {
      id: '/game/test/$gameKey/$sceneKey'
      path: '/game/test/$gameKey/$sceneKey'
      fullPath: '/game/test/$gameKey/$sceneKey'
      preLoaderRoute: typeof GameTestGameKeySceneKeyImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '/about': typeof AboutRoute
<<<<<<< HEAD
<<<<<<< HEAD
=======
  '/store': typeof StoreRoute
>>>>>>> 6c8b761 (:sparkles: Use story type instead of status to determine if a story is in the builder or in the library)
=======
>>>>>>> 12d5460 (:fire: Remove store from client)
  '/builder/$storyKey': typeof BuilderStoryKeyRoute
  '/builder/stories': typeof BuilderStoriesRoute
  '/library/$storyKey': typeof LibraryStoryKeyRoute
  '/library': typeof LibraryIndexRoute
  '/game/$gameKey/$sceneKey': typeof GameGameKeySceneKeyRoute
  '/game/test/$gameKey/$sceneKey': typeof GameTestGameKeySceneKeyRoute
}

export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '/about': typeof AboutRoute
<<<<<<< HEAD
<<<<<<< HEAD
=======
  '/store': typeof StoreRoute
>>>>>>> 6c8b761 (:sparkles: Use story type instead of status to determine if a story is in the builder or in the library)
=======
>>>>>>> 12d5460 (:fire: Remove store from client)
  '/builder/$storyKey': typeof BuilderStoryKeyRoute
  '/builder/stories': typeof BuilderStoriesRoute
  '/library/$storyKey': typeof LibraryStoryKeyRoute
  '/library': typeof LibraryIndexRoute
  '/game/$gameKey/$sceneKey': typeof GameGameKeySceneKeyRoute
  '/game/test/$gameKey/$sceneKey': typeof GameTestGameKeySceneKeyRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/': typeof IndexRoute
  '/about': typeof AboutRoute
<<<<<<< HEAD
<<<<<<< HEAD
=======
  '/store': typeof StoreRoute
>>>>>>> 6c8b761 (:sparkles: Use story type instead of status to determine if a story is in the builder or in the library)
=======
>>>>>>> 12d5460 (:fire: Remove store from client)
  '/builder/$storyKey': typeof BuilderStoryKeyRoute
  '/builder/stories': typeof BuilderStoriesRoute
  '/library/$storyKey': typeof LibraryStoryKeyRoute
  '/library/': typeof LibraryIndexRoute
  '/game/$gameKey/$sceneKey': typeof GameGameKeySceneKeyRoute
  '/game/test/$gameKey/$sceneKey': typeof GameTestGameKeySceneKeyRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | '/'
    | '/about'
<<<<<<< HEAD
<<<<<<< HEAD
=======
    | '/store'
>>>>>>> 6c8b761 (:sparkles: Use story type instead of status to determine if a story is in the builder or in the library)
=======
>>>>>>> 12d5460 (:fire: Remove store from client)
    | '/builder/$storyKey'
    | '/builder/stories'
    | '/library/$storyKey'
    | '/library'
    | '/game/$gameKey/$sceneKey'
    | '/game/test/$gameKey/$sceneKey'
  fileRoutesByTo: FileRoutesByTo
  to:
    | '/'
    | '/about'
<<<<<<< HEAD
<<<<<<< HEAD
=======
    | '/store'
>>>>>>> 6c8b761 (:sparkles: Use story type instead of status to determine if a story is in the builder or in the library)
=======
>>>>>>> 12d5460 (:fire: Remove store from client)
    | '/builder/$storyKey'
    | '/builder/stories'
    | '/library/$storyKey'
    | '/library'
    | '/game/$gameKey/$sceneKey'
    | '/game/test/$gameKey/$sceneKey'
  id:
    | '__root__'
    | '/'
    | '/about'
<<<<<<< HEAD
<<<<<<< HEAD
=======
    | '/store'
>>>>>>> 6c8b761 (:sparkles: Use story type instead of status to determine if a story is in the builder or in the library)
=======
>>>>>>> 12d5460 (:fire: Remove store from client)
    | '/builder/$storyKey'
    | '/builder/stories'
    | '/library/$storyKey'
    | '/library/'
    | '/game/$gameKey/$sceneKey'
    | '/game/test/$gameKey/$sceneKey'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  AboutRoute: typeof AboutRoute
<<<<<<< HEAD
<<<<<<< HEAD
=======
  StoreRoute: typeof StoreRoute
>>>>>>> 6c8b761 (:sparkles: Use story type instead of status to determine if a story is in the builder or in the library)
=======
>>>>>>> 12d5460 (:fire: Remove store from client)
  BuilderStoryKeyRoute: typeof BuilderStoryKeyRoute
  BuilderStoriesRoute: typeof BuilderStoriesRoute
  LibraryStoryKeyRoute: typeof LibraryStoryKeyRoute
  LibraryIndexRoute: typeof LibraryIndexRoute
  GameGameKeySceneKeyRoute: typeof GameGameKeySceneKeyRoute
  GameTestGameKeySceneKeyRoute: typeof GameTestGameKeySceneKeyRoute
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  AboutRoute: AboutRoute,
<<<<<<< HEAD
<<<<<<< HEAD
=======
  StoreRoute: StoreRoute,
>>>>>>> 6c8b761 (:sparkles: Use story type instead of status to determine if a story is in the builder or in the library)
=======
>>>>>>> 12d5460 (:fire: Remove store from client)
  BuilderStoryKeyRoute: BuilderStoryKeyRoute,
  BuilderStoriesRoute: BuilderStoriesRoute,
  LibraryStoryKeyRoute: LibraryStoryKeyRoute,
  LibraryIndexRoute: LibraryIndexRoute,
  GameGameKeySceneKeyRoute: GameGameKeySceneKeyRoute,
  GameTestGameKeySceneKeyRoute: GameTestGameKeySceneKeyRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* prettier-ignore-end */

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/about",
        "/builder/$storyKey",
        "/builder/stories",
        "/library/$storyKey",
        "/library/",
        "/game/$gameKey/$sceneKey",
        "/game/test/$gameKey/$sceneKey"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/about": {
      "filePath": "about.tsx"
    },
    "/builder/$storyKey": {
      "filePath": "builder/$storyKey.tsx"
    },
    "/builder/stories": {
      "filePath": "builder/stories.tsx"
    },
    "/library/$storyKey": {
      "filePath": "library/$storyKey.tsx"
    },
    "/library/": {
      "filePath": "library/index.tsx"
    },
    "/game/$gameKey/$sceneKey": {
      "filePath": "game/$gameKey/$sceneKey.tsx"
    },
    "/game/test/$gameKey/$sceneKey": {
      "filePath": "game/test/$gameKey/$sceneKey.tsx"
    }
  }
}
ROUTE_MANIFEST_END */
