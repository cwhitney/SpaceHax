# SpaceHax
An entry for the space apps hackathon in New York City in 2016.  This is a simple node based site that lets you simulate a realistic rocket launch.  

Launches can be hosted by anyone on a desktop computer, and then joined by any number of mobile participants.  Mobile participants will get a stereo view for use in Google cardboard or simular devices.  The idea is that you can watch the launch on your desktop, and then look through your "binoculars" for a closer zoomed in view.

Run the node server on a local computer and nagivate to the local url to start a launch.  For example:
http://localhost:8080

This will bring you to a screen with texst letting you know there is no launch scheduled.  To schedule a launch, we need to create a 'room.'  You do this by being the first one to enter a particular url.  Here we'll start a room called "saturnv" to simulate a Saturn V launch.
http://localhost:8080/saturnv

IF this already exists, we would simply join the existing launch.  If it doesn't it's created, and now participants can join.  Mobile participants can join by using the ip or another host name if you've set it up.

Once hosting, pressing the spacebar will start a countdown and all paricipants will experience a simultaneous launch.  Pressing 'r' will reset it.
