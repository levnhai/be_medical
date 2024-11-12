const _Contact = require('../../models/contactCollab');

// handle create contact
const handleCreateContact = (contactData) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Set default status to "đang chờ" if not provided
            contactData.status = contactData.status || 'Đang chờ';

            const newContact = new _Contact(contactData);
            const savedContact = await newContact.save();

            resolve({
                code: 201,
                message: 'Tạo liên hệ thành công',
                status: true,
                data: savedContact
            });
        } catch (error) {
            if (error.code === 11000) {
                resolve({
                    code: 400,
                    message: 'Số điện thoại đã tồn tại',
                    status: false
                });
            } else {
                reject(error);
            }
        }
    });
};


// handle get all contact
const handleGetAllContact = (query) => {
    return new Promise(async (resolve, reject) => {
        try {
            const page = parseInt(query?.page) || 1;
            const limit = parseInt(query?.limit) || 10;
            const skip = (page - 1) * limit;

            // Build filter object
            const filter = {};
            if (query?.status) filter.status = query.status;
            if (query?.search) {
                filter.$or = [
                    { fullName: { $regex: query.search, $options: 'i' } },
                    { email: { $regex: query.search, $options: 'i' } },
                    { phoneNumber: { $regex: query.search, $options: 'i' } }
                ];
            }

            const data = await _Contact.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit);

            const total = await _Contact.countDocuments(filter);

            resolve({
                code: 200,
                message: 'Lấy dữ liệu thành công',
                status: true,
                total,
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                data
            });
        } catch (error) {
            reject(error);
        }
    });
};

// handle get contact by id
const handleGetContactById = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const data = await _Contact.findById(id);
            if (!data) {
                resolve({
                    code: 404,
                    message: 'Không tìm thấy liên hệ',
                    status: false
                });
                return;
            }
            resolve({
                code: 200,
                message: 'Lấy dữ liệu thành công',
                status: true,
                data
            });
        } catch (error) {
            reject(error);
        }
    });
};

// handle update contact
const handleUpdateContact = (id, updateData) => {
    return new Promise(async (resolve, reject) => {
        try {
            updateData.updatedAt = new Date();
            const updatedContact = await _Contact.findByIdAndUpdate(
                id,
                updateData,
                { new: true, runValidators: true }
            );

            if (!updatedContact) {
                resolve({
                    code: 404,
                    message: 'Không tìm thấy liên hệ',
                    status: false
                });
                return;
            }

            resolve({
                code: 200,
                message: 'Cập nhật thành công',
                status: true,
                data: updatedContact
            });
        } catch (error) {
            if (error.code === 11000) {
                resolve({
                    code: 400,
                    message: 'Số điện thoại đã tồn tại',
                    status: false
                });
            } else {
                reject(error);
            }
        }
    });
};

// handle delete contact
const handleDeleteContact = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const deletedContact = await _Contact.findByIdAndDelete(id);
            if (!deletedContact) {
                resolve({
                    code: 404,
                    message: 'Không tìm thấy liên hệ',
                    status: false
                });
                return;
            }
            resolve({
                code: 200,
                message: 'Xóa thành công',
                status: true
            });
        } catch (error) {
            reject(error);
        }
    });
};

module.exports = {
    handleCreateContact,
    handleGetAllContact,
    handleGetContactById,
    handleUpdateContact,
    handleDeleteContact
};