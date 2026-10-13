# Buildbox AI — real AI starter

This project connects the Buildbox AI website to Google's Gemini API through a server-side endpoint.

## Important
- The HTML alone cannot call the private API safely. Deploy the entire project to a serverless host.
- Never put your Gemini API key in `index.html` or any browser JavaScript.
- API usage may have limits and can become paid depending on your account, model and usage. Check the current terms and quota before sharing publicly.

## Set up
1. Create an API key in Google AI Studio: https://aistudio.google.com/
2. Create a Vercel account: https://vercel.com/
3. Put these project files in a GitHub repository, then import that repository into Vercel.
4. In Vercel project settings, add an environment variable:
   - Name: `GEMINI_API_KEY`
   - Value: your private Gemini API key
   Add it for the deployment environments you use, then redeploy.
5. Open the deployed website and test a simple question.

## Files
- `index.html`: Buildbox AI user interface
- `api/chat.js`: server-side Gemini API endpoint
- `vercel.json`: function configuration

## Notes
- The chat keeps recent conversation turns in the current browser page only.
- Add rate limiting, abuse protection, privacy information, and usage monitoring before making the site public.
- If the selected Gemini model is unavailable to your account, update the model name in `api/chat.js` to a model shown as available in your AI Studio/API account.
