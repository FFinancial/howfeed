import mongoose from 'mongoose';
import mongoose_fuzzy_searching from 'mongoose-fuzzy-searching';

const { Schema } = mongoose;
const ArticleSchema = new Schema({
    title: { type: String, required: true, index: { unique: true } },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    slug: { type: String, index: { unique: true } },
    description: { type: String, required: false },
    image: { type: String, required: true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date },
    html: { type: String, required: true },
    comments: [{
        content: { type: String, required: true },
        author: { type: String },
        author_user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        created_at: { type: Date, default: Date.now },
        votes: { type: Number, default: 0 }
    }],
    views: { type: Number, default: 0 },
    votes: { type: Number, default: 0 },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    }
});


ArticleSchema.methods.genSlug = title => title.toLowerCase().replace(/\W+/g, '-');

ArticleSchema.plugin(mongoose_fuzzy_searching, {
    fields: ['html', 'title'],
    middlewares: {
        preSave: function () {
            var article = this;
            // only gen the slug if title has been modified (or is new)
            if (!article.isModified('title'))
                return;

            article.slug = article.genSlug(article.title);
        }
    }
});

export default mongoose.model('Article', ArticleSchema);
