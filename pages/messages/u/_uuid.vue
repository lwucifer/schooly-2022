<script>
import * as actionTypes from "~/utils/action-types";
import { CHAT } from "~/utils/constants";
import Room from "~/services/chat/Room";

export default {
  // Page nay sinh ra tam thoi cho cong viec:
  // Lay uuid cua user de get private roomId cua user hien tai voi user do',
  // sau do redirect sang sang `/messages/t/${roomId}`
  async middleware({ redirect, params, $axios }) {
    try {
      const getRoom = await new Room($axios)[actionTypes.BASE.LIST]({
        params: {
          fetch_type: CHAT.FETCH_PRIVATE_ROOM_BY_FRIEND_ID,
          friend_id: params.uuid
        }
      });
  
      if (getRoom.data) {
        const { room = {} } = getRoom.data;
        redirect(`/messages/t/${room ? room.id : ''}`)
      } else {
        redirect('/400')
      }
    } catch (error) {
      error({
        statusCode: error.code || 404,
        message: error.message
      })
    }
  }
}
</script>
