db.stories.aggregate([
  {
    $unwind: "$scenes",
  },
  {
    $replaceRoot: {
      newRoot: "$scenes",
    },
  },
  {
    $out: {
      db: "dataExports",
      coll: "aggregatedScenes",
    },
  },
]);
