import { Scene, Story } from "../domain";
import { StoryFromImport } from "@/services/common/import-service";

export const DEMO_STORY: Story = {
  title: "[DEMO] The Enchanted Mountain",
  description:
    "Once upon time on a mountain lived a wizard. His sole purpose was to guard the gem of destiny which encompassed all the laws of this world. The legend said that it's wielder would be able to bend reality to his will. The legendary mage Dalt Wisney used it 4500 years ago to create the first feerical age. ",
  image: "https://wallpapers.com/images/featured/fantasy-05e34f7bfyhne5vg.jpg",
  genres: ["adventure", "fantasy"],
  type: "builder",
  creationDate: new Date(),
  firstSceneKey: "27of_GQ4ZnaMU5BeQ5qPx",
  key: "mcDZQvTdmUCJ7laL8yyLq",
};

export const DEMO_SCENES: Scene[] = [
  {
    builderParams: {
      position: {
        x: -96.29956075704922,
        y: -117.68450914552545,
      },
    },
    content:
      "You find yourself at the foot of the legendary mount Leybaudt which is said to be home to a feerical kingdom in which lives a mysterious wizard. The mountain in all of it's majesty pierces the sky and disappears on the night sky. What do you do ? ",
    title: "At the foot of the mountain",
    actions: [
      {
        text: "You head north towards the mountain ",
        sceneKey: "hTv4yXZ-8hRFIzQ3lY0Hx",
      },
      {
        text: "You head east towards Glitterlake",
        sceneKey: "cTbuqI9NR2QhSMfZnPkht",
      },
      {
        text: "You head South and go back on you tracks in the Molin Forest",
      },
      {
        text: "You head west towards the village of Loriath",
      },
    ],
    storyKey: "mcDZQvTdmUCJ7laL8yyLq",
    key: "27of_GQ4ZnaMU5BeQ5qPx",
  },
  {
    title: "Glitter Lake ",
    content:
      "You tread past the ancient grove towards the end of the trees you finally arrive at your destination and the view takes you breath away. The moonlight and the stars relflect their light on the surface of the lake giving it a mystical and eerie feeling.",
    actions: [
      {
        text: "You take in this marvelous sight and continue walking towards the direction of the song",
        sceneKey: "QzcLyUR6XigrC1cXi-wit",
      },
      {
        text: "You go back",
        sceneKey: "HD0HctAmKp075yXwujHOW",
      },
    ],
    storyKey: "mcDZQvTdmUCJ7laL8yyLq",
    builderParams: {
      position: {
        x: 2011.0153429561637,
        y: 549.177077938913,
      },
    },
    key: "6QHCEM8VprXJRh43-oriO",
  },
  {
    title: "An entrancing voice",
    content: "You hear a song, a sweet melody that seems to lull you in ",
    actions: [
      {
        text: "You head towards the provenance of this song ",
        sceneKey: "6QHCEM8VprXJRh43-oriO",
      },
      {
        text: "You choose to ignore the song an set camp  and try your in the morning",
        sceneKey: "cTbuqI9NR2QhSMfZnPkht",
      },
    ],
    storyKey: "mcDZQvTdmUCJ7laL8yyLq",
    builderParams: {
      position: {
        x: 1330.3656622677001,
        y: 657.0348339402199,
      },
    },
    key: "HD0HctAmKp075yXwujHOW",
  },
  {
    title: "A lonlely island",
    content:
      "You reach an island of very small stature in which you can see a distant silouhette",
    actions: [
      {
        text: "You walk towards the silouhette ",
        sceneKey: "gB_MDqzZpR4TLm7DeqNvJ",
      },
      {
        text: "You go back",
        sceneKey: "QzcLyUR6XigrC1cXi-wit",
      },
    ],
    storyKey: "mcDZQvTdmUCJ7laL8yyLq",
    builderParams: {
      position: {
        x: 3201.882376664204,
        y: 664.7607110209453,
      },
    },
    key: "OAG0l62bXL3H2FFd8nkP0",
  },
  {
    title: "A way in ",
    content:
      "You see a small embarcation which is gonna help you go towards the center of the Lake ",
    actions: [
      {
        text: "You go in and row towards the center of the Lake",
        sceneKey: "OAG0l62bXL3H2FFd8nkP0",
      },
      {
        text: "Go back on your tracks",
        sceneKey: "6QHCEM8VprXJRh43-oriO",
      },
    ],
    storyKey: "mcDZQvTdmUCJ7laL8yyLq",
    builderParams: {
      position: {
        x: 2654.6927733582834,
        y: 638.2027521759233,
      },
    },
    key: "QzcLyUR6XigrC1cXi-wit",
  },
  {
    title: "END OF CHAPTER ONE ",
    content: "END OF CHAPTER ONE ",
    actions: [],
    storyKey: "mcDZQvTdmUCJ7laL8yyLq",
    builderParams: {
      position: {
        x: 5399.835683990683,
        y: 770.1548463390277,
      },
    },
    key: "WTLrmPxeGXZRfnCk6DDk5",
  },
  {
    title: "An ancient grove",
    content:
      "When heading towards you arrive in a millenial grove which is enlightened by the moonlight ",
    actions: [
      {
        text: "You stop a few minutes to take on this beautiful sight",
        sceneKey: "cTbuqI9NR2QhSMfZnPkht",
      },
      {
        text: "You continue walking while admiring the ancient trees ",
        sceneKey: "HD0HctAmKp075yXwujHOW",
      },
      {
        text: "You go back on your tracks",
        sceneKey: "27of_GQ4ZnaMU5BeQ5qPx",
      },
    ],
    storyKey: "mcDZQvTdmUCJ7laL8yyLq",
    builderParams: {
      position: {
        x: 557.0940014418009,
        y: 608.4901695260022,
      },
    },
    key: "cTbuqI9NR2QhSMfZnPkht",
  },
  {
    title: "A peculiar being",
    content:
      "You keep walking and you stop dead on your tracks because you can finally see the provenance of those songs. It's a chimerical being half woman with long aubrun hair and half fish with a long tail which end in a large fin. A CREATURE OF LEGENDS, A SIREN.",
    actions: [
      {
        text: "You walk towards the creature waiting foe an eventual interaction",
        sceneKey: "lXYahsi23G1QL766LaVK4",
      },
      {
        text: "You go back on your tracks",
        sceneKey: "OAG0l62bXL3H2FFd8nkP0",
      },
    ],
    storyKey: "mcDZQvTdmUCJ7laL8yyLq",
    builderParams: {
      position: {
        x: 3786.151182385489,
        y: 587.6634305273312,
      },
    },
    key: "gB_MDqzZpR4TLm7DeqNvJ",
  },
  {
    title: "A foggy path ",
    content:
      "Continuing to walk towards the mountain the fog becomes thicker and thicker. ",
    actions: [
      {
        text: "I light a candle and try to find my way through the fog.",
      },
      {
        text: "I look a the stars far far above and try to find my way using the oldest map in the world",
      },
      {
        text: "You open the ancient scroll which contains an ancient map that allowed to make your way to the mountain",
      },
      {
        text: "You go back on you tracks and try to visit other places before heading to the mountain",
      },
    ],
    storyKey: "mcDZQvTdmUCJ7laL8yyLq",
    builderParams: {
      position: {
        x: 805.8201003076252,
        y: -420.794517951372,
      },
    },
    key: "hTv4yXZ-8hRFIzQ3lY0Hx",
  },
  {
    title: "Friend or foe ?",
    content:
      "You're now very close to the siren you can have a close-up of it's peculiar attributes as the color of her scales which is a shimery azure blue and it's golden eyes in which a vertical slit can be seen.",
    actions: [
      {
        text: "You try speaking to her",
        sceneKey: "mysJlUr2Q9wfrmH2YF7jq",
      },
      {
        text: "You go back",
        sceneKey: "gB_MDqzZpR4TLm7DeqNvJ",
      },
    ],
    storyKey: "mcDZQvTdmUCJ7laL8yyLq",
    builderParams: {
      position: {
        x: 4362.235108592576,
        y: 615.6756113629318,
      },
    },
    key: "lXYahsi23G1QL766LaVK4",
  },
  {
    title: "An unexpected exchange",
    content:
      "You ask her what she is currently doing here and what her name is ?",
    actions: [
      {
        text: "She stops singing and gazes at you with an inquisitive look",
        sceneKey: "WTLrmPxeGXZRfnCk6DDk5",
      },
      {
        text: "You go back ",
        sceneKey: "lXYahsi23G1QL766LaVK4",
      },
    ],
    storyKey: "mcDZQvTdmUCJ7laL8yyLq",
    builderParams: {
      position: {
        x: 4907.292627656529,
        y: 662.2775430014435,
      },
    },
    key: "mysJlUr2Q9wfrmH2YF7jq",
  },
];

const IMPORTED_STORY: StoryFromImport = {
  story: {
    ...DEMO_STORY,
    title: "[DEMO] The Enchanted Mountain (imported)",
    type: "imported",
    author: { username: "gorgious", key: "5XX9VcZt1sVrm2mtylB7g" },
  },
  scenes: DEMO_SCENES,
};

export const DEMO_IMPORTED_JSON = JSON.stringify(IMPORTED_STORY);
