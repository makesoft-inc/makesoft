const passport = require('passport');
const { Strategy: GoogleStrategy } = require('passport-google-oauth20');
const User = require('../models/User');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      callbackURL: process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3001/oauth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Find or create user
        let user = await User.findOne({ oauthId: profile.id, oauthProvider: 'google' });

        if (!user) {
          // Check if user exists with this email
          user = await User.findOne({ email: profile.emails[0].value });

          if (user) {
            // Link OAuth account to existing user
            user.oauthProvider = 'google';
            user.oauthId = profile.id;
            await user.save();
          } else {
            // Create new user
            user = new User({
              username: profile.displayName.replace(/\s+/g, '').toLowerCase() + Math.floor(Math.random() * 1000),
              email: profile.emails[0].value,
              oauthProvider: 'google',
              oauthId: profile.id,
            });
            await user.save();
          }
        }

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

