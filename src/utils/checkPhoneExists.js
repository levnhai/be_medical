const _Account = require('../models/account');

function isCheckPhoneExists(phoneNumberInput) {
  return new Promise(async (resolve, reject) => {
    try {
      let isCheckPhoneExists = await _Account.findOne({
        phoneNumber: phoneNumberInput,
      });

      if (isCheckPhoneExists) {
        resolve(true);
      } else {
        resolve(false);
      }
    } catch (error) {
      reject(error);
    }
  });
}

module.exports = { isCheckPhoneExists };
