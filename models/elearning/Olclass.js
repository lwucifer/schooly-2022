import numeral from "numeral";
import { toNumber } from "lodash";

class dto {
  constructor(payload) {
    if (payload.elearning_id) {
      this.elearning_id = payload.elearning_id;
    }
    if (payload.enable) {
      this.enable = payload.enable;
    }
    if (payload.id) {
      this.id = payload.id;
    }
    if (payload.is_allow_download) {
      this.is_allow_download = payload.is_allow_download;
    }
    if (payload.name) {
      this.is_invite_all = payload.is_invite_all;
    }
    if (payload.name) {
      this.name = payload.name;
    }

    if (payload.schedules) {
      this.schedules = JSON.stringify(payload.schedules);
    }
  }
}

export function createPayloadAddOlclass(payload) {
  return Object.freeze(new dto(payload));
}