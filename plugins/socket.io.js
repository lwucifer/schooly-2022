import io from 'socket.io-client'


/**
 * http://178.128.80.30:9994?user_id=xxx&token=xxx&unique_id=xxx
 */
const socket = io(process.env.SOCKET_URI)

export default socket