const ContactCollabService = require('../../services/contact/contactCollabService');

class ContactCollabController {
  // Create new contact
  async createContact(req, res, next) {
    try {
      const result = await ContactCollabService.handleCreateContact(req.body);
      return res.status(result.code).json(result);
    } catch (error) {
      next(error);
    }
  }

  // Get all contacts with pagination and filtering
  async getAllContact(req, res, next) {
    try {
      const result = await ContactCollabService.handleGetAllContact(req.query);
      return res.status(result.code).json(result);
    } catch (error) {
      next(error);
    }
  }

  // Get contact by ID
  async getContactById(req, res, next) {
    try {
      const result = await ContactCollabService.handleGetContactById(req.params.id);
      return res.status(result.code).json(result);
    } catch (error) {
      next(error);
    }
  }

  // Update contact
  async updateContact(req, res, next) {
    try {
      const result = await ContactCollabService.handleUpdateContact(req.params.id, req.body);
      return res.status(result.code).json(result);
    } catch (error) {
      next(error);
    }
  }

  // Delete contact
  async deleteContact(req, res, next) {
    try {
      const result = await ContactCollabService.handleDeleteContact(req.params.id);
      return res.status(result.code).json(result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ContactCollabController();
