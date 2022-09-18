# Smart-Kicks

## Inspiration
With all of us playing different sports, we know that the most important part of movement starts at the base: the feet. For athletes and those with movement impairments alike, having more data on how the feet move (namely how fast they move) can give valuable insights into enhancing movement. We developed Smart-kicks to combine the power of embedded smart shoes and of computer-vision tracking systems. Athletes can use it to improve their training, injurees can use it for rehab, or people with disabilities can use it for QOL improvements.

## What it does
Smart-kicks is a smart shoe system to gather data about foot movement. Our prototype currently tracks foot speed, and clips onto a user's laces to instantly make a shoe "smart". The shoe connects to the internet via the WiFi ESP32 chip, and posts the foot speed data to our web app, which inserts it into CockroachDB Serverless in real time.

Separately, a MediaPipe pose-tracking application observes user movement and classifies it into different actions. For example, for a soccer player who is practicing both dribbling drills and shooting into the net, our app will classify what they are doing at each time ("dribble" or "kick") and send that data to CockroachDB as well.

Finally, an Express app serves a React user dashboard with graphs to summarize all of the data. Since we know both foot speed and the classified poses at each time, we can associate the two together. Our soccer player can know the foot speed for dribbling separately from for kicking, allowing them to focus on just one to improve.

## How we built it
The smart shoe used an Arduino Uno to calculate foot velocity in real-time, then transmitted the data to an ESP32 chip via serial communication (UART protocol). Then, the ESP32 POSTs the data to an endpoint on our deployed Express app, which stores it in CockroachDB. To actually calculate velocity, we have a 3-axis gyro and accelerometer (MPU6050) attached to the Arduino. We use the gyro to remove the effect of gravity from the acceleration by applying a rotation matrix, then integrate the acceleration to get the velocity. All components reside in a laser-cut board that can be clipped onto a user's laces.

To classify user poses, we used the MediaPipe library's pose library to get coordinates of body points, then did an analysis of joint positions relative to each other. The web app itself is built with Express and React, and was hosted on GCP App Engine in order to have the API endpoint available to the shoe and MediaPipe application.

## Challenges and Accomplishments
Our team came across some extremely frustrating bugs this weekend. One hardware issue was that we initially tried connecting the accelerometer directly to the ESP32 chip. However, the chip didn't have enough power to supply it and experienced a brownout error. Instead, we connected the sensor to the Arduino and transmitted the data to ESP32 via UART. Another was that the accelerometer also included a constant acceleration due to gravity, and to make matters worse, that was split between three axes when rotated. In order to remove it, we needed to apply a rotation matrix. We experienced equal frustration on the software side of things. It turns out there's no MediaPipe build for M1 Macbooks, which required some of us to download x86 Python through Rosetta to run it. We also occasionally get a 404 on the frontend when accessing the compiled React app (which, scarily, we still don't know the reason for).

However, we're incredibly proud of what we've made and learned! All components of our project ended up working successfully, which we're extremely happy with, as this was our first hardware hack and our first time using MediaPipe.

## What we learned
Our biggest takeaway is definitely that in-person hackathons are strictly superior to online ones. We also learned so much about hardware in general, serial communication, IoT, MediaPipe, and more. By applying all of these in a project together, we learned about the power that they yield and how they can be combined in many creative use cases.

## What's next for Smart-Kicks
For the future, we'd like to first add more sensors. We're thinking of a GPS module, a heart rate sensor, and a force sensor that allows us to measure how much force our user puts into the ground or kicks. Of course, if continuing with the project, we'd also want it to be integrated into the shoe rather than attached.

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
