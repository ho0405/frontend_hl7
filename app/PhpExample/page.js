import React from 'react';

/**
 * PhpExample component displays a PHP code snippet demonstrating how to interact with the Convert to HL7 API.
 * This example includes the use of cURL in PHP to post a PDF file to the API for conversion to HL7 format.
 * It covers setup, sending the request, and handling responses, including error scenarios.
 *
 * @component
 * @returns {React.ReactElement} A component that displays a preformatted text block containing the PHP code example.
 */

function PhpExample() {
    const phpCode = `
// Example of using the Convert to HL7 API with PHP

// The API endpoint URL
$apiUrl = 'https://yourdomain.com/upload';

// The path to the PDF file to upload
$pdfFilePath = '/path/to/file.pdf';
$pdfFileName = basename($pdfFilePath);

// Setup cURL
$curl = curl_init();
curl_setopt($curl, CURLOPT_URL, $apiUrl);
curl_setopt($curl, CURLOPT_POST, true);

// Setup the necessary headers, e.g., API Key for authentication if required
$headers = [
    'Authorization: Bearer YOUR_API_KEY', // Replace YOUR_API_KEY with the actual key
    // More headers if needed
];
curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);

// Create a CURLFile object
$cfile = new CURLFile($pdfFilePath, 'application/pdf', $pdfFileName);

// Assign POST data
$data = ['file' => $cfile];
curl_setopt($curl, CURLOPT_POSTFIELDS, $data);

// Return the transfer as a string
curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);

// Execute cURL session
$response = curl_exec($curl);
$httpcode = curl_getinfo($curl, CURLINFO_HTTP_CODE);

// Check for errors and process the response
if (curl_errno($curl)) {
    // Handle error scenario
    echo 'cURL Error: ' . curl_error($curl);
} elseif ($httpcode === 200) {
    // Assuming the API responds with the HL7 message as a string
    // Process the HL7 message
    echo 'HL7 Message: ' . $response;
} else {
    // Handle other HTTP status codes or API-specific errors
    echo 'Unexpected HTTP status code: ' . $httpcode;
}

// Close cURL session
curl_close($curl);
`;

    return (
        <div className="Php-example-page">
            <pre><code>{phpCode}</code></pre>
        </div>
    );
}

export default PhpExample;
