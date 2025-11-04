const passport = require('passport');
const { Strategy: GitHubStrategy } = require('passport-github2');
const User = require('../models/User');

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID || '',
      clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
      callbackURL: process.env.GITHUB_REDIRECT_URI || 'http://localhost:3001/oauth/github/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Find or create user
        let user = await User.findOne({ oauthId: profile.id.toString(), oauthProvider: 'github' });

        if (!user) {
          // Get email from profile (may require email scope)
          const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;

          if (email) {
            // Check if user exists with this email
            user = await User.findOne({ email });

            if (user) {
              // Link OAuth account to existing user
              user.oauthProvider = 'github';
              user.oauthId = profile.id.toString();
              await user.save();
            }
          }

          if (!user) {
            // Create new user
            const username = profile.username || profile.displayName.replace(/\s+/g, '').toLowerCase() + Math.floor(Math.random() * 1000);
            user = new User({
              username,
              email: email || `${profile.username}@github.local`,
              oauthProvider: 'github',
              oauthId: profile.id.toString(),
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

