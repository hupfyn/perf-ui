var fs = require('fs')
var pug = require('pug')

async function getScriptSource() {
    return await fs.readFileSync('tests/resources/report_module/source_audit_script.js', 'utf8')
}

async function getPageScore(driver) {
    var scriptSource = await getScriptSource()
    var pageScoreResult = await driver.executeScript('return ' + scriptSource).then((state) => { return state })
    return pageScoreResult
}

function generateHTMLreport(pageScoreResult, pageName) {
    var html = pug.renderFile('template/index.pug', pageScoreResult)
    fs.writeFile('/tmp/reports/' + pageName + '.html', html, function () { })
}

module.exports = {
    runPageAudit: async function (driver, pageName) {
        var score = await getPageScore(driver)
        generateHTMLreport(score, pageName)
    }
}