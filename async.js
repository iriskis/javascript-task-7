'use strict';

exports.isStar = true;
exports.runParallel = runParallel;

/** Функция паралелльно запускает указанное число промисов
 * @param {Array} jobs – функции, которые возвращают промисы
 * @param {Number} parallelNum - число одновременно исполняющихся промисов
 * @param {Number} timeout - таймаут работы промиса
 * @returns {Promise}
 */
function runParallel(jobs, parallelNum, timeout = 1000) {
    return new Promise(resolve => {
        if (!jobs.length) {
            resolve([]);

            return;
        }
        const results = [];
        let countRun = 0;
        let countFinished = 0;

        while (countRun < parallelNum) {
            run(countRun++);
        }

        function run(jobsNumber) {
            new Promise((resolveJob, rejectJob) => {
                jobs[jobsNumber]().then(resolveJob, rejectJob);
                setTimeout(rejectJob, timeout, new Error('Promise timeout'));
            })
                .then(result => writeResult(result, jobsNumber),
                    result => writeResult(result, jobsNumber)
                );
        }

        function writeResult(result, jobsNumber) {
            results[jobsNumber] = result;
            countFinished++;
            if (countFinished === jobs.length) {
                resolve(results);

                return;
            }
            if (countRun < jobs.length) {
                run(countRun++);
            }
        }
    });
}
