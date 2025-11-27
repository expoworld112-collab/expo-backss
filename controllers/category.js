import Category from '../models/category.js';
import slugify from "slugify";
import { errorHandler } from "../helpers/dbErrorHandler.js";
import Blog from "../models/blog.js";
<<<<<<< HEAD

=======
// import NodeCache from "node-cache";
// const myCache = new NodeCache();
>>>>>>> e8a0b69400c985ecdc3d87f5e13e4a922745963b

export const create = async (req, res) => {
    const { name, description } = req.body;
    const slug = slugify(name).toLowerCase();
    try {
        const category = new Category({ name, description, slug });
        const data = await category.save();
        // myCache.del("categorieslist");
        res.json(data);
    } catch (err) {res.status(400).json({ error: errorHandler(err)});}  
};


export const list = async (req, res) => {
<<<<<<< HEAD
    
    try {
        const data = await Category.find({}).select('_id name description slug').exec();
=======
    // const cachedData = myCache.get("categorieslist");
    // if (cachedData) {return res.json(cachedData);}
    try {
        const data = await Category.find({}).select('_id name description slug').exec();
        // myCache.set("categorieslist", data, 3000);
>>>>>>> e8a0b69400c985ecdc3d87f5e13e4a922745963b
        res.json(data);
    } catch (err) {res.status(400).json({error: errorHandler(err)});}  
};


export const read = async (req, res) => {
    const slug = req.params.slug.toLowerCase();
<<<<<<< HEAD
   
=======
    // const cacheKey = `category_${slug}`;

    // const cachedData = myCache.get(cacheKey);
    // if (cachedData) {return res.json(cachedData);}
>>>>>>> e8a0b69400c985ecdc3d87f5e13e4a922745963b
        
    try {
        const category = await Category.findOne({ slug }).select('_id name slug').exec();
        if (!category) {return res.status(400).json({ error: 'Category not found' });}

        const blogs = await Blog.find({ categories: category })
            .populate('categories', '-_id name slug')
            .populate('tags', '_id name slug')
            .populate('postedBy', '_id name username')
            .select('-_id title photo slug excerpt categories date postedBy tags')
            .exec();
<<<<<<< HEAD
=======
            //  myCache.set(cacheKey, { category, blogs }, 3000);
>>>>>>> e8a0b69400c985ecdc3d87f5e13e4a922745963b

        res.json({ category, blogs });
    } catch (err) {
        res.status(400).json({ error: errorHandler(err) });
    }
};



export const remove = async (req, res) => {
    const slug = req.params.slug.toLowerCase();
<<<<<<< HEAD
=======
    // const cacheKey = `category_${slug}`;
>>>>>>> e8a0b69400c985ecdc3d87f5e13e4a922745963b

    try {
        const data = await Category.findOneAndDelete({ slug }).exec();
        if (!data) {  return res.status(400).json({error: 'Category not found' }); }
<<<<<<< HEAD
      
=======
        // myCache.del(cacheKey);
        // myCache.del("categorieslist");
>>>>>>> e8a0b69400c985ecdc3d87f5e13e4a922745963b
        res.json({message: 'Category deleted successfully'});
    } catch (err) {res.status(400).json({error: errorHandler(err)});}   
};