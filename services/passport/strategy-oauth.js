import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { Strategy as MicrosoftStrategy } from 'passport-microsoft';

const apiCallback = (name) => {
  return `${process.env.BACKEND_URL}/api/auth/` + name + `/redirect`;
};

const strategyOauth = {
  GOOGLE: (passport) => {
    // Passport Configuration
    passport.use(
      new GoogleStrategy(
        {
          clientID: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          callbackURL: apiCallback('google')
        },
        async (accessToken, refreshToken, profile, done) => {
          //get the user data from google
          const newUser = {
            googleId: profile.id,
            displayName: profile.displayName,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            image: profile.photos[0].value,
            email: profile.emails[0].value,
            provider: 'google'
          };
          // Use the Google profile info for user management
          return done(null, newUser);
        }
      )
    );

    passport.serializeUser((user, done) => {
      done(null, user);
    });

    passport.deserializeUser((user, done) => {
      done(null, user);
    });
  },
  FACEBOOK: (passport) => {
    passport.use(
      new FacebookStrategy(
        {
          clientID: process.env.FACEBOOK_CLIENT_ID,
          clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
          callbackURL: apiCallback('facebook'),
          profileFields: ['id', 'displayName', 'email'] // Specify fields to retrieve
        },
        async (accessToken, refreshToken, profile, done) => {
          console.log('accessToken', accessToken);
          console.log('refreshToken', refreshToken);
          console.log('profile', profile);

          //get the user data from google
          const newUser = {
            googleId: profile.id,
            displayName: profile.displayName,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            image: profile.profileUrl,
            email: profile.emails && profile.emails[0]?.value,
            provider: 'facebook'
          };
          // Use the Google profile info for user management
          return done(null, newUser);
        }
      )
    );

    passport.serializeUser((user, done) => {
      done(null, user);
    });

    passport.deserializeUser((user, done) => {
      done(null, user);
    });
  },
  MICROSOFT: (passport) => {
    passport.use(
      new MicrosoftStrategy(
        {
          clientID: process.env.MICROSOFT_CLIENT_ID,
          clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
          scope: ['openid', 'profile', 'email'],
          callbackURL: apiCallback('microsoft')
        },
        async (accessToken, refreshToken, profile, done) => {
          //get the user data from google
          const newUser = {
            googleId: profile.id,
            displayName: profile.displayName,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            image: profile.photos[0].value,
            email: profile.emails[0].value,
            provider: 'google'
          };
          // Use the Google profile info for user management
          return done(null, newUser);
        }
      )
    );

    passport.serializeUser((user, done) => {
      done(null, user);
    });

    passport.deserializeUser((user, done) => {
      done(null, user);
    });
  }
};

export default strategyOauth;
