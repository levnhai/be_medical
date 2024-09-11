const mongoose = require('mongoose');
const slugify = require('slugify');
const CategoryNews = require('./CategoryNews');

const newsPostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  slug: { type: String, required: true, unique: true },
  status: { type: String, enum: ['draft', 'published', 'deleted'], default: 'draft' },
  tags: [{ type: String }],
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'CategoryNews', required: true },
  views: { type: Number, default: 0 },
  isFeatured: { type: Boolean, default: false },
  imageUrl: { type: String, required: true } // Bắt buộc phải có giá trị
});

// Tạo slug tự động từ title
newsPostSchema.pre('validate', function (next) {
  if (!this.slug && this.title) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

module.exports = mongoose.model('NewsPost', newsPostSchema);
