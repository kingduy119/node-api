import _ from "lodash";
import * as UserService from "./user.service";
import { onSuccess } from "~/core/utils";

export const getUsers = async (req, res, next) => {
    try {
        const size = parseInt(_.get(req.query, 'limit', 5));
        const data = await UserService.getUsers(req.query).limit(size);

        res.json(onSuccess({ data }));
    } catch (error) { res.status(500).send(error); }
}

export const postUsers = async (req, res, next) => {
    try {
        let data = await UserService.postUsers(req.body);

        return res.status(200).json(onSuccess({ data }));
    } catch (error) { res.status(500).send(error); }
}

export const getUserId = async (req, res, next) => {
    try {
        const _id = _.get(req.params, 'userId', '');
        const data = await UserService.getUserId({ _id });

        return res.send(onSuccess({ data }));
    } catch (error) { return res.status(500).send(error); }
}

export const updateUserId = async (req, res, next) => {
    try {
        const _id = _.get(req.params, 'userId', '');
        const data = await UserService.updateUserId({ _id, ...req.body });

        return res.send(onSuccess({ data }));
    } catch (error) { return res.status(500).send(error); }
}

export const deleteUserId = async (req, res, next) => {
    try {
        const _id = _.get(req.params, 'userId', '');
        const data = await UserService.deleteUserId({ _id });

        return res.send(onSuccess({ data }));
    } catch (error) { return res.status(500).send(error); }
}





