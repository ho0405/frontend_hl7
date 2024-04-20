import React from 'react';

/**
 * Documentation component displays API documentation for users looking to understand how to interact with the Conversion API.
 * It outlines how to authenticate requests and provides detailed information on API endpoints, including example requests and responses.
 * This component is designed to be a self-help resource for developers looking to integrate with the API.
 *
 * @component
 * @returns {React.ReactElement} A section of the application dedicated to API documentation, including authentication guidance and endpoint descriptions.
 */

function Documentation() {
    return (
<div className="documentation-page">
            <h1>API Documentation</h1>
            <p>Welcome to the Conversion API documentation! Here you will find detailed information on how to integrate and use our API effectively.</p>
            
            <h2>Authentication</h2>
            <p>To authenticate with our API, include your API key in the request header:</p>
            <code>Authorization: Bearer YOUR_API_KEY</code>
            
            <h2>Endpoints</h2>
            
            <h3>Convert File</h3>
            <p>POST /api/convert</p>
            <p>Converts uploaded files into the desired format.</p>
            <h4>Parameters:</h4>
            <ul>
                <li>file: The file to convert.</li>
                <li>format: The target format (e.g., PDF, DOCX).</li>
            </ul>
            <h4>Example Request:</h4>
            <code>curl -X POST &quot;http://example.com/api/convert&quot; -H &quot;Authorization: Bearer YOUR_API_KEY&quot; -F &quot;file=@path_to_file&quot; -F &quot;format=pdf&quot;</code>
            
            <h4>Example Response:</h4>
            <code>{"{status: 'success', message: 'File converted successfully.'}"}</code>

            <p>For more details and additional endpoints, refer to the full API documentation.</p>
        </div>
    );
}


export default Documentation;