import React, { useState } from 'react'
import { over } from 'stompjs';
import SockJS from 'sockjs-client';
import '../index.css'
import ScoreItem from './ScoreItem';

var stompClient = null;

export default function Admin() {

    const [file, setFile] = useState(null)
    const [ip, setIp] = useState('localhost')
    const [time, setTime] = useState(0)
    const [index, setIndex] = useState(-1)
    const [users, setUsers] = useState([])
    const [questions, setQuestions] = useState([])
    const [userData, setUserData] = useState({
        name: 'host',
        connected: false,
        message: '',
        password: ''
    })

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
        || payloadData.type === 'ANSWER'
        || payloadData.type === 'DELETE') {
            setUsers(JSON.parse(payloadData.message))
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
            setUserData({ ...userData, message: "" });
        }
    }

    const upload = () => {
        const formData = new FormData()
        formData.append('file', file)
        fetch('http://' + ip + ':8080/file/excel-upload', {
            method: 'post',
            body: formData
        }).then(res => res.json())
            .then(data => {
                setQuestions(data)
                alert('Upload successfully!')
            })
    }

    const loadJSON = () => {
        console.log(file)
        var reader = new FileReader()
        reader.onload = (event) => {
            setQuestions(JSON.parse(event.target.result))
            alert('Load successfully!')
        }
        reader.readAsText(file)
        setIndex(-1)
    }

    const displayQuestion = () => {
        sendValue(questions[index + 1].question, 'QUESTION')
        setIndex(index + 1)
    }

    const deleteUser = (name) => {
        sendValue(name, 'DELETE')
    }

    const start = () => {
        sendValue('', 'START')
    }
    return userData.connected ?
        <div>

            <input
                type='file'
                onChange={(e) => setFile(e.target.files[0])} />
            <button
                onClick={() => upload()}>
                Upload
            </button>
            <button
                onClick={() => loadJSON()}>
                Load JSON
            </button>
            <h1>{time}</h1>
            <p>{questions[index]?.question}</p>
            <b>{questions[index]?.answer}</b>
            <br/>
            <button onClick={() => start()}>Start</button>
            
            <div id='true-false-container'>
                <button onClick={() => displayQuestion()}>Display</button>
                <button onClick={() => sendValue('', 'COUNT')}>Time</button>
            </div>
            <div id='true-false-container'>
                <button onClick={() => sendValue('', 'TRUE')}>True</button>
                <button onClick={() => sendValue('', 'FALSE')}>False</button>
            </div>
            <div>
                {users.map((user, index) => {
                    return <ScoreItem user={user} key={index}  deleteUser={deleteUser} isAdmin={true}/>
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