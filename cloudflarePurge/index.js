"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var task = require("azure-pipelines-task-lib/task");
var request = require("request");
function run() {
    return __awaiter(this, void 0, void 0, function () {
        var zoneName, userName, apiKey, headers_1;
        return __generator(this, function (_a) {
            try {
                zoneName = task.getInput('zonename', true);
                userName = task.getInput('username', true);
                apiKey = task.getInput('apikey', true);
                headers_1 = {
                    "X-Auth-Email": userName,
                    "X-Auth-Key": apiKey,
                    "Content-Type": "application/json"
                };
                request({ url: "https://api.cloudflare.com/client/v4/zones?name=" + zoneName + "&status=active", headers: headers_1 }, function (error, response, body) {
                    if (error)
                        task.setResult(task.TaskResult.Failed, error);
                    else {
                        var json = JSON.parse(body);
                        if (!json.success)
                            apiFail(json);
                        else {
                            var json_1 = JSON.parse(body);
                            var zoneId = json_1.result[0].id;
                            clearCache(zoneId, headers_1);
                        }
                    }
                });
            }
            catch (err) {
                fail(err.message);
            }
            return [2 /*return*/];
        });
    });
}
function apiFail(json) {
    json.errors.forEach(function (error) { return console.log(error.message); });
    fail(json.errors[0].message);
}
function fail(message) {
    task.setResult(task.TaskResult.Failed, message);
}
function clearCache(zoneId, headers) {
    request({ method: 'POST', url: "https://api.cloudflare.com/client/v4/zones/" + zoneId + "/purge_cache", headers: headers, body: JSON.stringify({ purge_everything: true }) }, function (error, _, body) {
        if (error)
            task.setResult(task.TaskResult.Failed, error);
        else {
            var json = JSON.parse(body);
            if (!json.success)
                apiFail(json);
            else {
                console.log("Successfully purged cache");
            }
        }
    });
}
run();