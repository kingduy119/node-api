import logger from "~/core/logger";
import { Strategy as LocalStrategy } from "passport-local";
import { OAuth2Strategy as GoogleStrategy } from "passport-google-oauth";
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRECT, JWT_SECRET } from "~/core/config";
import * as UserService from "../user/user.service";
import { get } from "lodash";
import { verifyPassword, createToken, verifyToken } from "~/core/utils";

export const googleStrategy = new GoogleStrategy(
    {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRECT,
        callbackURL: `/v1/oauth2callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
        // ...
    }
);

export const signinStrategy = new LocalStrategy(
    { passReqToCallback: true },
    async (req, username, pwd, done) => {
        try {
            const { provider } = req.body;

            let user = await UserService.findMany({username});
            if(!user) {
                if(provider === "local")
                    return done(null, false, {username: "invalid" });
                
                user = await UserService.createProfile(req);
            }

            // // verify password
            if(provider === "local" && !verifyPassword(get(req.body, 'password'), get(user, "password"))) {
                return done(null, false, { password: "invalid" });
            }

            let token = createToken(username);
            return done(null, { username, token });
        } catch (error) { return done(error); }
    }
)

export const signupStrategy = new LocalStrategy(
    { passReqToCallback: true },
    async (req, username, pwd, done) => {
        try {
            let exists = await UserService.findProfile({username});
            if(exists) 
                return done(null, false, { username: "existed" });

            await UserService.createProfile({...req.body });

            return done(null, { username });
        } catch (error) { return done(error); }
    }
)

