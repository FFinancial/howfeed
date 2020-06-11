import mongoose from 'mongoose';

const { Schema } = mongoose;
const ArticleSchema = new Schema({
    title: { type: String, required: true, index: { unique: true } },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    slug: { type: String, index: { unique: true } },
    image: { type: String, required: true },
    created_at: { type: Date, default: Date.now },
    html: { type: String, required: true },
    comments: [{
        content: { type: String, required: true },
        author: { type: String, required: true },
        created_at: { type: Date, default: Date.now },
        votes: { type: Number, default: 0 }
    }],
    views: { type: Number, default: 0 },
    votes: { type: Number, default: 0 }
});


ArticleSchema.virtual('author_user', {
    ref: 'User',
    localField: 'author',
    foreignField: '_id',
    justOne: true
});

ArticleSchema.methods.genSlug = title => title.toLowerCase().replace(/\W+/g, '-');

ArticleSchema.pre('findOne', function (next) {
    var article = this;
    article.views++;
    next();
});

ArticleSchema.pre('save', function (next) {
    var article = this;
    // only gen the slug if title has been modified (or is new)
    if (!article.isModified('title')) return next();

    article.slug = article.genSlug(article.title);
    next();
});

export default mongoose.model('Article', ArticleSchema);
