const mongoose = require('mongoose');
const slugify = require('slugify');

const categoryNewsSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, unique: true }, 
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
});

// Tạo slug tự động từ name trước khi lưu vào database
categoryNewsSchema.pre('save', function (next) {
  if (this.name) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

module.exports = mongoose.model('CategoryNews', categoryNewsSchema);
