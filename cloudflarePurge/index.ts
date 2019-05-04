import task = require('azure-pipelines-task-lib/task');
import request = require('request');

async function run() {
    try {
        const zoneName: string = task.getInput('zonename', true);
        const userName: string = task.getInput('username', true);
        const apiKey: string = task.getInput('apikey', true);

        const headers = {
            "X-Auth-Email": userName,
            "X-Auth-Key": apiKey,
            "Content-Type": "application/json"
        };

        request({url: `https://api.cloudflare.com/client/v4/zones?name=${zoneName}&status=active`, headers: headers}, (error, response, body) => {
            if (error)
                task.setResult(task.TaskResult.Failed, error);
            else {
                const json = JSON.parse(body);
                if (!json.success) 
                    apiFail(json);
                else {
                    const json = JSON.parse(body);
                    const zoneId = json.result[0].id;
                    clearCache(zoneId, headers);
                }
            }
        });
    }
    catch (err) {
        fail(err.message);
    }
}

function apiFail(json: any) {
    json.errors.forEach((error: any) => console.log(error.message));
    fail(json.errors[0].message);
}

function fail(message: string) {
    task.setResult(task.TaskResult.Failed, message)
}

function clearCache(zoneId: string, headers: any) {
    request({method: 'POST', url: `https://api.cloudflare.com/client/v4/zones/${zoneId}/purge_cache`, headers: headers, body: JSON.stringify({ purge_everything: true}) }, (error, _, body) => {
        if (error)
            task.setResult(task.TaskResult.Failed, error);
        else {
            const json = JSON.parse(body);
            if (!json.success) 
                apiFail(json);
            else {
                console.log("Successfully purged cache");
            }
        }
    });
}

run();