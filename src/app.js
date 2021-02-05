const fetch = require('node-fetch');
const base64 = require('base-64');
const child_process = require("child_process");

///////////////////// METHODS ///////////////////// 
/**
 * runTest
 * @param {*} action 
 * @param {*} settings 
 */
async function runTest(action, settings) {
    /**
     * This command will execute sonar-scanner cli.
     * Parameter are as following cli example:
     * sonar-scanner \
        -Dsonar.projectKey=kaholo_example \
        -Dsonar.sources=. \
        -Dsonar.host.url=http://localhost:9000 \
        -Dsonar.login=###########
     */
    const sonarScanner = settings.SONAR_SCANNER || 'sonar-scanner';
    const hostURL = action.params.HOST_URL || settings.HOST_URL;
    const login = action.params.LOGIN || settings.LOGIN;

    const cmdArgs = [
        sonarScanner
    ];

    if (action.params.PROJECT_KEY) {
        cmdArgs.push(`-Dsonar.projectKey=${action.params.PROJECT_KEY}`);
    }

    if (action.params.SOURCES) {
        cmdArgs.push(`-Dsonar.sources=${action.params.SOURCES}`);
    }

    if (hostURL) {
        cmdArgs.push(`-Dsonar.host.url=${hostURL}`);
    }

    if (login) {
        cmdArgs.push(`-Dsonar.login=${login}`);
    }

    const command = cmdArgs.join(' ');
    return new Promise((resolve, reject) => {
        child_process.exec(command, {
            cwd: action.params.workDir || null
        }, (error, stdout, stderr) => {
            if (error) {
                console.log(`${stdout}`)
                return reject(`exec error: ${error}`);
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`);
            }
            return resolve(stdout);
        });
    });
}

/**
 * create new project
 * @param {*} action 
 * @param {*} settings 
 */
async function createNewProject(action, settings) {
    /**
     * Creates a new Project 
     * Based on Docs here: https://sonarcloud.io/web_api/api/projects
     */
    const hostURL = action.params.HOST_URL || settings.HOST_URL;
    const projectName = action.params.NAME;
    const organization = action.params.ORGANIZATION || undefined;
    const projectKey = action.params.PROJECT_KEY;
    const visability = action.params.VISIBILITY;
    const userToken = settings.restToken;

    let url = `${hostURL}/api/projects/create?name=${projectName}&project=${projectKey}&visability=${visability}`;
    if (organization) {
        url += `&organization=${organization}`
    }
    return await globalRestAPI("POST", url, userToken);
}

/**
 * search users
 * @param {*} action 
 * @param {*} settings 
 */
async function searchUsers(action, settings) {
    /**
     * Search users
     * Based on Docs here: https://sonarcloud.io/web_api/api/users
     */
    const hostURL = action.params.HOST_URL || settings.HOST_URL;
    const pageNumber = action.params.PAGE_NUMBER || 1;
    const pageSize = action.params.PAGE_SIZE;
    const searchText = action.params.SEARCH_TEXT;
    const userToken = settings.restToken;

    let url = `${hostURL}/api/users/search?p=${pageNumber}&ps=${pageSize}&q=${searchText}`;
    return await globalRestAPI("GET", url, userToken);
}

///////////////////// HELPERS ///////////////////// 
/**
 * globalRestAPI
 * @param {*} method 
 * @param {*} url 
 * @param {*} userToken 
 */
async function globalRestAPI(method, url, userToken) {
    /**
     * Send Default API Request
     */
    let user = base64.encode(userToken + ":");
    let request = {
        method: `${method}`,
        'headers': {
            'Authorization': `Basic ${user}`
        }
    };
    response = await fetch(url, request);
    if (!response.ok) {
        throw response
    }
    return response.json();
}

module.exports = {
    RUN_TEST: runTest,
    CREATE_PROJECT: createNewProject,
    SEARCH_USERS: searchUsers
};