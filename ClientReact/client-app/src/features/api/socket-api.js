import io from "socket.io-client"
import { url } from "../../utils/constants";

class SocketApi {
    static socket = null;
    static createConnection() {
       this.socket = io(url);

       this.socket.on("connect", () => {
            console.log('CONNECTED');
       })

       this.socket.on("disconnect", (e) => {
            console.log('DISCONNECTED');
        })
    }
}

export default SocketApi;