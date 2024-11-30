const mongoose = require('mongoose');
const slugify = require('slugify');

const newsPostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: {
    type: {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'authorModel'
      },
      fullName: {
        type: String,
        required: true
      }
    },
    required: true
  },
  authorModel: {
    type: String,
    required: true,
    enum: ['Hospital', 'Docter']
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  slug: { type: String, required: true, unique: true },
  status: {
    type: Number,
    enum: [1, 2, 3],
    default: 2,
  },
  tags: [{ type: String }],
  category: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'CategoryNews', 
    required: true 
  },
  views: { type: Number, default: 0 },
  imageUrl: { type: String, required: true }
});

// Tạo slug tự động từ title
newsPostSchema.pre('validate', function (next) {
  if (!this.slug && this.title) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

module.exports = mongoose.model('NewsPost', newsPostSchema);