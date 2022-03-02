import { getDeviceId, getFirebaseToken, getToken } from "~/utils/auth";
import { DEVICE_TYPE } from "~/utils/constants";
import { detectBrowser } from "~/utils/common";

class RegisterDevice {
  constructor(props = {}) {
    this.device_id = props.device_id;
    this.os = props.os;
    this.device_type = props.device_type;
    this.token = props.token;
    // this.user_id = props.user_id;
  }
}

export function createRegisterDeviceModel() {
  let payload = {};
  const userLogin = getToken();

  payload.device_id = getDeviceId();
  payload.os = detectBrowser();
  payload.device_type = DEVICE_TYPE.WEB;
  payload.token = getFirebaseToken();
  // payload.user_id = !!userLogin ? userLogin.id : null;
  console.log("[createRegisterDeviceModel]", payload);

  return Object.freeze(new RegisterDevice(payload));
}
