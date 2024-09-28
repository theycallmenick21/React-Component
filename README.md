# Introduction

To get started with this project, you will need to:

1. Ensure you have the latest version of Node.js installed on your system. You can download it from the official Node.js website: https://nodejs.org/.
2. Clone this repository to your local machine.
3. Install the ESLint plugin in Visual Studio Code. This can be done by going to the Extensions tab in Visual Studio Code and searching for `ESLint`.
4. Install Yarn globally if you haven't done so already. This can be done by running the following command in your terminal: `npm install -g yarn`
5. Run `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned` in PowerShell in admin mode after installing yarn to enable running yarn commands in Visual Studio Code.
6. Install Azure DevOps Auth helper globally if you haven't done so already. This can be done by running the following command in your terminal: `yarn global add vsts-npm-auth`
7. To authorize access to the Conexiom NPM Registry, run the following command in the Visual Studio Code console: `npx vsts-npm-auth -F -config .npmrc-login`. Once you run the command, a popup will appear. Follow the instructions in the popup, sign in to your Microsoft account and authorize access.
8. To set up the project with the desired `.env` and API URL variables, copy the `.env.example` file to `.env` by running the command `cp .env.example .env` and modify the API URL variables in the `.env` file to point to the desired URLs.

# Getting Started

To run this project locally, follow these steps:

1. Navigate to the root directory of the project in your terminal.
2. Run the command `yarn` to install all the necessary dependencies.
3. Run the command `yarn dev` to start the development server.
4. Once the server has started, you can view the app in your web browser by navigating to http://localhost:3001.

To run this project under Partner Portal locally, follow these steps:

1. Navigate to the root directory of the project in your terminal.
2. Run the command `yarn` to install all the necessary dependencies.
3. Run the command `yarn build` to build the project and output the remote entry js file.
4. Run the command `yarn dev` to start the development server.
5. Make sure the host is running in 3001 port.
6. Launch PP5 and navigate to /VitePartnerPortal/settings

# Build and Test

To build the project, run the command `yarn build` in your terminal. This will create a `dist` directory with the compiled project.

To run unit tests, run the command `yarn test` in your terminal. This will run all the tests in the project and provide you with the results.

# Configure Micro Frontend

1. Run the `node .\MicroFE_Config_Wizard.js` and follow the command promt to configure the micro frontend project. If you like to connect to Partner Portal at the same time, make sure the partner-portal repo is the sibling folder to this micro frontend project. For example: "C:\Git\micro-fe-template" and "C:\Git\partner-portal"

1. Rename the application title in `index.html` file. The neme will be visible to the users in their browsers. The default value is Micro Frontend Template.
1. Rename the repository name in the `package.json` file. The name should be all lower case connect with dash. The default value is micro-fe-template.
1. Rename the federation definition in the `vite.config.ts`. The default exported component name is MircroFrontendTemplate. The default project name is micro-fe-template. The project name should match the name in step 2.
1. Rename the application routing in the `.env` and `.env.example` file. The default value is ViteMicroFrontendTemplate.
1. Add dependency in the `Version.tsx`.

# Contribute

If you would like to contribute to this project, please follow these steps:

1. Create a new branch for your changes.
2. Make your changes and commit them.
3. Push your changes to your new branch.
4. Create a pull request with a description of your changes.
5. We welcome any and all contributions to this project, so don't hesitate to get involved!
