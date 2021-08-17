import Category from './category.model';
import { get } from "lodash";
import { onSuccess } from "~/core/utils";

function fetchMany(request) {
    const { query } = request;
    return Category.find(query);
}

export const find = async (req, res, next) => {
    try {
        const data = await fetchMany(req);
        
        return res.send(onSuccess({data}));
    } catch (error) { return res.status(500).send(error); }
}

export const create = async (req, res, next) => {
    try {
        const { body } = req;
        const data = await Category.create(body);
        
        return res.send(onSuccess({data}));
    } catch (error) { return res.status(500).send(error); }
}

export const findById = async (req, res, next) => {
    try {
        const { params } = req;
        const slug = get(params, "slug", "");
        const data = await Category.findById(slug);
        
        return res.send(onSuccess({data}));
    } catch (error) { return res.status(500).send(error); }
}

export const updateById = async (req, res, next) => {
    try {
        const { params, body } = req;
        const slug = get(params, "slug", "");
        const data = await Category.findByIdAndUpdate({_id: slug}, body, {new: true});
        
        return res.send(onSuccess({data}));
    } catch (error) { return res.status(500).send(error); }
}

export const deleteById = async (req, res, next) => {
    try {
        const { params } = req;
        const slug = get(params, "slug", "");
        const data = await Category.findByIdAndRemove({_id: slug});
        
        return res.send(onSuccess({data}));
    } catch (error) { return res.status(500).send(error); }
}
