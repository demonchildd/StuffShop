import { useEffect, useState } from "react"
import SocketApi from "../api/socket-api"


export const useConnectSocket = () => {
    const [message, setMessage] = useState('')

    const connectSocket = () => {

        SocketApi.createConnection();
        SocketApi.socket?.on('client-path', (data) => {
            setMessage(data.dto)
        })
    }
    
    useEffect(() => {
        connectSocket()
    }, [])

    return {message};
}