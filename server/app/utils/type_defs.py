import enum


class StoryType(str, enum.Enum):
    BUILDER = "builder"
    IMPORTED = "imported"


class StoryGenre(str, enum.Enum):
    ADVENTURE = "adventure"
    CHILDREN = "children"
    DETECTIVE = "detective"
    DYSTOPIA = "dystopia"
    FANTASY = "fantasy"
    HISTORICAL = "historical"
    HORROR = "horror"
    HUMOR = "humor"
    MYSTERY = "mystery"
    ROMANCE = "romance"
    SCIENCE_FICTION = "science-fiction"
    THRILLER = "thriller"
    SUSPENSE = "suspense"
    WESTERN = "western"
