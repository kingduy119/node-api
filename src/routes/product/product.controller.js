import Product from './product.model';
import { get } from "lodash";
import { onSuccess } from "~/core/utils";

export const find = async (req, res, next) => {
    try {
        const { query } = req;
        const data = await Product.find(query);
        
        return res.send(onSuccess({data}));
    } catch (error) { return res.status(500).send(error); }
}

export const create = async (req, res, next) => {
    try {
        const { body } = req;
        const data = await Product.create(body);
        
        return res.send(onSuccess({data}));
    } catch (error) { return res.status(500).send(error); }
}

export const findById = async (req, res, next) => {
    try {
        const { params } = req;
        const slug = get(params, "slug", "");
        const data = await Product.findById(slug);
        
        return res.send(onSuccess({data}));
    } catch (error) { return res.status(500).send(error); }
}

export const updateById = async (req, res, next) => {
    try {
        const { params, body } = req;
        const slug = get(params, "slug", "");
        const data = await Product.findByIdAndUpdate({_id: slug}, body, {new: true});
        
        return res.send(onSuccess({data}));
    } catch (error) { return res.status(500).send(error); }
}

export const deleteById = async (req, res, next) => {
    try {
        const { params } = req;
        const slug = get(params, "slug", "");
        const data = await Product.findByIdAndRemove({_id: slug});
        
        return res.send(onSuccess({data}));
    } catch (error) { return res.status(500).send(error); }
}
