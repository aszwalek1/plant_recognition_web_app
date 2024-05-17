# intelligent_web
COM3504 The Intelligent Web Group Assignment 2024
Team BSc08 - Niamh Perry, Samuel Cameron, Alicja Szwalek

Installation Instructions:

npm install geolocation

npm install geolib

npm install @googlemaps/js-api-loader

API KEY: AIzaSyDViXsX4aGMzQA-2X5J9gj8Gt_LD__RcVU

Online Functionalities :
SEE /Screenshots/online-functionality.mp4

Home Page:

Displays all plants in the database with image, name, date/time, location and status.
Sort by closest to user location, furthest from user location, most recently added and least recently added.
Filter by; identified plants, characteristics, sun exposure level and colour.
Go to a plant page by clicking 'more details' on an individual plant.
Add a new plant by clicking 'new post'.
On screens less than 768px, there is the option to hide the filters, and posts are displayed below filters rather than to the side.

New Post:

Enter plant details in the form including; name, upload image, select location on the map using the pin, nickname, characteristics and status. Required fields have a '*' notation. If the pin won't move, refresh the page. Colour is selected using a colour picker. 
Preview of image and name is displayed.
Upload plant to the database clicking 'upload', redirection to home page with the new plant added. 
Return to home page by clicking 'home'.
On screens less than 768px, the preview is displayed below filters rather than to the side.


View Plant:

Displays the plant image with all details stored in the database for that plant. Details include; plant description, characteristics, location, nickname and status. 
If plant status is 'in progress', update plant button available.
If plant name is found in DBPedia, link to DBPedia and Wikipedia pages are shown and part of the abstract about that plant is displayed.
Live chat function available for each plant.
On screens less than 768px, details and live chat are displayed below the image rather than to the side and there is the option to hide the description.


Update Plant:

Plant image displayed, plant name and status can be edited, user nickname must be entered and match that of the original poster.

References :

placeholder img ref: https://cityofmebanenc.gov/parks-facilities-trails/placeholder-image/
