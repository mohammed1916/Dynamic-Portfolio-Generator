# Expediting HR Management Via Dynamic E-Portfolio by Employing Web Scrapper

This project is an implementation of the paper which will be published in the scopus indexed journal:
Journal of Survey in Fisheries Science

[Access journal here](http://sifisheriessciences.com//index.php/journal/article/view/1172/1184)

Karthikeyan A, Mohammed Abdullah, B Jeevan Akshay & Kevin Christopher A. (in press). "Expediting HR Management Via Dynamic E-Portfolio by Employing Web Scrapper," Journal of Survey in Fisheries Sciences, Vol. 10 No. 4S (2023):(Special Issue 4). http://sifisheriessciences.com/journal/index.php/journal/article/view/1172/1184

# STEPS TO EXECUTE
---
## START THE CLIENT AND THE SERVERS
---
### 1. Server - Handling Web Scrapper program and API requests
User root folder perform:
`cd serverside && npm start`

---
### 2. Middleware Server
Under User root folder, run:
`cd middlewareserver && npm start`

#### For production mode:
- Start server
`cd middlewareserver && npm start`

- Run with cron
`pm2 start index.js --cron "*/15 * * * *"`

#### Stop server
`pm2 delete all`

---
### 3. Client 
Under User root folder, run:
`cd portfolio && npm start`

___

## DYNAMICALLY FETCH DETAILS

This can be either obtained by using API's or using Web Scrapper.

### 1. Using API

LinkedIn officially provides [Authorization Code Flow (3-legged OAuth)](https://learn.microsoft.com/en-us/linkedin/shared/authentication/authorization-code-flow?tabs=HTTPS1) using which [limited details](https://learn.microsoft.com/en-us/linkedin/shared/integrations/people/profile-api?context=linkedin%2Fconsumer%2Fcontext) can be obtained and certain [other information](https://learn.microsoft.com/en-us/linkedin/shared/references/v2/profile) with [partnership integrations](https://developer.linkedin.com/blog/posts/2015/developer-program-changes) under [V2 OAuth](https://learn.microsoft.com/en-us/linkedin/consumer/integrations/self-serve/migration-faq?context=linkedin%2Fconsumer%2Fcontext)

1. To perform such authentication, click the `LINKEDIN AUTHORISATION` button
2. This will open the authorisation window for requesting the Authorisation code. 
3. Using this Authorisation code and clientID of the LinkedIn page, the Access code is obtained. Finally Access code is used for API calls.
4. The obtained result can be used to auto-fill the data.

___
### 2. Using Web Scrapper

1. Select `UPDATE LINKEDIN DATA IN SERVER` to launch puppeteer instance in the server.
2. This instance will scrape data in HTML format from the linkedIn URL passed from the server.
3. The resultant data is queried using document query selectors.
4. This is stored in the file in the server for later access.
5. When user clicks the `FILL DATA` button, the data stored in the file in server is scanned and sent to the user.
6. The data retrieved from above step is used to dynamically fill the updated data in the server for the form fields.
   
___
## GENERATE WEBSITE

1. Click on the `PREVIEW WEBSITE` to view the website.
2. Under the projects tab, select a project to load the content
3. The links entered for the code, such as Github and the links fentered for the hosting website or any app store is visited by the middleware server.
4. The screenshots are transmitted to the client, making it look native to the web page.
5. This is performed using socket programming

