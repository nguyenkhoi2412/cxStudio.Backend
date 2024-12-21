import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

const strategyOauth = {
  GOOGLE: (passport) => {
    // Passport Configuration
    passport.use(
      new GoogleStrategy(
        {
          clientID: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          callbackURL: `${process.env.BACKEND_URL}/api/auth/google/callback`
        },
        async (accessToken, refreshToken, profile, done) => {
          //get the user data from google
          const newUser = {
            googleId: profile.id,
            displayName: profile.displayName,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            image: profile.photos[0].value,
            email: profile.emails[0].value
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
