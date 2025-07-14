import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import passport from 'passport';
import { User } from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

// Extraer el token desde la cookie

const cookieExtractor = function (req) {
         let token = null;
  if (req && req.cookies) {
     token = req.cookies.jwtToken;
  }
  return token;
};

const options = {
  jwtFromRequest: cookieExtractor,
         secretOrKey: process.env.JWT_SECRET,
};

passport.use(
  new JwtStrategy(options, async (jwt_payload, done) => {
    try {
      const user = await User.findById(jwt_payload.id).select('-password');
         if (user) return done(null, user);
      return done(null, false);
         } catch (err) {
      return done(err, false);
    }
  })
);

export default passport;
