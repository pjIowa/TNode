# TNode
* touch your data for the first time

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
* Install Postgres, link for download: http://www.postgresql.org/download/
* Install NodeJS, link for downlaoad: https://nodejs.org/en/download/

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
* Notes on adding credentialsDB and credentialsTwitter
* Note to run npm install
* Notes to run Node app
* Notes to replace Twitter as a data source

# Sources
* Adjusting Points on Zoom: http://jsfiddle.net/o3dxgfuu/12/
* Zoom into State: http://bl.ocks.org/mbostock/2206590
* FIPS code to population and land area data: http://quickfacts.census.gov/qfd/download_data.html
* FIPS code to state, county name: http://www.schooldata.com/pdfs/US_FIPS_Codes.xls
* TopoJSON files for D3 rendering: http://bl.ocks.org/mbostock/raw/4090846/us.json
* Choropleth coloring: http://bl.ocks.org/mbostock/4060606