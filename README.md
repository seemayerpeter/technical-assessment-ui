# Technical Assessment UI

## Introduction

Hello and welcome to your angular coding excercise! During the following process you will be creating a small dashboard using Angular 14.

## Procedure

To ensure your privacy, please **download** the Github repository and submit your work in your own Github repository. Once finished, kindly send us the link to the repository for review.

### Duration

You have **5 days** to complete this assessment. But do not spend that much! Spend at **max 4 hours** for the work. It's okay, if you couldn't complete all tasks.

## Background

A public JSON REST-API is available that returns a list of target assets from our postman mock server on the endpoint /targetAsset.

> What is a target asset?
> A target asset can be referred to as a remote system such as a hardware or virtual machine.

For the purposes of this task, this API will be referred to as the "TargetAsset-API". A GET-request to that resource will return some sample data in the following format:

**REST-API:** https://adb47d56-1aa9-4aa7-8ec2-77a923b80a5b.mock.pstmn.io/targetasset

```javascript
    {
        "id": number,
        "isStartable": boolean,
        "location": string,
        "owner": string,
        "createdBy": string,
        "name": string,
        "status": string,
        "tags": string[],
        "cpu": number,
        "ram": number,
        "createdAt": string,
        "parentId": number
    }
```

You will create a simple target assets dashboard given by the above data. The user should be able to see all target assets in a minimal view (show only related data), search/filter target assets and see some nice statistics (e.g. total CPU, total Memory).

Following some general advice/tips:

- **Look and feel (UI/UX):** Do some basic UI stylings. But **don't** overdo it! You can also add any UI library you are comfortable with.
- **State Management:** Apps need to manage state and react to state changes in order to provide an engaging user experience. If you have expirience in state management, don't hesitate to show us!
- **Unit testing:** Create a few meaningful unit tests. [Jest](https://jestjs.io/) is preinstalled and ready to use. But feel free to use any other test framework.
- **Code quality:** We have a strong emphasis on the quality of our codebase, and as a team, we demand that you uphold this standard by employing both clean code principles and C# best practices in your code. These practices are highly valued in our organization and are critical to building maintainable, efficient, and scalable software solutions.

## Tasks

Before you start: Please beware that the purpose of this challenge is to get an insight into your thought process when solving a problem. Because of that, it's critical that you document the decisions you make during implementation. You can add a new paragraph below each numbered task in the tasks section inside this markup file in which you write down your thoughts and why you decided to implement it the way you did.

1. Create a new lazy-loaded `dashboard` module which is accessible by the route `/dashboard`. For simplicity, we want that all other routes are being redirected to this module.
2. In this module, create a service, which fetches all target assets from the end point `/targetasset`.

   > **Note:** Since we do not trust our fellow backend engineers to actually return the data in the correct format, remember to make use of Typescripts language features to make sure the data fits your applications needs.

3. Render all target assets. You don't need to display all data. Just some important ones! [vCloud Example](https://thinfactory.com/wp-content/uploads/afbeelding-vcloud-director.jpg)
4. Add a loading indicator when the data are being loaded.
5. Use the target asset `status` property to highlight the target asset.
6. Add an input field where the user is able to filter the target assets by the `name` and `status` property.
7. Above the input field, add some nice statistics calculated by all target assets. e.g. Total of CPUs.
8. Add a target asset details page. This page is accessible by the route `/dashboard/assets/{:id}`. List all information in a meaningful way. You might have noticed, the target assets are bound together in a hierarchical order via their `parentId` property. Use the `parentId` information to show the `name` of the parent target asset and create a hyperlink to get to the next target asset.

# UI Repository Notes

During the setup and development of the UI repository, certain adjustments were necessary:

- The original `package.lock.json` file was deleted as it was attempting to fetch packages from Swisscom's internal repositories.
- Node.js version 16.10.0 was used for this project.
- Angular Material was incorporated as a simple UI library for added functionality and aesthetics.

For running the UI application, the following steps should be sufficient:

1. Install necessary dependencies via `npm install`.
2. Serve the application using `ng serve`.

The unit tests in this project utilize Jest. To execute these tests, use the following command: `npm run test`.
