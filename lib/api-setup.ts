/**
 * API Setup Instructions
 *
 * This file provides instructions for setting up the necessary API keys
 * for the flight and hotel search functionality.
 */

/**
 * Environment Variables Setup
 *
 * Create a .env.local file in the root of your project with the following variables:
 *
 * # Amadeus API Credentials
 * AMADEUS_CLIENT_ID=your_amadeus_client_id
 * AMADEUS_CLIENT_SECRET=your_amadeus_client_secret
 *
 * # Google Places API Key
 * GOOGLE_PLACES_API_KEY=your_google_places_api_key
 *
 * Make sure to add .env.local to your .gitignore file to keep your API keys secure.
 */

/**
 * Amadeus API Setup
 *
 * 1. Go to https://developers.amadeus.com/ and create an account
 * 2. Create a new application in the Amadeus developer dashboard
 * 3. Select the Self-Service APIs you need (at minimum, Flight Offers Search)
 * 4. Get your API Key (Client ID) and API Secret (Client Secret)
 * 5. Add these credentials to your .env.local file
 *
 * Note: Amadeus provides a test environment for development.
 * The API endpoints in this application are configured to use the test environment.
 * For production, you'll need to update the endpoints to use the production URLs.
 */

/**
 * Google Places API Setup
 *
 * 1. Go to https://console.cloud.google.com/ and create a project
 * 2. Enable the Places API for your project
 * 3. Create an API key in the Credentials section
 * 4. Restrict the API key to only the Places API for security
 * 5. Add the API key to your .env.local file
 *
 * Note: Google Places API has usage limits and billing requirements.
 * Make sure to set up billing and monitor your usage to avoid unexpected charges.
 */

/**
 * Testing Your API Integration
 *
 * After setting up your environment variables:
 *
 * 1. Restart your development server
 * 2. Try searching for flights and hotels in the application
 * 3. Check the browser console and server logs for any errors
 * 4. Verify that the API responses are being correctly processed and displayed
 */

/**
 * Troubleshooting
 *
 * Common issues:
 *
 * 1. "API credentials not configured" error:
 *    - Make sure your .env.local file is in the root directory
 *    - Verify that the variable names match exactly as shown above
 *    - Restart your development server after adding the variables
 *
 * 2. API request errors:
 *    - Check that your API keys are valid and active
 *    - Verify that you've enabled the correct APIs in your developer accounts
 *    - Check the format of your API requests against the documentation
 *
 * 3. CORS errors:
 *    - This shouldn't be an issue since we're making API calls from the server
 *    - If you see CORS errors, make sure you're not calling the APIs directly from the client
 */

