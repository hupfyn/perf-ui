/*
   Copyright 2018 getcarrier.io

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/

$RefParser = require('json-schema-ref-parser');

async function resolveRef(filepath, logger) {
    try {
        var result = await $RefParser.dereference(filepath).catch((err) => { logger.error(err.message); logger.debug(err); process.exit() })
        logger.debug(JSON.stringify(result))
        return result
    }
    catch (error) {
        logger.error(error)
    }
}

module.exports = { resolveRef };