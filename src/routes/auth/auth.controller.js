import logger from "~/core/logger";
import passport from "passport";
import * as AuthService from "./auth.service";
import { onSuccess } from "~/core/utils";
import { get } from "lodash";


passport.serializeUser((user, done) => {
    done(null, get(user, 'username', ''));
});
passport.deserializeUser((username, done) => {
    done(null, 'username');
});


// Register event to passport:
// It will be call service first then return result to controller function
passport.use('signin', AuthService.signinStrategy);
passport.use('signup', AuthService.signupStrategy);
passport.use(AuthService.googleStrategy);


// Login with local account or 3th-party:
// If 3th-party is new which will create new account
export const signin = (req, res, next) => {
    passport.authenticate('signin', (err, user, valid) => {
        if(err) { return res.send(err); }
        if(valid) { return res.send(valid); }

        return res.send(onSuccess({ data: user }));
    })(req, res, next);
}


// Signup with only local account
export const signup =  (req, res, next) => {
    passport.authenticate('signup', (err, user, valid) => {
        if(err) { return res.send(err); }
        if(valid) { return res.send(valid); }

        return res.send(onSuccess({ data: user }));
    })(req, res, next);
}


// Login with google account:
export const oauth2callback = passport.authenticate('google', {failureRedirect: '/login'});
export const google = passport.authenticate('google', {scope: ['profile', 'email']});



// export const signout = (req, res) => {
//     req.logout();
//     res.send("Logout");
// }