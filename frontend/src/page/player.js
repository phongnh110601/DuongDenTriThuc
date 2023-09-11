import React, { useState, useRef } from 'react'
import { over } from 'stompjs';
import SockJS from 'sockjs-client';
import Connect from '../component/common/connect';
import StartRound from '../component/player/start';
import ObstacleRound from '../component/player/obstacle';
import AccelerationRound from '../component/player/acceleration';
import WaitingScreen from '../component/player/waiting';
import FinishRound from '../component/player/finish';

var stompClient = null;
var socket;
export default function Player() {

    const [ip, setIp] = useState('localhost')
    const [name, setName] = useState('')
    const [sessionId, setSessionId] = useState('')
    const [users, setUsers] = useState([])
    const [startQuestion, setStartQuestion] = useState({})
    const [accelerationQuestion, setAccelerationQuestion] = useState({})
    const [finishQuestion, setFinishQuestion] = useState({})
    const [time, setTime] = useState(0)
    const [isConnected, setIsConnected] = useState(false)
    const [obstacle, setObstacle] = useState({})
    const [roundState, setRoundState] = useState(0)
    const [isDisplayAnswer, setIsDisplayAnswer] = useState(false)
    const [isViewer, setIsViewer] = useState(false)
    const [playingVideo, setPlayingVideo] = useState(false)
    const [finishPackage, setFinishPackage] = useState([0, 0, 0, 0])
    const [isDisplayFinishPackage, setIsDisplayFinishPackage] = useState(false)
    const [isChoosingStar, setIsChoosingStar] = useState(false)
    var round = 0

    const connect = () => {
        socket = new SockJS('http://' + ip + ':8080/ws');
        stompClient = over(socket);
        setName(name.trim())
        stompClient.connect({
            name: name
        }, onConnected, onError);
    }

    const onConnected = () => {
        if (name.toLowerCase() === 'viewer') {
            setIsViewer(true)
        }
        setSessionId(socket._transport.url.split('/')[5])
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
        if (payloadData.type === 'ROUND') {
            round = Number.parseInt(payloadData.message, 10)
            setRoundState(round)
            console.log(round)
        }
        if (payloadData.type === 'TIME') {
            setTime(payloadData.message)
        }
        if (payloadData.type === 'DISPLAY_ANSWER') {
            setIsDisplayAnswer(JSON.parse(payloadData.message))
        }
        if (payloadData.type === 'ANSWER') {
            setUsers(JSON.parse(payloadData.message))
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
        
        if (payloadData.type === 'QUESTION') {
            setStartQuestion(JSON.parse(payloadData.message))
        }

    }

    const obstacleRound = (payloadData) => {
        if (payloadData.type === 'OBSTACLE') {
            setObstacle(JSON.parse(payloadData.message))
        }
        if (payloadData.type === 'DISPLAY_ANSWER') {
            setIsDisplayAnswer(JSON.parse(payloadData.message))
        }
    }

    const accelerationRound = (payloadData) => {
        if (payloadData.type === 'QUESTION') {
            setAccelerationQuestion(JSON.parse(payloadData.message))
            setPlayingVideo(false)
        }
        if (payloadData.type === 'DISPLAY_ANSWER') {
            setIsDisplayAnswer(JSON.parse(payloadData.message))
        }
        if (payloadData.type === 'COUNT') {
            if (accelerationQuestion.type === 'VIDEO') {
                setPlayingVideo(true)
            }
        }
    }

    const finishRound = (payloadData) => {
        if (payloadData.type === 'PACKAGE') {
            setIsDisplayFinishPackage(true)
            setFinishPackage(JSON.parse(payloadData.message))
        }
        if (payloadData.type === 'CONFIRM') {
            setIsDisplayFinishPackage(false)
        }
        if (payloadData.type === 'QUESTION') {
            setFinishQuestion(JSON.parse(payloadData.message))
        }
        if (payloadData.type === 'STAR') {
            setIsChoosingStar(JSON.parse(payloadData.message))
        }
    }

    const getElementByRound = (round) => {
        if (round === 0) {
            return <WaitingScreen
                users={users}
                ip={ip} />
        } if (round === 1) {
            return <StartRound
                time={time}
                sessionId={sessionId}
                sendMessage={sendMessage}
                round={roundState}
                users={users}
                isViewer={isViewer}
                question={startQuestion} />
        } else if (round === 2) {
            return <ObstacleRound
                time={time}
                ip={ip}
                round={roundState}
                isViewer={isViewer}
                isDisplayAnswer={isDisplayAnswer}
                sessionId={sessionId}
                obstacle={obstacle}
                sendMessage={sendMessage}
                users={users} />
        } else if (round === 3) {
            return <AccelerationRound
                time={time}
                round={roundState}
                sendMessage={sendMessage}
                users={users}
                isViewer={isViewer}
                playingVideo={playingVideo}
                sessionId={sessionId}
                ip={ip}
                question={accelerationQuestion}
                isDisplayAnswer={isDisplayAnswer} />
        } else if (round === 4) {
            return <FinishRound
                time={time}
                round={roundState}
                sendMessage={sendMessage}
                users={users}
                isViewer={isViewer}
                playingVideo={playingVideo}
                sessionId={sessionId}
                ip={ip}
                question={finishQuestion} 
                finishPackage={finishPackage}
                displayFinishPackage={isDisplayFinishPackage}
                choosingStar={isChoosingStar}/>
        }
    }

    return <div className='player-page'>
        {isConnected ?
            getElementByRound(roundState)
            :
            <Connect
                ip={ip}
                setIp={setIp}
                name={name}
                setName={setName}
                connect={connect} />
        }
    </div>
}

