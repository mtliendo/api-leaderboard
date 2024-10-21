# Amplify Leaderboard

<img width="1509" alt="image" src="https://github.com/user-attachments/assets/379ad15f-d57a-46d2-9579-0e8d7594c734">


## Introduction

![image](https://github.com/user-attachments/assets/7f53293b-9f27-4a4c-8821-3f588f3ec0f3)


The Amplify Leaderboard is a web application that showcases the flexibility of Amplify Gen 2. It utilizes various AWS services and technologies to create a robust and scalable application.

## Technologies Used

- **Frontend**: The frontend is built using Amplify Gen 2, which leverages the AWS Amplify JavaScript libraries for authentication and API calls. The user interface is powered by ShadCN (Tailwind CSS) components, generated with V0 (a product of NextJS). NextJS is used to create a public home page and a protected admin section.
- **Backend**: Instead of AWS AppSync, the Amplify Leaderboard uses API Gateway, AWS Lambda, and DynamoDB. This demonstrates how Amplify Gen 2 allows developers to drop down to the AWS CDK to create custom resources, providing greater flexibility.
- **Authentication**: The application uses Amazon Cognito for user authentication.

<img width="1174" alt="image" src="https://github.com/user-attachments/assets/2c544ab8-de13-413a-be36-c74deed3a68f">


## Features

The Amplify Leaderboard provides the following features:

1. **Amplify Gen 2 Integration**: The application showcases the flexibility of Amplify Gen 2, allowing developers to leverage AWS services while maintaining control over the infrastructure.
2. **ShadCN and V0 for UI**: The application uses ShadCN (Tailwind CSS) components, which were generated with V0 (a NextJS product), providing a modern and responsive user interface.
3. **NextJS for Frontend**: The application utilizes NextJS to create a public home page and a protected admin section, ensuring secure access to sensitive functionality.
4. **Custom Backend with API Gateway, Lambda, and DynamoDB**: The Amplify Leaderboard uses API Gateway, AWS Lambda, and DynamoDB instead of AWS AppSync, demonstrating the flexibility of Amplify Gen 2.
5. **Amazon Cognito for Authentication**: The application leverages Amazon Cognito for user authentication, ensuring secure access to the application's features.
6. **Leaderboard API**: The application provides an API that allows users to list players, create new players, update player details, and delete players from the database.

## Contribution Guidelines

This application is open for contributions. Before submitting a pull request, please file an issue to discuss the proposed changes.
