import React, { useState } from 'react'
import { over } from 'stompjs';
import SockJS from 'sockjs-client';
import Connect from '../component/common/connect';
import StartRound from '../component/admin/start';
import ObstacleRound from '../component/admin/obstacle';
import AccelerationRound from '../component/admin/acceleration';
import FinishRound from '../component/admin/finish';

var stompClient = null;
export default function Player() {

    var round = 0
    const [roundState, setRoundState] = useState(0)
    const [ip, setIp] = useState('localhost')
    const [files, setFiles] = useState(null)
    const [startQuestions, setStartQuestions] = useState([])
    const [obstacle, setObstacle] = useState({})
    const [accelerationQuestions, setAccelerationQuestions] = useState([])
    const [finishQuestions, setFinishQuestions] = useState({})
    const [name, setName] = useState('host')
    const [time, setTime] = useState(0)
    const [users, setUsers] = useState([])
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
        if (payloadData.type === 'TIME') {
            setTime(payloadData.message)
        }
        if (payloadData.type === 'ROUND') {
            round = Number.parseInt(payloadData.message, 10)
            setRoundState(round)
        }
        if (payloadData.type === 'ANSWER') {
            setUsers(JSON.parse(payloadData.message))
        }
        if (round === 1) {
            startRound(payloadData)
        } else if (round === 2){
            obstacleRound(payloadData)
        } else if (round === 3) {
            accelerationRound(payloadData)
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
    }

    const obstacleRound = (payloadData) => {
        if (payloadData.type === 'OBSTACLE') {
            setObstacle(JSON.parse(payloadData.message))
        }
    }

    const accelerationRound = (payloadData) => {
    }

    const finishRound = (payloadData) => {

    }

    const uploadExcel = () => {
        const formData = new FormData()
        formData.append('file', files[0])
        fetch('http://' + ip + ':8080/file/excel-upload', {
            method: 'post',
            body: formData
        }).then(res => res.json())
            .then(data => {
                console.log(data)
                setStartQuestions(data.startQuestions)
                setObstacle(data.obstacle)
                setAccelerationQuestions(data.accelerationQuestions)
                setFinishQuestions(data.finishQuestions)
                alert('Upload successfully!')
            })

    }

    const uploadMedia = () => {
        const formData = new FormData()
        for (let i = 0; i < files.length; i++) {
            formData.append(`files`, files[i])
        }
        fetch('http://' + ip + ':8080/file/media-upload', {
            method: 'post',
            body: formData
        }).then(res => res.json())
        .then(data => {
            alert('Upload successfully!')
        })
    }

    const updateUser = () => {
        sendMessage(JSON.stringify(users), 'UPDATE')
    }

    return <div className='player-page'>
        <Connect
            ip={ip}
            setIp={setIp}
            name={name}
            setName={setName}
            connect={connect} />
        <input
            type='file'
            multiple={true}
            onChange={(e) => setFiles(e.target.files)} />
        <button
            className="admin-button"
            onClick={() => uploadExcel()}>
            Upload Excel
        </button>
        <button 
            className='admin-button'
            onClick={() => uploadMedia()}>
            Upload Media
            </button>
            <table>
            <thead>
                <th>Họ tên</th>
                <th>Avatar sửa</th>
                <th>Avatar hiện tại</th>
            </thead>
            <tbody>
                {users?.map((user, index) => {
                    return <tr
                        key={index}
                        className={user.answering ? "admin-user-item user-item__answer" : "admin-user-item"}>
                        <td><h3>{user.name}</h3></td>
                        <td>
                            <input
                                style={{ fontSize: "1rem", width: "100px" }}
                                defaultValue={user.avatar}
                                onChange={(e) => { user.avatar = e.target.value}} /></td>
                        <td><h3>{user.avatar}</h3></td>
                    </tr>
                })}
            </tbody>
        </table>
        <button className="admin-button" onClick={() => updateUser()}>Update</button>
        <StartRound
            questions={startQuestions}
            ip={ip}
            time={time}
            sendMessage={sendMessage}
            users={users} />
        <ObstacleRound
            time={time}
            sendMessage={sendMessage}
            obstacle={obstacle}
            users={users} />
        <AccelerationRound
            time={time}
            sendMessage={sendMessage}
            questions={accelerationQuestions}
            users={users}/>
        <FinishRound
            time={time}
            sendMessage={sendMessage}
            questions={finishQuestions}
            users={users}/>
    </div>
}