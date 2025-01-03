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
}

module.exports = new RecordController();
