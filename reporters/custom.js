'use strict';

const Mocha = require('mocha');
const axios = require('axios');
const moment = require('moment');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

const TESTRAIL_HOST = 'https://nundmrzo.testrail.io';
const USER_NAME = 'mucho.gracio@gmail.com';
const PASSWORD = 'q1w2e3r4';

const Testrail = require('testrail-api');
const testrail = new Testrail({
    host: TESTRAIL_HOST,
    user: USER_NAME,
    password: PASSWORD
});


const {
    EVENT_RUN_BEGIN,
    EVENT_RUN_END,
    EVENT_TEST_FAIL,
    EVENT_TEST_PASS,
    EVENT_SUITE_BEGIN,
    EVENT_SUITE_END
} = Mocha.Runner.constants;
let collected_tests = [];
// let results = [];
let resultsObj = {};

// this reporter outputs test results, indenting two spaces per suite
class MyReporter {
    constructor(runner) {
        this._indents = 0;
        const stats = runner.stats;

        runner
            .once(EVENT_RUN_BEGIN, () => {
                console.log('start');
            })
            .on(EVENT_SUITE_BEGIN, () => {
                this.increaseIndent();
            })
            .on(EVENT_SUITE_END, () => {
                this.decreaseIndent();
            })
            .on(EVENT_TEST_PASS, test => {
                // Test#fullTitle() returns the suite name(s)
                // prepended to the test title
                let titlePath = test.titlePath();
                let suiteTitle = titlePath[0];
                let testCaseTitle = titlePath[1];
                let caseId = testCaseTitle.split(" ")[0].replace( /^\D+/g, '');
                let titleWithoutCaseId = testCaseTitle.split(caseId)[1];

                collected_tests.push({
                    suiteTitle: suiteTitle,
                    testCaseTitle: testCaseTitle,
                    caseId: caseId,
                    titleWithoutCaseId: titleWithoutCaseId,
                    pass:true,
                    pending: false,
                    screenshotPath: false,
                    stackTrace: false,
                    errorMessage: false
                });
                let res = {
                    "case_id": caseId,
                    "status_id": 1,
                    "comment": "This test passed",
                    "uploaded": false
                };
                resultsObj[res.case_id] = res;
                // results.push(res);
                console.log(`${this.indent()}pass: ${test.fullTitle()}`);
            })
            .on(EVENT_TEST_FAIL, (test, err) => {
                console.log(
                    `${this.indent()}fail: ${test.fullTitle()} - error: ${err.message}`
                );
                let titlePath = test.titlePath();
                let suiteTitle = titlePath[0];
                let suiteScreenshotFolder = suiteTitle.split(" ")[0].toLowerCase() + suiteTitle.split(" ")[1]
                let testCaseTitle = titlePath[1];
                console.log("-----------------suiteTitle: ",suiteTitle);
                console.log("-----------------testCaseTitle: ",testCaseTitle);

                let caseId = testCaseTitle.split(" ")[0].replace( /^\D+/g, '');

                let titleWithoutCaseId = testCaseTitle.split(caseId)[1];
                let screenshotPath =`./cypress/screenshots/${suiteScreenshotFolder}.feature/${suiteTitle} -- ${testCaseTitle} (failed).png`
                let stackTrace = test.err.stack;
                let errorMessage = test.err.message;

                collected_tests.push({
                    suiteTitle: suiteTitle,
                    testCaseTitle: testCaseTitle,
                    caseId: caseId,
                    titleWithoutCaseId: titleWithoutCaseId,
                    pass: false,
                    pending: false,
                    screenshotPath: screenshotPath,
                    stackTrace: stackTrace,
                    errorMessage: errorMessage
                });
                let res = {"case_id": caseId,
                    "status_id": 5,
                    "comment": errorMessage +"\n\n"+stackTrace,
                    // "comment": errorMessage,
                    screenshotPath: screenshotPath,
                    stackTrace: stackTrace,
                    errorMessage: errorMessage
                };
                resultsObj[res.case_id] = res;
                // results.push(res);
            })
            .once(EVENT_RUN_END, () => {
                let gotCases = Object.keys(resultsObj);
                console.log("**************************************** ",gotCases);
                if (process.env.TESTRAIL){
                    testrail.getCases(1, { suite_id: 1}, function (err, getCasesResponse, cases) {
                        // console.log(cases);
                        let caseIds = cases.map(x => x.id);
                        let dateStr = moment().format('MMM Do YYYY, HH:mm (Z)');
                        let casesFoundInTests = Object.keys(resultsObj);
                        console.log("casesFoundInTests.length: ",casesFoundInTests.length);
                        console.log("caseIds.length: ",caseIds.length);
                        if (caseIds.length != casesFoundInTests.length){
                            console.log("did not collect all tests yet")
                            return
                        }else{
                            console.log("got all test cases, start uploading to testrail");
                        }
                        // TODO add auto add cases if they are not found on testrail
                        testrail.addRun(1,{
                            suite_id: 1,
                            name: `nightly run-${dateStr}`,
                            description: `run-${dateStr} description`,
                            include_all: false,
                            case_ids: caseIds
                        }, function (err, addRunResponse, run) {
                            let runId = run.id;

                            // get tests
                            testrail.getTests(runId, {}, function (err, getTestsResponse, tests) {
                                for (let i = 0; i < tests.length; i++){
                                    let test = tests[i];
                                    console.log(`${test.case_id} getTests, test: `,test.case_id);
                                    // add results to run
                                    if (resultsObj[test.case_id]){
                                        if (! resultsObj[test.case_id]["uploaded"]){
                                            console.log("got test case id in resultsObj that was not uploaded");
                                            testrail.addResult(test.id, resultsObj[test.case_id], async function (err, addResultResponse, addResultObject) {
                                                console.log("add result response: ",addResultResponse.statusCode);
                                                resultsObj[test.case_id]["uploaded"] = true;
                                                // console.log(`added result to test id: ${test.id}`,addResultObject);
                                                console.log(`added result to test id: ${test.id}`);
                                                // console.log("result from adding result to test run: ", addResultObject);
                                                if (addResultObject.status_id==5){
                                                    let savedResult = resultsObj[test.case_id];
                                                    console.log("test.case_id: ",test.case_id);
                                                    // console.log("savedResult: ",savedResult);
                                                    if (savedResult){
                                                        let screenshotPath = resultsObj[test.case_id].screenshotPath;
                                                        console.log("screenshotPath: ",screenshotPath);
                                                        if (screenshotPath){
                                                            // upload screenshot, timeout for file save
                                                            await uploadAttachment(addResultObject.id, screenshotPath);
                                                        }
                                                    }
                                                }
                                            });
                                        }else{
                                            console.log("TEST WAS ALREADY UPLOADED: ",test.case_id);
                                            console.log("resultsObj: ",resultsObj);
                                        }
                                    }
                                }
                            });
                        });
                    });
                }
                console.log(`end: ${stats.passes}/${stats.passes + stats.failures} ok`);
                // empty variables
            });
    }

    indent() {
        return Array(this._indents).join('  ');
    }

    increaseIndent() {
        this._indents++;
    }

    decreaseIndent() {
        this._indents--;
    }
}

async function uploadAttachment(resultId, screenshotPath){
    let curlStr = `curl -H "Content-Type: multipart/form-data" -u "${USER_NAME}:${PASSWORD}" -F "attachment=@${screenshotPath}" "https://nundmrzo.testrail.io/index.php?/api/v2/add_attachment_to_result/${resultId}"`
    // console.log("curlStr: ",curlStr);
    const { stdout, stderr } =await exec(curlStr);
    // console.log('stdout:', stdout);
    // console.log('stderr:', stderr);
}



module.exports = MyReporter;