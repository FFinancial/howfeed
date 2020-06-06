import mongoose from 'mongoose';

const { Schema } = mongoose;
const ArticleSchema = new Schema({
    title: { type: String, required: true, index: { unique: true } },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    slug: { type: String, required: true, index: { unique: true } },
    created_at: { type: Date, default: Date.now },
    html: { type: Blob, required: true },
    comments: [{
        content: { type: String, required: true },
        author: { type: String, required: true },
        created_at: { type: Date, default: Date.now },
        votes: { type: Number, default: 0 }
    }],
    votes: { type: Number, default: 0 }
});


ArticleSchema.pre('save', next => {
    var article = this;
    // only gen the slug if title has been modified (or is new)
    if (!article.isModified('title')) return next();
    
    article.slug = article.genSlug(article.title);
    next();
});

ArticleSchema.methods.genSlug = () => this.title.toLowerCase().replace(/\W+/g, '-');

export default mongoose.model('Article', ArticleSchema);
