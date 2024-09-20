const mongoose = require('mongoose');
const CategoryNews = require('../models/CategoryNews');

// Lấy tất cả các thể loại
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await CategoryNews.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Lấy thể loại theo ID
exports.getCategoryById = async (req, res) => {
  try {
    const category = await CategoryNews.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Tạo mới thể loại
exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }

    const newCategory = new CategoryNews({ name, description });
    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Cập nhật thể loại
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid category ID' });
    }

    const { name, description } = req.body;
    const updateFields = { name, description, updatedAt: new Date() };

    Object.keys(updateFields).forEach(
      (key) => updateFields[key] === undefined && delete updateFields[key]
    );

    const updatedCategory = await CategoryNews.findByIdAndUpdate(id, updateFields, { new: true });

    if (!updatedCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json(updatedCategory);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Xóa thể loại
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid category ID' });
    }

    const deletedCategory = await CategoryNews.findByIdAndDelete(id);
    if (!deletedCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json({ message: 'Category deleted' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};