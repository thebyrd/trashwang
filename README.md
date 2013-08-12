# trashwang
shouts out to everyone who worked on the album. its a #ratchet #mobilefirst #hackathon project for throwing potlucks.

# how to run
## basically it's impossible to set up this application
### so these instructions assume you've run it once before but just can't remember anything because you're a scrub like me

in one tab, `redis-server` \\
in another, `nodemon server.js` (and if that doesn't work, `npm install`) \\
and then `plovr serve plovr.json` \\
and then in `layout.soy` make sure that the port is on the right machine and isn't getting served from elsewhere (i.e. David's machine)
