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

// [START dlp_inspect_image_file]
// Imports the Google Cloud Data Loss Prevention library
const DLP = require('@google-cloud/dlp');

// Import other required libraries
const fs = require('fs');

/**
 * Inspects the specified image file.
 *
 * @param projectId {string} Your Google Cloud Project ID.
 * @param filepath {string} The path to the image file to inspect.
 * @returns {object} The InspectContentResponse.
 */
async function main(
  projectId = 'YOUR_PROJECT_ID',
  filepath = 'path/to/image.png'
) {
  // Instantiates a client
  const dlp = new DLP.DlpServiceClient();

  // Get the bytes of the file
  const fileBytes = Buffer.from(fs.readFileSync(filepath)).toString('base64');

  // Construct request
  const request = {
    parent: dlp.projectPath(projectId),
    item: {
      byteItem: {
        type: 'IMAGE',
        data: fileBytes,
      },
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
    console.log(`\tLikelihood: ${finding.likelihood}`);
  });
  return inspectResponse;
}
// [END dlp_inspect_image_file]

main(...process.argv.slice(2));
