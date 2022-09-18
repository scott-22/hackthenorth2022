# hackthenorth2022

Smart shoe!

## How to deploy to Google Cloud

Prerequisites: have Google Cloud SDK installed.
This allows you to run the `gcloud` command in the terminal.

> **Note**
>
> After installing the Google Cloud SDK, if running `gcloud` doesn't work, try restarting your computer.

1. `cd` to the `api/` directory
2. Make sure that the app works. You can run `node app.js` and test out the API from localhost
3. Run `gcloud app deploy`. You have to be signed in to the account of the person who made the Google Cloud app
4. Yay you're done 🎉

## How to build and serve the frontend

> **Note**
>
> I have written a powershell script (`deploy.ps1`) that does all this for you.
> To use, run `deploy.ps1` from the `hackthenorth2022` directory.

You must build the frontend into vanilla HTML, CSS, and JS to serve it.

1. `cd` to the `client` directory
2. Run `npm run build`. The built files will be created under `client/build/`
3. Move `client/build/` to `api/public/`. The Node app will statically serve whatever is in the `api/public/` directory
  - The file structure should now look like this:
  
  ![image](https://user-images.githubusercontent.com/47123100/190854671-a1f59522-57d4-459c-8c8b-8ee4ffdba4ee.png)

4. Now you can move on and deploy to Google Cloud! ✨
