import React, { useState } from 'react'
import { over } from 'stompjs';
import SockJS from 'sockjs-client';
import Connect from '../component/common/connect';
import StartRound from '../component/admin/start';
import ObstacleRound from '../component/admin/obstacle';

var stompClient = null;
export default function Player() {

    const [ip, setIp] = useState('localhost')
    const [name, setName] = useState('host')
    const [time, setTime] = useState(3)
    const [round, setRound] = useState(1)
    const [users, setUsers] = useState([
        // {
        //     name: "Nguyễn Hải Phong",
        //     score: 120
        // },
        // {
        //     name: "Tạ Thị Vân Anh",
        //     score: 130
        // },
        // {
        //     name: "Nguyễn Mai Thu Trang",
        //     score: 130
        // },
        // {
        //     name: "Nguyễn Doãn Tài",
        //     score: 130
        // }
    ])
    const [isConnected, setIsConnected] = useState(false)

    const connect = () => {
        let socket = new SockJS('http://' + ip + ':8080/ws');
        stompClient = over(socket);
        stompClient.connect({
            name: name
        }, onConnected, onError);
    }

    const onConnected = () => {
        stompClient.subscribe('/test/public', onMessageReceived);
        sendMessage('', 'JOIN')
        setIsConnected(true)
    }

    const onError = (err) => {
        console.log('Error: ' + err);
    }

    const onMessageReceived = (payload) => {
        var payloadData = JSON.parse(payload.body);
        console.log(payloadData)
        if (payloadData.type === 'JOIN') {
            setUsers(JSON.parse(payloadData.message))
        }
        if (payloadData.type === 'UPDATE') {
            setUsers(JSON.parse(payloadData.message))
        }
        if (round === 1) {
            startRound(payloadData)
        }
    }

    const sendMessage = (message, type) => {
        if (stompClient) {
            var chatMessage = {
                message: message,
                type: type
            };
            stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
        }
    }

    const startRound = (payloadData) => {
        if (payloadData.type === 'ANSWER') {
            setUsers(JSON.parse(payloadData.message))
        }
        if (payloadData.type === 'TIME') {
            setTime(payloadData.message)
        }
    }
    return <div className='player-page'>
        {
            // isConnected ?
            //     <StartRound
            //         ip={ip}
            //         time={time}
            //         sendMessage={sendMessage}
            //         users={users}/>
            //     :
            //     <Connect
            //         ip={ip}
            //         setIp={setIp}
            //         name={name}
            //         setName={setName}
            //         connect={connect} />
            <ObstacleRound/>
        }
    </div>
}