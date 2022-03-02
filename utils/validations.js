/**
 * validate for email
 */
export const validateEmail = (_email) => {
    let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{1,}))$/;
    return re.test(_email);
};

/**
 * validate for phone (not contains country code)
 */
export const validatePhone = (_phone) => {
    let re = /(09|03|07|08|05])+([0-9]{8,9})\b/;
    return re.test(_phone);
};

/**
 * validate for IP Address, Netmask, subnet mask, fixed IP, Gateway,
 */
export const validateIpAddress = (_ip) => {
    console.log("[validations] validateIpAddress", _ip);
    return /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(
        _ip
    );
};

/**
 * validate MAC Address
 * @param {mac_address} _mac
 */
export const validateMacAddress = (_mac) => {
    console.log("[validations] validateMacAddress", _mac);
    return /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/.test(_mac);
};

/**
 * validate Address Range: ip_address/number
 *  ip_address : Địa chỉ IP
    number : số từ 0-> 32
    ví dụ : 1.1.11.2/24
 * @param {mac_address} _mac 
 */
export const validateAddressRange = (_addressRange) => {
    console.log("[validations] validateAddressRange", _addressRange);
    if (!_addressRange) return false;
    const splits = _addressRange.split("/");
    if (splits.length != 2) return false;

    const ipAddress = splits[0];
    const _number = splits[1];

    if (!validateIpAddress(ipAddress)) return false;

    if (!Number.isInteger(parseInt(_number))) return false;
    if (isNaN(_number)) return false;
    if (parseInt(_number) < 0 || parseInt(_number) > 32) return false;

    return true;
};

/**
 * validate username setting
 * @param {username} _username
 */
export const validateUsername = (_username) => {
    console.log("[validations] validateUsername", _username);
    return /^([a-zA-Z0-9]+)$/.test(_username);
};

/**
 * validate number
 * @param {number} _number
 */
export const validateNumber = (_number) => {
    console.log("[validations] validateNumber", _number);
    return /^([0-9]+)$/.test(_number);
};
/**
 * validate number
 * @param {price} _price
 */
export const validatePrice = (_price) => {
    return /^(\d*([.,](?=\d{2}))?\d+)+((?!\2)[.,]\d\d)?$/.test(_price);
};
/**
 * validate port setting
 * @param {port} _port
 */
export const validatePort = (_port) => {
    if (parseFloat(_port) > 65535) return false;
    return true;
};

/**
 * format phone number
 * @param {phoneNumber} _phoneNumber
 */
export const formatPhoneNumber = (_phoneNumber) => {
    if (_phoneNumber.indexOf("0") == 0) {
        return _phoneNumber.replace("0", "84");
    } else {
        return _phoneNumber;
    }
};
/**
 * validate password
 * @param {password} _password
 */
export const validatePassword = (_password) => {
    let re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,127}$/;
    return re.test(_password);
};

/**
 * Validate script tag
 * @param {String} string
 */
export const validateScriptTag = (string) => {
    const regex = /<[^>]*script/g;
    return regex.test(string);
};

/**
 * Check editor empty ( match <p></p>, <p>  </p>, <p><br></p>)
 * @param {String} content
 */
export const checkEditorEmpty = (content) => {
    const regex = /^(<p>)(<\/\p>)$/;
    return !content || regex.test(content);
};

/**
 * Replace empty tag ( match <p></p>, <p>  </p>, <p><br></p>)
 * @param {String} content
 */
export const clearEmptyTag = (content) => {
    const regex = /(<p>)+(<br>){0,}?\s{0,}?(<\/\p>)/g;
    return typeof content === "string"
        ? content.replace(regex, "").replace(/(<br>){2,}/g, "")
        : "";
};
