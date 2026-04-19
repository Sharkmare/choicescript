/*
 * Copyright 2010 by Dan Fabulich.
 *
 * Dan Fabulich licenses this file to you under the
 * ChoiceScript License, Version 1.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *  http://www.choiceofgames.com/LICENSE-1.0.txt
 *
 * See the License for the specific language governing
 * permissions and limitations under the License.
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
 * either express or implied.
 */
function SceneNavigator(sceneList) {
    this.setSceneList(sceneList);
    this.startingStats = {};
}

SceneNavigator.prototype.setSceneList = function setSceneList(sceneList) {
    this._sceneList = sceneList;
    this._sceneMap = {};
    for (let i = 0; i < sceneList.length - 1; i++) {
        const scene1 = sceneList[i];
        const scene2 = sceneList[i + 1];
        this._sceneMap[scene1] = scene2;
    }
    this._startupScene = sceneList[0];
};

SceneNavigator.prototype.nextSceneName = function nextSceneName(currentSceneName) {
    const nextScene = this._sceneMap[currentSceneName];
    //if (!nextScene) throw new Error("No scene follows " + currentSceneName);
    return nextScene;
};

SceneNavigator.prototype.getStartupScene = function getStartupScene() {
    return this._startupScene;
};

SceneNavigator.prototype.setStartingStatsClone = function setStartingStatsClone(stats) {
    this.startingStats = {};
    for (const key in stats) {
        this.startingStats[key] = stats[key];
    }
};

SceneNavigator.prototype.resetStats = function resetStats(stats) {
    for (const key in stats) {
        delete stats[key];
    }
    for (const key in this.startingStats) {
        stats[key] = this.startingStats[key];
    }
    this.bugLog = [];
};

SceneNavigator.prototype.repairStats = function repairStats(stats) {
    for (const key in this.startingStats) {
        const startingStat = this.startingStats[key];
        if (startingStat === null || startingStat === undefined) continue;
        if (typeof stats[key] === "undefined" || stats[key] === null) {
            stats[key] = this.startingStats[key];
        }
    }
};

SceneNavigator.prototype.bugLog = [];
SceneNavigator.prototype.achievements = {};
SceneNavigator.prototype.achievementList = [];
SceneNavigator.prototype.achieved = {};
SceneNavigator.prototype.products = {};

SceneNavigator.prototype.loadAchievements = function(achievementArray) {
    if (!achievementArray) return;
    this.achievements = {};
    this.achievementList = [];
    for (let i = 0; i < achievementArray.length; i++) {
        const achievement = achievementArray[i];
        const achievementName = achievement[0];
        const visible = achievement[1];
        const points = achievement[2];
        const title = achievement[3];
        const earnedDescription = achievement[4];
        const preEarnedDescription = achievement[5];
        this.achievements[achievementName] = {
            visible,
            points,
            title,
            earnedDescription,
            preEarnedDescription
        };
        this.achievementList.push(achievementName);
    }
};

SceneNavigator.prototype.loadProducts = function(productArray, purchaseMap) {
    if (!productArray && !purchaseMap) return;
    if (!productArray) productArray = [];
    this.products = {};
    for (let i = 0; i < productArray.length; i++) {
        this.products[productArray[i]] = {};
    }
    for (const scene in purchaseMap) {
        const product = purchaseMap[scene];
        this.products[product] = {};
    }
};
