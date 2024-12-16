export const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN').format(value)+' VND';
};
export const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0'); // Lấy ngày và thêm số 0 nếu cần
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
};
export const parseCurrency = (formattedValue) => {
    // Loại bỏ ký tự 'VND' và các dấu phân cách, sau đó chuyển về số
    const numericValue = formattedValue
        .replace(' VND', '') // Loại bỏ ' VND'
        .replace(/[.,\s]/g, ''); // Loại bỏ các dấu chấm, dấu phẩy, khoảng trắng
    return Number(numericValue); // Chuyển chuỗi thành số
};

export const isInt = (value) => {
    return Number.isInteger(Number(value));
}
export const upperFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export const upperFirstLetterEachWord = (str) => {
    return str.split(' ').map(word => upperFirstLetter(word)).join(' ');
}
