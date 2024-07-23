db.aggregatedScenes.aggregate([
  {
    $unwind: "$actions",
  },
  {
    $replaceRoot: {
      newRoot: {
        $mergeObjects: [
          {
            parentSceneKey: "$key",
          },
          "$actions",
        ],
      },
    },
  },
  {
    $out: {
      db: "dataExports",
      coll: "aggregatedActions",
    },
  },
]);
