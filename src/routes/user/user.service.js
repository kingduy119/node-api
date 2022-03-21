import _ from "lodash";
import User from "./user.model";
import { hashPassword } from "~/core/utils";

const publicFields = ['_id', 'username', 'email', 'firstName', 'lastName'];

function filterQuery(docs, field) {
    let value = _.get(docs, field);
    if(!_.isEmpty(value)) {
        Object.assign(docs, {
            [field]: { $regex: value }
        });
    }
    return docs;
}
// List all users
export function getUsers(docs) {
    let query = _.pick(docs, publicFields)

    query = filterQuery(query, 'username');
    query = filterQuery(query, 'firstName');

    return User.find(query);
}

// Create new user, only unique username
export async function postUsers (docs) {
    console.log(JSON.stringify(docs))
    const { username, password } = docs;

    const exists = await User.exists({ username });
    if(exists) throw { username: `${username} is exist`};

    return User.create({...docs, password: hashPassword(password)});
}

// Find user _id
export function getUserId(docs) {
    return User.findById(
        _.get(docs, '_id'),
        publicFields
    );
}

// Update user _id
export function updateUserId(docs) {
    const { _id, ...update} = docs;

    return User.findByIdAndUpdate({ _id }, update, { new: true });
}

// Delete user _id
export function deleteUserId(docs) {
    return User.findByIdAndRemove({
        _id: _.get(docs, '_id')
    });
}

