import mongoose from 'mongoose';

const { Schema } = mongoose;
const MemoSchema = new Schema({
    message: { type: String, required: true },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    time: { type: Date, default: Date.now }
});

export default mongoose.model('Memo', MemoSchema);
