var fs = require('fs')
var pug = require('pug')

async function getScriptSource() {
    return await fs.readFileSync('/tests/resources/report_module/source_audit_script.js', 'utf8')
}

async function getPageScore(driver) {
    var scriptSource = await getScriptSource()
    var pageScoreResult = await driver.executeScript('return ' + scriptSource).then((state) => {
        return state
    })
    await fs.writeFileSync('result.json', JSON.stringify(pageScoreResult))
    return pageScoreResult
}

function generateHTMLreport(pageScoreResult, pageName) {
    var html = pug.renderFile('/tests/template/index.pug', pageScoreResult)
    fs.writeFile('/tmp/reports/' + pageName + '.html', html, function () {})
}

module.exports = {
    runPageAudit: async function (driver, pageName) {
            var score = await getPageScore(driver)
            var timing = await driver.executeScript('return performance.timing').then((result)=>{return result})
            var frame = await fs.readdirSync('/tmp/reports/frame/')
            var imageBase64Aray = []
            for (let path of frame) {
                var image64 = await fs.readFileSync('/tmp/reports/frame/' + path, 'base64')
                imageBase64Aray.push(image64)
                await fs.unlinkSync('/tmp/reports/frame/' + path)
            }

            score.frameBase64Array = imageBase64Aray
            var testMisha = [{
                    start: score.advice.timings.navigationTimings.navigationStart,
                    end: score.advice.timings.navigationTimings.fetchStart,
                    keyframe: true,
                    name: "Navigation Start",
                    image: 0
                },
                {
                    value: score.advice.timings.navigationTimings.fetchStart,
                    tooltip: score.advice.timings.navigationTimings.domainLookupStart - score.advice.timings.navigationTimings.fetchStart,
                    keyframe: true,
                    name: "Fetch Start",
                    image: 1
                },
                {
                    value: score.advice.timings.navigationTimings.domainLookupStart,
                    tooltip: score.advice.timings.navigationTimings.domainLookupEnd - score.advice.timings.navigationTimings.domainLookupStart,
                    keyframe: false,
                    name: "Domain Lookup Start",
                    image: false
                },
                {
                    value: score.advice.timings.navigationTimings.domainLookupEnd,
                    tooltip: score.advice.timings.navigationTimings.connectStart - score.advice.timings.navigationTimings.domainLookupEnd,
                    keyframe: false,
                    name: "Domain Lookup End",
                    image: false
                },
                {
                    value: score.advice.timings.navigationTimings.connectStart,
                    tooltip: score.advice.timings.navigationTimings.connectEnd - score.advice.timings.navigationTimings.connectStart,
                    keyframe: false,
                    name: "Connect Start",
                    image: false
                },
                {
                    value: score.advice.timings.navigationTimings.connectEnd,
                    tooltip: score.advice.timings.navigationTimings.requestStart - score.advice.timings.navigationTimings.connectEnd,
                    keyframe: false,
                    name: "Connect End",
                    image: false
                },
                {
                    value: score.advice.timings.navigationTimings.requestStart,
                    tooltip: score.advice.timings.navigationTimings.responseStart - score.advice.timings.navigationTimings.requestStart,
                    keyframe: false,
                    name: "Request Start",
                    image: false
                },
                {
                    value: score.advice.timings.navigationTimings.responseEnd,
                    tooltip: score.advice.timings.navigationTimings.domLoading - score.advice.timings.navigationTimings.responseEnd,
                    keyframe: false,
                    name: "Response End",
                    image: false
                },
                {
                    value: score.advice.timings.navigationTimings.domLoading,
                    tooltip: score.advice.timings.navigationTimings.domInteractive - score.advice.timings.navigationTimings.domLoading,
                    keyframe: true,
                    name: "Dom Loading",
                    image: 2
                },
                {
                    value: score.advice.timings.navigationTimings.domInteractive,
                    tooltip: score.advice.timings.navigationTimings.domContentLoadedEventStart - score.advice.timings.navigationTimings.domInteractive,
                    keyframe: true,
                    name: "Dom Interactive",
                    image: 3
                },
                {
                    value: score.advice.timings.navigationTimings.domContentLoadedEventStart,
                    tooltip: score.advice.timings.navigationTimings.domContentLoadedEventEnd - score.advice.timings.navigationTimings.domContentLoadedEventStart,
                    keyframe: true,
                    name: "domContentLoadedEventStart",
                    image: 4
                },
                {
                    value: score.advice.timings.navigationTimings.domContentLoadedEventEnd,
                    tooltip: score.advice.timings.navigationTimings.domComplete - score.advice.timings.navigationTimings.domContentLoadedEventEnd,
                    keyframe: true,
                    name: "domContentLoadedEventEnd",
                    image: 5
                },
                {
                    value: score.advice.timings.navigationTimings.domComplete,
                    tooltip: score.advice.timings.navigationTimings.loadEventStart - score.advice.timings.navigationTimings.domComplete,
                    keyframe: true,
                    name: "domComplete",
                    image: 6
                },
                {
                    value: score.advice.timings.navigationTimings.loadEventStart,
                    tooltip: score.advice.timings.navigationTimings.loadEventEnd - score.advice.timings.navigationTimings.loadEventStart,
                    keyframe: true,
                    name: "loadEventStart",
                    image: 7
                },
                {
                    value: score.advice.timings.navigationTimings.loadEventEnd,
                    tooltip: score.advice.timings.navigationTimings.loadEventEnd,
                    keyframe: true,
                    name: "loadEventEnd",
                    image: 8
                }
            ]
            score.testMisha = JSON.stringify(testMisha)
            score.ReportTiming = JSON.stringify(timing)
            // score.myLen = score.advice.timings.navigationTimings.loadEventEnd
            generateHTMLreport(score, pageName)
            return "Report was generated"
        
    }
}