# Financial Data Filtering App

This is a take-home project for the ValueGlance Full Stack Software Engineer Intern Position.
This app, built using React and TailwindCSS, fetches annual income statements for AAPL (Apple) from an API endpoint.
It provides filtering and sorting options (by date, revenue, and net income), and displays the filtered data in a table.
This app is deployed using GitHub Pages.

## Deployed App

You can view the deployed app here:

(https://rysealex.github.io/financial-data-filtering-app/)

## Prerequisites

Before running the app locally, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v16.0 or higher)
- [npm](https://www.npmjs.com/) (Node package manager, usually installed with Node.js)

## Running the Project Locally

Follow these steps to run the project on your local machine:

1. Clone the repository:

   Open your terminal or command prompt and clone the repository with this command:

   git clone https://github.com/rysealex/financial-data-filtering-app.git

2. Navigate to the project folder:

   Change your working directory to the project folder:

   cd take-home-project

3. Install dependencies:

   Install all necessary dependencies using npm:

   npm install

4. Start the development server:

   Run the following command to start the local development server:

   npm start

   This will launch the app in your default web browser, usually at https://localhost:3000

## Running Tests

If you would like to run tests, use the following command:

npm test

## Building the Project 

To create a production build of the app, use the following command:

npm run build

This will generate a build/ directory with a version of the app

## Deployment

The app is deployed using GitHub Pages. To deploy it again or after making changes, run:

npm run deploy

This will push the build/ folder to the gh-pages branch and update the live version of the app