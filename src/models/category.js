import mongoose from 'mongoose';

const { Schema } = mongoose;
const CategorySchema = new Schema({
    name: { type: String, required: true, index: { unique: true } },
    slug: { type: String, index: { unique: true } }
});


CategorySchema.methods.genSlug = name => name.toLowerCase().replace(/\W+/g, '-');

CategorySchema.pre('save', function (next) {
    var cat = this;
    // only gen the slug if name has been modified (or is new)
    if (!cat.isModified('name')) return next();

    cat.slug = cat.genSlug(cat.name);
    next();
});

export default mongoose.model('Category', CategorySchema);
