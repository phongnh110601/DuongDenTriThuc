import React, { useEffect, useState } from 'react'
import { over } from 'stompjs';
import SockJS from 'sockjs-client';
import ScoreItem from './ScoreItem';

var stompClient = null;

export default function Test() {

    const [ip, setIp] = useState('localhost')
    const [time, setTime] = useState(0)
    const [users, setUsers] = useState([])
    const [question, setQuestion] = useState('')
    const [answer, setAnswer] = useState('')
    const [userData, setUserData] = useState({
        name: '',
        connected: false,
        message: ''
    })

    useEffect(() => {
    }, []);

    const connect = () => {
        let Sock = new SockJS('http://' + ip + ':8080/ws');
        stompClient = over(Sock);
        stompClient.connect({}, onConnected, onError);
    }

    const onConnected = () => {
        setUserData({ ...userData, connected: true });
        stompClient.subscribe('/test/public', onMessageReceived);
        join();
    }

    const join = () => {
        var chatMessage = {
            senderName: userData.name,
            type: "JOIN"
        };
        stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
    }

    const onMessageReceived = (payload) => {
        var payloadData = JSON.parse(payload.body);
        console.log(payloadData)
        if (payloadData.type === 'TIME') {
            setTime(payloadData.message)
        }
        if (payloadData.type === 'JOIN' 
        || payloadData.type === 'TRUE' 
        || payloadData.type === 'FALSE'
        || payloadData.type === 'ANSWER') {
            setUsers(JSON.parse(payloadData.message))
        }
        if (payloadData.type === 'QUESTION') {
            setQuestion(payloadData.message)
        }
        
    }

    // const updateUsers = (senderName) => {
    //     console.log(senderName)
    //     users.map((user) => {
    //         console.log(user)
    //     })
    // }

    const onError = (err) => {
        console.log('Error: ' + err);

    }

    const sendValue = (message, type) => {
        if (stompClient) {
            var chatMessage = {
                senderName: userData.name,
                message: message,
                type: type
            };
            stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
            setUserData({ ...userData, "message": "" });
        }
    }

    const answerQuestion = () => {
        sendValue('', 'ANSWER')
    }

    return userData.connected ?
        <div>
            <h1>{time}</h1>
            <p>{question}</p>
            <button
                onClick={() => answerQuestion()}>
                Answer
            </button>
            <div>
                {users.map((user, index) => {
                    return <ScoreItem user={user} key={index}/>
                })}
            </div>

        </div>
        :
        <div>
            <input
                placeholder='Enter ip:'
                value={ip}
                onChange={(e) => setIp(e.target.value)} />
            <input
                placeholder='Enter name:'
                value={userData.name}
                onChange={(e) => setUserData({ ...userData, name: e.target.value })} />
            <button
                onClick={() => connect()}>
                Join
            </button>
        </div>
}