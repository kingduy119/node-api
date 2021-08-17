import User from "./user.model";
import { hashPassword } from "~/core/utils";

export function findMany(query) {
    return User.find(query);
}

export function createProfile(request) {
    const { provider, password} = request.body;

    let hashed = hashPassword('autopassword');
    if(provider === 'local') { hashed = hashPassword(password); }
    
    return User.create({...request.body, password: hashed });
}

export function findProfile(request) {
    const { userId } = request.params;
    return User.findById(userId);
}

export function updateProfile(request) {
    const update = request.body;
    const { userId } = request.params;
    return User.findByIdAndUpdate({_id: userId}, update, { new: true });
}

export function deleteProfile(request) {
    const { userId } = request.params;
    return User.findByIdAndRemove({_id: userId});
}



