import * as UserService from "./user.service";
import { onSuccess } from "~/core/utils";

export const fetchMany = async (req, res, next) => {
    try {
        let { query } = req;
        const data = await UserService.findMany(query);

        res.json(onSuccess({data}));
    } catch (error) { res.status(500).send(error); }
}

export const createProfile = async (req, res, next) => {
    try {
        const { username } = req.body;
        const exists = await UserService.findMany({username});
        
        if(exists.length > 0) 
        { return res.json(onSuccess({message: "User exists"})); }
        
        let user = await UserService.createProfile(req);
        res.status(200).json(onSuccess({data: user}));
    } catch (error) {
        res.status(500).send(error);
    }
}

export const fetchProfile = async (req, res, next) => {
    try {
        const user = await UserService.findProfile(req);

        return res.send(onSuccess({data: user}));
    } catch (error) { return res.status(500).send(error); }
}

export const updateProfile = async (req, res, next) => {
    try {
        const user = await UserService.updateProfile(req);

        return res.send(onSuccess({data: user}));
    } catch (error) { return res.status(500).send(error); }
}

export const deleteProfile = async (req, res, next) => {
    try {
        const user = await UserService.deleteProfile(req);

        return res.send(onSuccess({data: user}));
    } catch (error) { return res.status(500).send(error); }
}






