import React, { useState } from 'react'
import { over } from 'stompjs';
import SockJS from 'sockjs-client';
import Connect from '../component/common/connect';
import StartRound from '../component/admin/start';
import ObstacleRound from '../component/admin/obstacle';
import AccelerationRound from '../component/admin/acceleration';
import FinishRound from '../component/admin/finish';
import ExtraRound from '../component/admin/extra';

var stompClient = null;
export default function Player() {

    const [ip, setIp] = useState('localhost')
    const [files, setFiles] = useState(null)
    const [startQuestions, setStartQuestions] = useState([])
    const [obstacle, setObstacle] = useState({})
    const [accelerationQuestions, setAccelerationQuestions] = useState([])
    const [finishQuestions, setFinishQuestions] = useState({})
    const [name, setName] = useState('host')
    const [time, setTime] = useState(0)
    const [users, setUsers] = useState([])
    const [extraQuestions, setExtraQuestions] = useState([])
    const [isConnected, setIsConnected] = useState(false)
    var round = 0

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
        if (payloadData.type === 'USER') {
            setUsers(JSON.parse(payloadData.message))
        }
        if (payloadData.type === 'TIME') {
            setTime(payloadData.message)
        }
        if (payloadData.type === 'ANSWER') {
            setUsers(JSON.parse(payloadData.message))
        }
        if (payloadData.type === 'OBSTACLE') {
            setObstacle(JSON.parse(payloadData.message))
        }
        if (payloadData.type === 'ROUND' || payloadData.type === 'START') {
            round = Number.parseInt(payloadData.message, 10)
        }
        if (round === 1) {
            startRound(payloadData)
        } else if (round === 2) {
            obstacleRound(payloadData)
        } else if (round === 3) {
            accelerationRound(payloadData)
        } else if (round === 4) {
            finishRound(payloadData)
        }
    }

    const startRound = (payloadData) => {
        if (payloadData.type === 'TRUE' || payloadData.type === 'FALSE') {
            setUsers(JSON.parse(payloadData.message))
        }
    }

    const obstacleRound = (payloadData) => {
        if (payloadData.type === 'TRUE' || payloadData.type === 'FALSE') {
            setUsers(JSON.parse(payloadData.message))
        }
        if (payloadData.type === 'ANSWER_OBSTACLE') {
            setUsers(JSON.parse(payloadData.message))
        }
    }

    const accelerationRound = (payloadData) => {
        if (payloadData.type === 'TRUE' || payloadData.type === 'FALSE') {
            setUsers(JSON.parse(payloadData.message))
        }
    }

    const finishRound = (payloadData) => {
        if (payloadData.type === 'TRUE' || payloadData.type === 'FALSE') {
            setUsers(JSON.parse(payloadData.message))
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

    const uploadExcel = () => {
        const formData = new FormData()
        formData.append('file', files[0])
        fetch('http://' + ip + ':8080/file/excel-upload', {
            method: 'post',
            body: formData
        }).then(res => res.json())
            .then(data => {
                console.log(data)
                setStartQuestions(data?.startQuestions)
                setObstacle(data?.obstacle)
                setAccelerationQuestions(data?.accelerationQuestions)
                setFinishQuestions(data?.finishQuestions)
                setExtraQuestions(data?.extraQuestions)
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
        sendMessage(JSON.stringify(users), 'USER')
    }

    return <div className='admin-page'>
        <Connect
            ip={ip}
            setIp={setIp}
            name={name}
            setName={setName}
            connect={connect} />
        <button className='admin-button'>
            <input
                type='file'
                className='file-input'
                multiple={true}
                onChange={(e) => setFiles(e.target.files)} />
            Chọn file
        </button>
        <span>{files?.[0]?.name}</span>
        <button
            className="admin-button"
            onClick={() => uploadExcel()}>
            Upload Excel
        </button>
        <button
            className='admin-button'
            onClick={() => uploadMedia()}>
            Upload media
        </button>

        <table>
            <thead>
                <tr>
                    <th>Họ tên</th>
                    <th>Avatar sửa</th>
                    <th>Avatar hiện tại</th>
                </tr>
            </thead>

            <tbody>
                {users?.map((user, index) => {
                    return <tr
                        key={index}
                        className={user.answering ? "admin-user-item user-item__answer" : "admin-user-item"}>
                        <td>
                            <input
                                style={{ fontSize: "1rem", width: "300px" }}
                                value={user.name}
                                onChange={(e) => {
                                    let newUsers = [...users]
                                    newUsers[index].name = e.target.value
                                    setUsers(newUsers)
                                }} 
                            />
                        </td>
                        <td>
                            <input
                                style={{ fontSize: "1rem", width: "200px" }}
                                defaultValue={user.avatar}
                                onChange={(e) => {
                                    let newUsers = [...users]
                                    newUsers[index].avatar = e.target.value
                                    setUsers(newUsers)
                                }} 
                            />
                        </td>
                        
                        <td>
                            <button
                                className='admin-button'
                                onClick={() => {
                                    let newUsers = users.filter((i) => {
                                        return user.sessionId !== i.sessionId
                                    })
                                    sendMessage(JSON.stringify(newUsers), 'USER')
                                }}>
                                Delete
                            </button>
                        </td>
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
            users={users} />
        <FinishRound
            time={time}
            sendMessage={sendMessage}
            questions={finishQuestions}
            users={users} />
        <ExtraRound
            questions={extraQuestions}
            time={time}
            sendMessage={sendMessage}
            users={users} />
    </div>
}