/**
 * Copyright 2018, Google, Inc.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

// [START dlp_inspect_string]
// Imports the Google Cloud Data Loss Prevention library
const DLP = require('@google-cloud/dlp');

/**
 *  Inspects the provided text.
 *
 * @param projectId {string} Your Google Cloud Project ID.
 * @param textToInspect {string} The text to inspect.
 * @returns {object} The InspectContentResponse.
 */
async function main(
  projectId = 'YOUR_PROJECT_ID',
  textToInspect = 'My name is Gary and my email is gary@example.com'
) {
  // Instantiates a client
  const dlp = new DLP.DlpServiceClient();

  // Construct request
  const request = {
    parent: dlp.projectPath(projectId),
    item: {
      value: textToInspect,
    },
    inspectConfig: {
      // The infoTypes of information to match
      infoTypes: [
        {name: 'PHONE_NUMBER'},
        {name: 'EMAIL_ADDRESS'},
        {name: 'CREDIT_CARD_NUMBER'},
      ],
      // Whether to include the matching string
      includeQuote: true,
    },
  };

  // Run request
  const [inspectResponse] = await dlp.inspectContent(request);
  const findings = inspectResponse.result.findings;
  console.log(`Findings: ${!findings.length ? 'None' : ''}`);
  findings.forEach(finding => {
    console.log(`\tQuote: ${finding.quote}`);
    console.log(`\tInfo type: ${finding.infoType.name}`);
    console.log(`\tLikelihood: ${finding.likelihood}\n`);
  });
  return inspectResponse;
}
// [END dlp_inspect_string]

main(...process.argv.slice(2));
