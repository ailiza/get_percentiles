# GetPercentiles by Annie Ilizarov, Henry Xie & Simple Fractal, LLC.

## Introduction
We created a React app for benchmarking a software engineer's coding and communication skills against engineers that work at similar companies and with the same title (e.g., Junior Engineer)

## Scope of functionalities 
- [X] Enter a candidate's ID and returns their percentiles for their coding and communication score compared to other candidates at the same title and at similar companies
- [X] Enter a new candidate's information (ID, communication score, coding score, title and company ID)

## To Run This Web App, type:

```
npm install
npm start
```

## To Run The Test(s), type:

```
npm run test
```

## Tech Obstacle(s) That We Overcame

- Fetching data from the .csv file. Initially we tried to fetch it from the internet in real time but was blocked by CORS policy. Then it was a matter of finding the right library to parse the data. There were some trial and error and found Papa Parse to be easy to implement with great documentation.

## Stretch Goals

Ensure our app is widely accessible to a broad demographic of users:

- Set up a database for new candidate's information to persist
- Fetch data from the internet
- Allow a user to upload their own .csv file
- Migrate this app to the cloud

