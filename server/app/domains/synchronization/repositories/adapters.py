from domains.synchronization.type_defs import (
    SynchronizationBuilderParams,
    SynchronizationBuilderPosition,
    SynchronizationScene,
    SynchronizationSceneAction,
    SynchronizationStory,
    SynchronizationStoryAuthor,
    SynchronizationStoryProgress,
)
from utils.mongo.base_repository import (
    MongoBuilderParams,
    MongoBuilderPosition,
    MongoScene,
    MongoSceneAction,
    MongoStory,
    MongoStoryAuthor,
    MongoStoryProgress,
)
from utils.type_defs import StoryGenre, StoryType

# From domain to mongo


def make_mongo_builder_params(
    domain: SynchronizationBuilderParams,
) -> MongoBuilderParams:
    return MongoBuilderParams(
        position=MongoBuilderPosition(x=domain.position.x, y=domain.position.y)
    )


def make_mongo_scene_action(domain: SynchronizationSceneAction) -> MongoSceneAction:
    return MongoSceneAction(
        text=domain.text,
        sceneKey=domain.scene_key,
    )


def make_mongo_author(domain: SynchronizationStoryAuthor) -> MongoStoryAuthor:
    return MongoStoryAuthor(key=domain.key, username=domain.username)


def make_mongo_scene(domain: SynchronizationScene) -> MongoScene:
    return MongoScene(
        key=domain.key,
        storyKey=domain.story_key,
        title=domain.title,
        content=domain.content,
        actions=[make_mongo_scene_action(action) for action in domain.actions],
        builderParams=make_mongo_builder_params(domain.builder_params),
    )


def make_story_type(type: str) -> StoryType:
    match (type):
        case "builder":
            return StoryType.BUILDER
        case "imported":
            return StoryType.IMPORTED
        case _:
            raise ValueError(f"Unsupported story type: {type}")


# TODO: do something smarter
def make_story_genre(genre: str) -> StoryGenre:
    match (genre):
        case "adventure":
            return StoryGenre.ADVENTURE
        case "children":
            return StoryGenre.CHILDREN
        case "detective":
            return StoryGenre.DETECTIVE
        case "dystopia":
            return StoryGenre.DYSTOPIA
        case "fantasy":
            return StoryGenre.FANTASY
        case "historical":
            return StoryGenre.HISTORICAL
        case "horror":
            return StoryGenre.HORROR
        case "humor":
            return StoryGenre.HUMOR
        case "mystery":
            return StoryGenre.MYSTERY
        case "romance":
            return StoryGenre.ROMANCE
        case "science-fiction":
            return StoryGenre.SCIENCE_FICTION
        case "thriller":
            return StoryGenre.THRILLER
        case "suspense":
            return StoryGenre.SUSPENSE
        case "western":
            return StoryGenre.WESTERN
        case _:
            raise ValueError(f"Unsupported story type: {type}")


def make_mongo_story(domain: SynchronizationStory) -> MongoStory:
    return MongoStory(
        key=domain.key,
        userKey=domain.user_key,
        type=domain.type,
        author=make_mongo_author(domain.author) if domain.author else None,
        title=domain.title,
        description=domain.description,
        image=domain.image,
        genres=[genre for genre in domain.genres],
        creationDate=domain.creation_date,
        firstSceneKey=domain.first_scene_key,
        originalStoryKey=domain.original_story_key,
        publicationDate=domain.publication_date,
        scenes=[make_mongo_scene(scene) for scene in domain.scenes],
    )


def make_mongo_story_progress(
    domain: SynchronizationStoryProgress,
) -> MongoStoryProgress:
    return MongoStoryProgress(
        key=domain.key,
        userKey=domain.user_key,
        history=domain.history,
        currentSceneKey=domain.current_scene_key,
        lastPlayedAt=domain.last_played_at,
        finished=domain.finished,
        storyKey=domain.story_key,
        lastSyncAt=domain.last_sync_at,
    )


# From mongo to domain


def make_synchronization_builder_position(
    position: MongoBuilderPosition,
) -> SynchronizationBuilderPosition:
    return SynchronizationBuilderPosition(x=position["x"], y=position["y"])


def make_synchronization_author(
    mongo_author: MongoStoryAuthor,
) -> SynchronizationStoryAuthor:
    return SynchronizationStoryAuthor(
        key=mongo_author["key"], username=mongo_author["username"]
    )


def make_synchronization_scene(scene: MongoScene) -> SynchronizationScene:
    return SynchronizationScene(
        key=scene["key"],
        story_key=scene["storyKey"],
        title=scene["title"],
        content=scene["content"],
        actions=[
            SynchronizationSceneAction(
                text=action["text"], scene_key=action["sceneKey"]
            )
            for action in scene.get("actions", [])
        ],
        builder_params=SynchronizationBuilderParams(
            position=make_synchronization_builder_position(
                scene["builderParams"]["position"]
            )
        ),
    )


# TODO: how do we want to handle cases where a field is missing in the database (i.e KeyError)
def make_synchronization_story(story: MongoStory) -> SynchronizationStory:
    return SynchronizationStory(
        key=story["key"],
        user_key=story["userKey"],
        type=make_story_type(story["type"]),
        author=(
            make_synchronization_author(story["author"]) if story["author"] else None
        ),
        title=story["title"],
        description=story["description"],
        image=story["image"],
        genres=[make_story_genre(genre) for genre in story["genres"]],
        creation_date=story["creationDate"],
        first_scene_key=story["firstSceneKey"],
        original_story_key=story.get("originalStoryKey"),
        publication_date=story.get("publicationDate"),
        scenes=[make_synchronization_scene(scene) for scene in story.get("scenes", [])],
    )


# TODO: how do we want to handle cases where a field is missing in the database (i.e KeyError)
# Can we use pydantic w/ pymongo directly?
def make_synchronization_story_progress(
    story_progress: MongoStoryProgress,
) -> SynchronizationStoryProgress:
    return SynchronizationStoryProgress(
        key=story_progress["key"],
        user_key=story_progress["userKey"],
        story_key=story_progress["storyKey"],
        history=story_progress.get("history", []),
        current_scene_key=story_progress["currentSceneKey"],
        last_played_at=story_progress["lastPlayedAt"],
        finished=story_progress.get("finished"),
        last_sync_at=story_progress.get("lastSyncAt"),
    )
