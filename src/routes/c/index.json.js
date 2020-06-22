import Category from '../../models/category.js';

export async function get(req, res)
{
    let categories = await Category.find();
    res.writeHead(200, {
        'Content-Type': 'application/json'
    });
    res.end(JSON.stringify(categories));
}
