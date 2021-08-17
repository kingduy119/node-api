import jwt from "jsonwebtoken";
import { genSaltSync, hashSync, compareSync } from 'bcryptjs';
import { JWT_SECRET } from "~/core/config";

const salt = genSaltSync(10);

export function hashPassword(password) { return hashSync(password, salt); }
export function verifyPassword(password, hashed) { 
    return compareSync(password, hashed); 
}


export const onSuccess = ({data, message}) => ({
    status: 200,
    message,
    data,
})

export function verifyToken(token) {
    return jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if(err) { return false; }
        return true;
    });
}

export function createToken(payload) {
    let options = {}
    return jwt.sign(payload, JWT_SECRET, options);
}



