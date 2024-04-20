import React from 'react';
/**
 * ApiKey component allows users to obtain an API key necessary for using the Conversion API.
 * It outlines the steps required to create and retrieve an API key from the user dashboard.
 * 
 * @component
 * @example
 * return (
 *   <ApiKey />
 * )
 */


function ApiKey() {
    return (
<div class="api-key-page">
  <h1>Get Your API Key</h1>
  <p>To use our Conversion API, you need an API key. Please follow the steps below to obtain your API key.</p>
  <ol>
    <li>Sign up for an account or log in if you already have one.</li>
    <li>Navigate to your dashboard.</li>
    <li>Go to the &apos;API Keys&apos; section and click on &apos;Create New Key&apos;.</li>
    <li>Label your key with a name that helps you remember its usage.</li>
    <li>Copy and securely store your new API key; you won&apos;t be able to see it again!</li>
  </ol>
  <p>If you have any issues, please contact our support team.</p>
</div>
);
}

export default ApiKey;