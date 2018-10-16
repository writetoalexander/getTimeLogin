const express = require('express');
const passport = require('passport');
//const FacebookStrategy = require('passport-facebook')
const GoogleStrategy = require('passport-google-oauth20').Strategy;
// Import Facebook and Google OAuth apps configs
const google = require('../config/config').google;

const User = require('./database');




// Transform Google profile into user object
const transformGoogleProfile = (profile) => ({
  name: profile.displayName,
  avatar: profile.image.url,
});



passport.use(new GoogleStrategy(google,
  async (accessToken, refreshToken, profile, done)
    => {
      console.log('profile is ', profile);
      User.findOne({userID : profile.id},function(err,result){
        if(!result){
          var userObj = new User({
            userID: profile.id,
            userName: profile.displayName,
            routePref: '',
            home: ''
          });
          userObj.save((err, user) => {
            if (err) {
              console.log('err in new User Update');
            } else {
              console.log('success in creating new user');
            }
          });
        } else {
          console.log('user already present');
      }
    });
      done(null, transformGoogleProfile(profile._json))
    }
));


// Serialize user into the sessions
passport.serializeUser((user, done) => done(null, user));

// Deserialize user from the sessions
passport.deserializeUser((user, done) => done(null, user));

// Initialize http server
const app = express();

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());


// Set up Google auth routes
app.get('/auth/google', passport.authenticate('google', { scope: ['profile'] }));

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/auth/google' }),
  (req, res) => res.redirect('OAuthLogin://login?user=' + JSON.stringify(req.user)));

// Launch the server on the port 3000
const server = app.listen(3000, () => {
  const { address, port } = server.address();
  console.log(`Listening at http://${address}:${port}`);
});
