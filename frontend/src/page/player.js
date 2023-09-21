import React, { useState, useEffect, useRef } from 'react'
import { over } from 'stompjs';
import SockJS from 'sockjs-client';
import Connect from '../component/common/connect';
import StartRound from '../component/player/start';
import ObstacleRound from '../component/player/obstacle';
import AccelerationRound from '../component/player/acceleration';
import WaitingScreen from '../component/player/waiting';
import FinishRound from '../component/player/finish';
import ExtraRound from '../component/player/extra';
import '../style/player.css'

var stompClient = null;
var socket;
export default function Player() {

    var summaryAudioRef = useRef(null)
    var startAudioRef = useRef(null)
    var startCorrectAudioRef = useRef(null)
    var startIncorrectAudioRef = useRef(null)
    var startAnswerAudioRef = useRef(null)
    var obstacleAudioRef = useRef(null)
    var obstacleChooseRowAudioRef = useRef(null)
    var obstacleTimeAudioRef = useRef(null)
    var obstacleDisplayAnswerAudioRef = useRef(null)
    var obstacleDisplayImageAudioRef = useRef(null)
    var obstacleCorrectRowAudioRef = useRef(null)
    var obstacleIncorrectRowAudioRef = useRef(null)
    var obstacleAnswerAudioRef = useRef(null)
    var obstacleCorrectAudioRef = useRef(null)
    var accelerationAudioRef = useRef(null)
    var accelerationOpenAnswerAudioRef = useRef(null)
    var accelerationOpenQuestionAudioRef = useRef(null)
    var acceleration10AudioRef = useRef(null)
    var acceleration20AudioRef = useRef(null)
    var acceleration30AudioRef = useRef(null)
    var acceleration40AudioRef = useRef(null)
    var finishAudioRef = useRef(null)
    var finish5AudioRef = useRef(null)
    var finishStartAudioRef = useRef(null)
    var finishFinishAudioRef = useRef(null)
    var finish15AudioRef = useRef(null)
    var finish20AudioRef = useRef(null)
    var finishAnswerAudioRef = useRef(null)
    var finishPackageAudioRef = useRef(null)
    var finishConfirmAudioRef = useRef(null)
    var finishCorrectAudioRef = useRef(null)
    var finishIncorrectAudioRef = useRef(null)
    var finishStarAudioRef = useRef(null)

    const [ip, setIp] = useState('192.168.16.107')
    const [name, setName] = useState('')
    const [sessionId, setSessionId] = useState('')
    const [users, setUsers] = useState([])
    const [startQuestion, setStartQuestion] = useState({})
    const [accelerationQuestion, setAccelerationQuestion] = useState({})
    const [finishQuestion, setFinishQuestion] = useState({})
    const [extraQuestion, setExtraQuestion] = useState({})
    const [time, setTime] = useState(0)
    const [isConnected, setIsConnected] = useState(false)
    const [obstacle, setObstacle] = useState({})
    const [roundState, setRoundState] = useState(0)
    const [isDisplayAnswer, setIsDisplayAnswer] = useState(false)
    const [isViewer, setIsViewer] = useState(false)
    const [isPlayingMedia, setIsPlayingMedia] = useState(false)
    const [finishPackage, setFinishPackage] = useState([0, 0, 0, 0])
    const [isDisplayFinishPackage, setIsDisplayFinishPackage] = useState(false)
    const [isChoosingStar, setIsChoosingStar] = useState(false)
    const [isFullScreen, setIsFullScreen] = useState(false)
    var round = 0

    const handleWindowResize = () => {
        let clientWidth = document.documentElement.clientWidth
        let clientHeight = document.documentElement.clientHeight
        let screenWidth = window.screen.width
        let screenHeight = window.screen.height
        if (clientWidth === screenWidth && clientHeight === screenHeight) {
            setIsFullScreen(true)
        } else {
            setIsFullScreen(false)
        }
    }

    useEffect(() => {
        // handleWindowResize()
        window.addEventListener('resize', handleWindowResize);
        return () => {
            window.removeEventListener('resize', handleWindowResize);
        }
    }, [isFullScreen])

    const connect = () => {
        socket = new SockJS('http://' + ip + ':8080/ws');
        stompClient = over(socket);
        stompClient.debug = null;
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

    const sendMessage = (message, type) => {
        if (stompClient) {
            var chatMessage = {
                message: message,
                type: type
            };
            stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
        }
    }

    const onMessageReceived = (payload) => {
        var payloadData = JSON.parse(payload.body);
        if (payloadData.type === 'ROUND') {
            round = Number.parseInt(payloadData.message, 10)
            setRoundState(round)
        }
        if (round === 1) {
            startRound(payloadData)
        } else if (round === 2) {
            obstacleRound(payloadData)
        } else if (round === 3) {
            accelerationRound(payloadData)
        } else if (round === 4) {
            finishRound(payloadData)
        } else if (round === 5) {
            extraRound(payloadData)
        }
        if (payloadData.type === 'JOIN') {
            setUsers(JSON.parse(payloadData.message))
        }
        if (payloadData.type === 'USER') {
            setUsers(JSON.parse(payloadData.message))
        }
        if (payloadData.type === 'START') {
            round = Number.parseInt(payloadData.message, 10)
            if (round === 1) {
                startAudioRef.current.play();
            } else if (round === 2) {
                obstacleAudioRef.current.play()
            } else if (round === 3) {
                accelerationAudioRef.current.play()
            } else if (round === 4) {
                finishAudioRef.current.play()
            }
            setRoundState(round)
        }
        if (payloadData.type === 'TIME') {
            setTime(payloadData.message)
        }
        if (payloadData.type === 'FINISH') {
            summaryAudioRef.current.play()
            round = 0
            setRoundState(round)
        }

    }

    const startRound = (payloadData) => {
        if (payloadData.type === 'QUESTION') {
            setStartQuestion(JSON.parse(payloadData.message))
        }
        if (payloadData.type === 'ANSWER') {
            startAnswerAudioRef.current.play()
            startAnswerAudioRef.current.onplay = () => {
                setUsers(JSON.parse(payloadData.message))
            }
        }
        if (payloadData.type === 'TRUE') {
            startCorrectAudioRef.current.play()
            startCorrectAudioRef.current.onplay = () => {
                setUsers(JSON.parse(payloadData.message))
            }
        }
        if (payloadData.type === 'FALSE') {
            startIncorrectAudioRef.current.play()
            startIncorrectAudioRef.current.onplay = () => {
                setUsers(JSON.parse(payloadData.message))
            }
        }
        if (payloadData.type === 'COUNT') {

        }
    }

    const obstacleRound = (payloadData) => {
        if (payloadData.type === 'ANSWER') {
            setUsers(JSON.parse(payloadData.message))
        }
        if (payloadData.type === 'OBSTACLE') {
            setObstacle(JSON.parse(payloadData.message))
        }
        if (payloadData.type === 'DISPLAY_ANSWER') {
            if (payloadData.message === 'true') {
                obstacleDisplayAnswerAudioRef.current.play()
            }
            setIsDisplayAnswer(JSON.parse(payloadData.message))
        }
        if (payloadData.type === 'QUESTION') {
            obstacleChooseRowAudioRef.current.play()
            obstacleChooseRowAudioRef.current.onplay = () => {
                setObstacle(JSON.parse(payloadData.message))
            }
        }
        if (payloadData.type === 'COUNT') {
            obstacleTimeAudioRef.current.play()
        }
        if (payloadData.type === 'ANSWER_OBSTACLE') {
            obstacleAnswerAudioRef.current.pause()
            obstacleAnswerAudioRef.current.currentTime = 0
            obstacleAnswerAudioRef.current.play()
            obstacleAnswerAudioRef.current.onplay = () => {
                setUsers(JSON.parse(payloadData.message))
            }
        }
        if (payloadData.type === 'TRUE') {
            obstacleCorrectRowAudioRef.current.play()
            obstacleCorrectRowAudioRef.current.onplay = () => {
                setUsers(JSON.parse(payloadData.message))
            }
        }
        if (payloadData.type === 'FALSE') {
            obstacleIncorrectRowAudioRef.current.play()
            obstacleIncorrectRowAudioRef.current.onplay = () => {
                setUsers(JSON.parse(payloadData.message))
            }
        }
        if (payloadData.type === 'DISPLAY_IMAGE') {
            obstacleDisplayImageAudioRef.current.play()
            obstacleDisplayImageAudioRef.current.onplay = () => {
                setIsDisplayAnswer(false)
            }
        }
        if (payloadData.type === 'TRUE_OBSTACLE') {
            obstacleCorrectAudioRef.current.play()
        }
    }

    const accelerationRound = (payloadData) => {
        if (payloadData.type === 'QUESTION') {
            accelerationOpenQuestionAudioRef.current.play()
            accelerationOpenQuestionAudioRef.current.onplay = () => {
                setAccelerationQuestion(JSON.parse(payloadData.message))
                setIsPlayingMedia(false)
            }
        }
        if (payloadData.type === 'ANSWER') {
            setUsers(JSON.parse(payloadData.message))
        }
        if (payloadData.type === 'DISPLAY_ANSWER') {
            if (payloadData.message === 'true') {
                accelerationOpenAnswerAudioRef.current.play()
            }
            setIsDisplayAnswer(JSON.parse(payloadData.message))
        }
        if (payloadData.type === 'COUNT') {
            var second = Number.parseInt(payloadData.message, 10)
            if (second === 10) {
                acceleration10AudioRef.current.play()
            } else if (second === 20) {
                acceleration20AudioRef.current.play()
            } else if (second === 30) {
                acceleration30AudioRef.current.play()
            } else {
                acceleration40AudioRef.current.play()
            }
            setIsPlayingMedia(true)
        }
        if (payloadData.type === 'TRUE') {
            obstacleCorrectRowAudioRef.current.play()
            obstacleCorrectRowAudioRef.current.onplay = () => {
                setUsers(JSON.parse(payloadData.message))
            }
        }
        if (payloadData.type === 'FALSE') {
            startIncorrectAudioRef.current.play()
            startIncorrectAudioRef.current.onplay = () => {
                setUsers(JSON.parse(payloadData.message))
            }
        }
    }

    const finishRound = (payloadData) => {
        if (payloadData.type === 'SELECT_USER') {
            finishStartAudioRef.current.play()
            finishStartAudioRef.current.onplay = () => {
                setUsers(JSON.parse(payloadData.message))
            }
            finishStartAudioRef.current.onended = () => {
                finishPackageAudioRef.current.play()
                setIsDisplayFinishPackage(true)
            }

        }
        if (payloadData.type === 'DESELECT_USER') {
            finishFinishAudioRef.current.play()
        }
        if (payloadData.type === 'PACKAGE') {
            setFinishPackage(JSON.parse(payloadData.message))
        }
        if (payloadData.type === 'CONFIRM') {
            finishConfirmAudioRef.current.play()
            finishConfirmAudioRef.current.onplay = () => {
                setIsDisplayFinishPackage(false)
            }

        }
        if (payloadData.type === 'QUESTION') {
            setFinishQuestion(JSON.parse(payloadData.message))
            setIsPlayingMedia(false)
        }
        if (payloadData.type === 'STAR') {
            if (payloadData.message === 'true') {
                finishStarAudioRef.current.play()
            }
            setIsChoosingStar(JSON.parse(payloadData.message))
        }
        if (payloadData.type === 'MEDIA') {
            setIsPlayingMedia(true)
        }
        if (payloadData.type === 'COUNT') {
            var second = Number.parseInt(payloadData.message, 10)
            if (second === 15) {
                finish15AudioRef.current.play()
            } else if (second === 20) {
                finish20AudioRef.current.play()
            } else if (second === 5) {
                finish5AudioRef.current.play()
            }
        }
        if (payloadData.type === 'TRUE') {
            finishCorrectAudioRef.current.play()
            finishCorrectAudioRef.current.onplay = () => {
                setUsers(JSON.parse(payloadData.message))
            }
        }
        if (payloadData.type === 'FALSE') {
            finishIncorrectAudioRef.current.play()
            finishIncorrectAudioRef.current.onplay = () => {
                setUsers(JSON.parse(payloadData.message))
            }
        }
        if (payloadData.type === 'ANSWER') {
            finishAnswerAudioRef.current.play()
            finishAnswerAudioRef.current.onplay = () => {
                setUsers(JSON.parse(payloadData.message))
            }
        }
    }

    const extraRound = (payloadData) => {
        if (payloadData.type === 'QUESTION') {
            accelerationOpenQuestionAudioRef.current.play()
            accelerationOpenQuestionAudioRef.current.onplay = () => {
                setExtraQuestion(JSON.parse(payloadData.message))
            }
        }
        if (payloadData.type === 'ANSWER') {
            finishAnswerAudioRef.current.play()
            finishAnswerAudioRef.current.onplay = () => {
                setUsers(JSON.parse(payloadData.message))
            }
        }
        if (payloadData.type === 'TRUE') {
            startCorrectAudioRef.current.play()
        }
        if (payloadData.type === 'FALSE') {
            startIncorrectAudioRef.current.play()
        }
        if (payloadData.type === 'COUNT') {
            finish15AudioRef.current.play()
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
                playingVideo={isPlayingMedia}
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
                playingVideo={isPlayingMedia}
                sessionId={sessionId}
                ip={ip}
                question={finishQuestion}
                finishPackage={finishPackage}
                displayFinishPackage={isDisplayFinishPackage}
                choosingStar={isChoosingStar} />
        } else if (round === 5) {
            return <ExtraRound
                time={time}
                sessionId={sessionId}
                sendMessage={sendMessage}
                round={roundState}
                users={users}
                isViewer={isViewer}
                question={extraQuestion}
            />
        }
    }

    return <div className='player-page'>
        <audio preload="auto" ref={startAudioRef} src={'http://' + ip + ':8080/game/audio/start.mp3'} />
        <audio preload="auto" ref={startAnswerAudioRef} src={'http://' + ip + ':8080/game/audio/start_answer.mp3'} />
        <audio preload="auto" ref={startCorrectAudioRef} src={'http://' + ip + ':8080/game/audio/start_correct.mp3'} />
        <audio preload="auto" ref={startIncorrectAudioRef} src={'http://' + ip + ':8080/game/audio/start_incorrect.mp3'} />
        <audio preload="auto" ref={obstacleAudioRef} src={'http://' + ip + ':8080/game/audio/obstacle.mp3'} />
        <audio preload="auto" ref={obstacleAnswerAudioRef} src={'http://' + ip + ':8080/game/audio/obstacle_answer.mp3'} />
        <audio preload="auto" ref={obstacleChooseRowAudioRef} src={'http://' + ip + ':8080/game/audio/obstacle_choose_row.mp3'} />
        <audio preload="auto" ref={obstacleCorrectRowAudioRef} src={'http://' + ip + ':8080/game/audio/obstacle_correct_row.mp3'} />
        <audio preload="auto" ref={obstacleCorrectAudioRef} src={'http://' + ip + ':8080/game/audio/obstacle_correct.mp3'} />
        <audio preload="auto" ref={obstacleDisplayAnswerAudioRef} src={'http://' + ip + ':8080/game/audio/obstacle_display_answer.mp3'} />
        <audio preload="auto" ref={obstacleDisplayImageAudioRef} src={'http://' + ip + ':8080/game/audio/obstacle_display_image.mp3'} />
        <audio preload="auto" ref={obstacleIncorrectRowAudioRef} src={'http://' + ip + ':8080/game/audio/obstacle_incorrect_row.mp3'} />
        <audio preload="auto" ref={obstacleTimeAudioRef} src={'http://' + ip + ':8080/game/audio/obstacle_time.mp3'} />
        <audio preload="auto" ref={accelerationAudioRef} src={'http://' + ip + ':8080/game/audio/acceleration.mp3'} />
        <audio preload="auto" ref={acceleration10AudioRef} src={'http://' + ip + ':8080/game/audio/acceleration_10s.mp3'} />
        <audio preload="auto" ref={acceleration20AudioRef} src={'http://' + ip + ':8080/game/audio/acceleration_20s.mp3'} />
        <audio preload="auto" ref={acceleration30AudioRef} src={'http://' + ip + ':8080/game/audio/acceleration_30s.mp3'} />
        <audio preload="auto" ref={acceleration40AudioRef} src={'http://' + ip + ':8080/game/audio/acceleration_40s.mp3'} />
        <audio preload="auto" ref={accelerationOpenAnswerAudioRef} src={'http://' + ip + ':8080/game/audio/acceleration_open_answer.mp3'} />
        <audio preload="auto" ref={accelerationOpenQuestionAudioRef} src={'http://' + ip + ':8080/game/audio/acceleration_open_question.mp3'} />
        <audio preload="auto" ref={finishAudioRef} src={'http://' + ip + ':8080/game/audio/finish.mp3'} />
        <audio preload="auto" ref={finish5AudioRef} src={'http://' + ip + ':8080/game/audio/finish_5s.mp3'} />
        <audio preload="auto" ref={finish15AudioRef} src={'http://' + ip + ':8080/game/audio/finish_15s.mp3'} />
        <audio preload="auto" ref={finish20AudioRef} src={'http://' + ip + ':8080/game/audio/finish_20s.mp3'} />
        <audio preload="auto" ref={finishAnswerAudioRef} src={'http://' + ip + ':8080/game/audio/finish_answer.mp3'} />
        <audio preload="auto" ref={finishConfirmAudioRef} src={'http://' + ip + ':8080/game/audio/finish_confirm.mp3'} />
        <audio preload="auto" ref={finishCorrectAudioRef} src={'http://' + ip + ':8080/game/audio/finish_correct.mp3'} />
        <audio preload="auto" ref={finishIncorrectAudioRef} src={'http://' + ip + ':8080/game/audio/finish_incorrect.mp3'} />
        <audio preload="auto" ref={finishPackageAudioRef} src={'http://' + ip + ':8080/game/audio/finish_package.mp3'} />
        <audio preload="auto" ref={finishStarAudioRef} src={'http://' + ip + ':8080/game/audio/finish_star.mp3'} />
        <audio preload="auto" ref={finishStartAudioRef} src={'http://' + ip + ':8080/game/audio/finish_start.mp3'} />
        <audio preload="auto" ref={summaryAudioRef} src={'http://' + ip + ':8080/game/audio/summary.mp3'} />
        {
            isConnected ?
                // isViewer || isFullScreen ?
                getElementByRound(roundState)
                //     :
                //     <div className='fullscreen-button-container'>
                //         <button className='admin-button' onClick={() => { document.documentElement.requestFullscreen() }}>Bật chế độ toàn màn hình</button>
                //     </div>

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

