nav = new SceneNavigator([
 "startup",
 "animal",
 "variables",
 "gosub",
 "ending",
 "death"
]);
stats = {
 "choice_title": "My First ChoiceScript Game",
 "leadership": "50",
 "strength": "50"
};
purchases = {
 "fake:adfree": "adfree",
 "fake:skiponce": "skiponce"
};
achievements = [];
nav.setStartingStatsClone(stats);if (achievements.length) {
  nav.loadAchievements(achievements);
}
if (nav.loadProducts) nav.loadProducts([], purchases);

isCogPublished = true;

