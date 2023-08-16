import React, { useEffect, useState } from 'react'
import { over } from 'stompjs';
import SockJS from 'sockjs-client';
import ScoreItem from './ScoreItem';
import answerSound from '../resources/audio/answer.mp3'
import trueSound from '../resources/audio/true.mp3'
import falseSound from '../resources/audio/false.mp3'
import threeSecondSound from '../resources/audio/3s.mp3'
import startSound from '../resources/audio/start.mp3'

var stompClient = null;

export default function Test() {

    let answerAudio = new Audio(answerSound)
    let trueAudio = new Audio(trueSound)
    let falseAudio = new Audio(falseSound)
    let threeSecondAudio = new Audio(threeSecondSound) 
    let startAudio = new Audio(startSound)

    const [ip, setIp] = useState('localhost')
    const [time, setTime] = useState(0)
    const [users, setUsers] = useState([])
    const [question, setQuestion] = useState('')
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
            || payloadData.type === 'DELETE') {
            console.log(users)
            setUsers(JSON.parse(payloadData.message))
        }
        if (payloadData.type === 'START') {
            startAudio.play()
        }
        if (payloadData.type === 'TIME' && payloadData.message === '3') {
            threeSecondAudio.play()
        }
        if (payloadData.type === 'TRUE') {
            setUsers(JSON.parse(payloadData.message))
            trueAudio.play()
        }
        if (payloadData.type === 'FALSE') {
            setUsers(JSON.parse(payloadData.message))
            falseAudio.play()
        }
        if (payloadData.type === 'ANSWER') {
            setUsers(JSON.parse(payloadData.message))
            answerAudio.play()
        }
        if (payloadData.type === 'QUESTION') {
            setQuestion(payloadData.message)
        }
    }

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
                    return <ScoreItem user={user} key={index} />
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