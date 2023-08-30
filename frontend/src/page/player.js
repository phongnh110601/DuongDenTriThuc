import React, { useState } from 'react'
import { over } from 'stompjs';
import SockJS from 'sockjs-client';
import Connect from '../component/common/connect';
import StartRound from '../component/player/start';
import ObstacleRound from '../component/player/obstacle';

var stompClient = null;
export default function Player() {

    const [ip, setIp] = useState('26.241.252.201')
    const [name, setName] = useState('')
    const [round, setRound] = useState(1)
    const [users, setUsers] = useState([
        {
            name: "Phong",
            score: 0
        },
        {
            name: "Phong",
            score: 0
        },
        {
            name: "Phong",
            score: 0
        },
        {
            name: "Phong",
            score: 0
        }
    ])
    const [question, setQuestion] = useState({})
    const [time, setTime] = useState(3)
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
        if (payloadData.type === 'QUESTION') {
            console.log(payloadData.message)
            setQuestion(JSON.parse(payloadData.message))
        }
        if (payloadData.type === 'TIME') {
            setTime(payloadData.message)
        }
    }
    return <div className='player-page'>
        <StartRound
            time={time}
            name={name}
            sendMessage={sendMessage}
            users={users}
            question={question} />

        {/* <Connect
            ip={ip}
            setIp={setIp}
            name={name}
            setName={setName}
            connect={connect} /> */}
        <ObstacleRound
            time={time}
            name={name}
            sendMessage={sendMessage}
            users={users} />
    </div>
}