const HosptalDb = require('../../models/hospital');

const getAllHospital = () => {
  return new Promise(async (resolve, reject) => {
    try {
      data = await HosptalDb.find();
      ({
        errCode: 0,
        errMessage: 'get all data successfully ...',
        data: data,
      });
    } catch   (error) {
      reject(error);
    }
  });
};

module.exports = {
  getAllHospital,
};
