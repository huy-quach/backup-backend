// backend/config/passport.js
const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;
const User = require("../models/user"); // Model User của bạn

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: "http://localhost:5000/auth/facebook/callback",
      profileFields: ["id", "emails", "name"], // Lấy email và tên từ profile Facebook
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Tìm user theo Facebook ID
        let user = await User.findOne({ facebookId: profile.id });
        if (!user) {
          // Nếu không có user, tạo mới nhưng không yêu cầu password
          user = new User({
            facebookId: profile.id,
            name: `${profile.name.givenName} ${profile.name.familyName}`,
            email: profile.emails[0].value,
            password: null, // Không yêu cầu password với đăng nhập bằng Facebook
          });
          await user.save();
        }
        return done(null, user);
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

// Serialize và deserialize user
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});
