import Tag from '../models/tag.js';
import slugify from "slugify";
import { errorHandler } from "../helpers/dbErrorHandler.js";
import Blog from "../models/blog.js"


export const create = async (req, res) => {
    try {
        const { name, description } = req.body;
        const slug = slugify(name).toLowerCase();
        const tag = new Tag({ name, description, slug });
        const data = await tag.save();
        res.json(data);
    } catch (err) { res.status(400).json({ error: errorHandler(err) }); }
};


export const list = async (req, res) => {
   
<<<<<<< HEAD
    
        
    try {
        const data = await Tag.find({}).select('_id name description slug').exec();
=======
    // const cachedData = myCache.get("tagslist");
    // if (cachedData) {return res.json(cachedData);}
        
    try {
        const data = await Tag.find({}).select('_id name description slug').exec();
        // myCache.set("tagslist", data, 3000);
>>>>>>> e8a0b69400c985ecdc3d87f5e13e4a922745963b
        res.json(data);
    } catch (err) { res.status(400).json({ error: errorHandler(err) }); }
};


export const read = async (req, res) => {
    const slug = req.params.slug.toLowerCase();
<<<<<<< HEAD
    
=======
    // const cacheKey = `tag_${slug}`;

    // const cachedData = myCache.get(cacheKey);
    // if (cachedData) {return res.json(cachedData);}

>>>>>>> e8a0b69400c985ecdc3d87f5e13e4a922745963b
    try {
        const tag = await Tag.findOne({ slug }).select('_id name slug').exec();
        if (!tag) { return res.status(400).json({ error: 'Tag not found' }); }

        const blogs = await Blog.find({ tags: tag })
            .populate('categories', '_id name slug')
            .populate('tags', '_id name slug')
            .populate('postedBy', '-_id name username')
            .select('-_id title photo slug excerpt categories date postedBy tags')
            .exec();

<<<<<<< HEAD
=======
            // myCache.set(cacheKey, { tag, blogs }, 3000);
>>>>>>> e8a0b69400c985ecdc3d87f5e13e4a922745963b

        res.json({ tag, blogs });
    } catch (err) { res.status(400).json({ error: errorHandler(err) }); }
};



export const remove = async (req, res) => {
    const slug = req.params.slug.toLowerCase();
<<<<<<< HEAD
    try {
        const data = await Tag.findOneAndDelete({ slug }).exec();
        if (!data) { return res.status(400).json({ error: 'Tag not found' }); }
       
=======
    // const cacheKey = `tag_${slug}`;
    try {
        const data = await Tag.findOneAndDelete({ slug }).exec();
        if (!data) { return res.status(400).json({ error: 'Tag not found' }); }
        // myCache.del(cacheKey);
        // myCache.del("tagslist");
>>>>>>> e8a0b69400c985ecdc3d87f5e13e4a922745963b
        res.json({ message: 'Tag deleted successfully' });
    } catch (err) {res.status(400).json({error: errorHandler(err)}); } 
};