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

// These are globals intentionally shared with the test suite and scene.js.
// `printed` is reassigned (not just mutated) by each test case so it must be
// var, not const. All others are write-once flags/stubs.
var printed = [];
var headless = true;
var _global = this;

var debughelp = function debughelp() {
    debugger;
};

var printx = function printx(msg, parent) {
    printed.push(msg);
};

function println(msg, parent) {
    printed.push(msg);
    printed.push("<br>");
}

function printParagraph(msg, parent) {
    if (msg === "") return;
    printed.push("<p>");
    printed.push(msg);
    printed.push("</p>");
}

var isRhino = typeof java !== "undefined";

var clearScreen = function clearScreen(code) { code.call(); };
var saveCookie = function(callback) { if (callback) callback.call(); };
var loadTempStats = function(stats, callback) { if (callback) callback.call(null, stats); };
var clearTemp = function() {};
var doneLoading = function() {};
var printFooter = function() {};
var printShareLinks = function() {};
var printLink = function() {};
var kindleButton = function() {};
var printImage = function() {};
var showPassword = function() {};
var printDiscount = function() {};
var achieve = function() {};
var changeBackgroundColor = function() {};

var isRegistered = function() { return false; };
var isRegisterAllowed = function() { return false; };
var isFullScreenAdvertisingSupported = function() { return false; };
var isRestorePurchasesSupported = function() { return false; };
var areSaveSlotsSupported = function() { return false; };
var isAdvertisingSupported = function() { return false; };
var isPrerelease = function() { return false; };

var showFullScreenAdvertisementButton = function(message, callback) { callback(); };

function fileExists(filePath) {
    if (isRhino) {
        return new java.io.File(filePath).exists();
    } else {
        return fs.existsSync(filePath);
    }
}

function fileLastMod(filePath) {
    if (isRhino) {
        return new java.io.File(filePath).lastModified();
    } else {
        if (fs.existsSync(filePath)) return fs.statSync(filePath).mtime.getTime();
        return 0;
    }
}

function mkdirs(filePath) {
    if (isRhino) {
        new java.io.File(filePath).mkdirs();
    } else {
        if (!fs.existsSync(filePath)) {
            const parentDir = path.dirname(filePath);
            if (!fs.existsSync(parentDir)) {
                mkdirs(parentDir);
            }
            fs.mkdirSync(filePath);
        }
    }
}

function slurpFile(name, throwOnError) {
    return slurpFileLines(name, throwOnError).join('\n');
}

function slurpFileLines(name, throwOnError) {
    if (isRhino) {
        const lines = [];
        const reader = new java.io.BufferedReader(
            new java.io.InputStreamReader(new java.io.FileInputStream(name), "UTF-8")
        );
        let i = 0;
        let line;
        while (!!(line = reader.readLine())) {
            if (i === 0 && line.charCodeAt(0) === 65279) line = line.substring(1);
            if (throwOnError) {
                const invalidCharacter = line.match(/^(.*)\ufffd/);
                if (invalidCharacter) {
                    throw new Error(
                        `${name} line ${i + 1}: invalid character. ` +
                        `(ChoiceScript text should be saved in the UTF-8 encoding.)\n` +
                        invalidCharacter[0]
                    );
                }
            }
            lines.push(line);
            i++;
        }
        return lines;
    } else {
        const blob = fs.readFileSync(name, "utf-8");
        const lines = blob.split(/\r?\n/);
        // Strip byte order mark from first line if present (charCode 65279 = U+FEFF).
        if (lines[0].charCodeAt(0) === 65279) lines[0] = lines[0].substring(1);
        if (throwOnError) {
            for (let i = 0; i < lines.length; i++) {
                const line = lines[i];
                const invalidCharacter = line.match(/^(.*)\ufffd/);
                if (invalidCharacter) {
                    throw new Error(
                        `${name} line ${i + 1}: invalid character. ` +
                        `(ChoiceScript text should be saved in the UTF-8 encoding.)\n` +
                        invalidCharacter[0]
                    );
                }
            }
        }
        return lines;
    }
}

function slurpImage(name) {
    const blob = fs.readFileSync(name);
    let dataType;
    if (/\.jpe?g$/i.test(name)) {
        dataType = 'image/jpeg';
    } else if (/\.png/i.test(name)) {
        dataType = 'image/png';
    }
    return `data:${dataType};base64,${Buffer.from(blob).toString('base64')}`;
}

function initStore() { return false; }
