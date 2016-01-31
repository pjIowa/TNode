# TNode
Touch your data for the first time


![Hello](https://31.media.tumblr.com/5cdc86d7ac4f2f76e2179f4828500647/tumblr_inline_n4wmdqVphI1qh2kpf.gif)

# Why
This started off as an experiment in using D3 to display tweets collected from a Python script.
I looked for a way to see Twitter trends on a US map, nothing really tickled me.
Over time, I added features requiring a true server, settling on NodeJS.  I made it a web framework
so that people can interact with their data easier. Continue if you like.

# Screenshots
* Welcome Page
![initial page](public/images/initial.png)
* Hover over Area
![state hover page](public/images/stateHover.png) 
* State Clicked
![state clicked page](public/images/stateClicked.png)
* County Clicked
![county clicked page](public/images/countyClicked.png)


# Installation Steps
* Install Postgres, use the link to download: http://www.postgresql.org/download/
* Install NodeJS, use the link to downlaoad: https://nodejs.org/en/download/

# Usage Steps
* The app uses data from the Twitter API, here are steps to get credentials to use it:
<dl>
<dd>1. Sign up for a Twitter account, unless you already have one: https://twitter.com/</dd>
<dd>2. Sign in to the Apps Management Site: https://apps.twitter.com/</dd>
<dd>3. Click on Create New App to continue.</dd>
<dd>4. Fill out the fields for your app and agree to the Developer Agreement. </dd>
<dd>5. Click on Create your Twitter application to continue. </dd>
<dd>6. Click to view the tab the Keys and Access Tokens for the app. </dd>
<dd>7. Click Create my access token on the bottom to contine. </dd>
<dd>8. Copy the values for these four fields into a new json file: Consumer Key, Consumer Secret, Access Token, and Access Token Secret. </dd>
</dl>
* The app needs a credentialsDB to access your Postgres database:
<dl>
<dd>1. Create a new file called credentialsDB.json. </dd>
<dd>2. Save the file under TNode->router. </dd>
<dd>2. Click on the Postgres application to start the PostgreSQL Server on your machine. </dd>
<dd>3. Open psql, the command line interface for your PostgreSQL server. </dd>
<dd>4. If your server is not password-secured, run the following command:  ALTER ROLE your_username WITH PASSWORD 'your_password'; </dd>
<dd>5. If you haven't made a database yet,  run the following command: CREATE DATABASE your_db_name;</dd>
<dd>6. Add a JSON dictionary with the keys: username, password and dbname, then add the values you just set. Save the JSON dictionary to the file. </dd>
</dl>
* To run the app, you have to start the server.js file:
* <dl>
<dd>1. Open terminal and cd into the TNode directory. </dd>
<dd>2. To setup nodemon on your machine, run the following command: npm install -g nodemon </dd>
<dd>3. To start the server, run the following command: nodemon server.js </dd>
<dd>4. If it all succeeds, the terminal will say 'the api is running'. </dd>
</dl>

# Contributing
Help me improve this project.
If you woudl like to submit some changes, send up a pull request.
For any questions, comments, or concerns, please send me a message at pjkedilaya@gmail.com

# Sources
* Adjusting Points on Zoom: http://jsfiddle.net/o3dxgfuu/12/
* Zoom into State: http://bl.ocks.org/mbostock/2206590
* FIPS code to population and land area data: http://quickfacts.census.gov/qfd/download_data.html
* FIPS code to state, county name: http://www.schooldata.com/pdfs/US_FIPS_Codes.xls
* TopoJSON files for D3 rendering: http://bl.ocks.org/mbostock/raw/4090846/us.json
* Choropleth coloring: http://bl.ocks.org/mbostock/4060606
