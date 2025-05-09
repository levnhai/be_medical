const RecordService = require('../../services/record/RecordService');

class RecordController {
  async handleCreateRecord(req, res, next) {
    const { formData } = req.body;
    let result = await RecordService.handleCreateRecord(formData);
    return res.status(result.code).json({
      result,
    });
  }

  async handlegetRecordById(req, res, next) {
    const { recordId } = req.body;
    let result = await RecordService.handlegetRecordById(recordId);
    return res.status(result.code).json({
      result,
    });
  }

  async handleDeleteRecord(req, res, next) {
    const recordId = req.params.id;

    let result = await RecordService.handleDeleteRecord(recordId);
    return res.status(result.code).json({
      result,
    });
  }

  async handleUpdateRecord(req, res, next) {
    const recordId = req.params.id;
    const formData = req.body;

    let result = await RecordService.handleUpdateRecord(recordId, formData);
    return res.status(result.code).json({
      result,
    });
  }
}

module.exports = new RecordController();
