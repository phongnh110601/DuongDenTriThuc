import '../../style/acceleration.css'
import { useState, useRef, useEffect } from 'react'
import UserItem from './userItem'
import logo from '../../resource/image/logo.png'
import AnswerBoard from './answerBoard'

export default function AccelerationRound(props) {

    const videoRef = useRef(null);
    const [answer, setAnswer] = useState('')

    useEffect(() => {
        
        if (props.playingVideo && props.question.type === 'VIDEO') {
            videoRef.current.volume = 0
            videoRef.current.play()
        }

        return () => {

        }
    }, [props.playingVideo])


    const handleKeyDown = (e) => {
        if (e.keyCode === 13) {
            props.sendMessage(JSON.stringify({
                answer: answer.toUpperCase(),
                sessionId: props.sessionId
            }), 'ANSWER')
            setAnswer('')
        }
    }

    
    if (props.isDisplayAnswer) {
        return <AnswerBoard users={props.users} />
    } else {
        return <div className="acceleration-page">
            <img src={logo} className="logo" />
            <div className='acceleration__left'>
                <h3 className='question shadow'>{props.question?.question}</h3>
                <div className='media-container shadow'>
                    <img src={'http://' + props.ip + ':8080/' + props.question?.image} className={props.question?.type === 'IMAGE' ? '' : 'hide'} />
                    <video
                        preload='auto'
                        ref={videoRef}
                        src={'http://' + props.ip + ':8080/' + props.question?.video}
                        type="video/mp4"
                        className={props.question?.type === 'VIDEO' ? '' : 'hide'} />

                </div>
                {
                    props.isViewer
                        ?
                        null
                        :
                        <input
                            className='shadow'
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                            onKeyDown={(e) => handleKeyDown(e)}
                            placeholder='Nhập đáp án, Enter để gửi' />
                }
            </div>
            <div className='acceleration__right'>
                <h1 className="acceleration-time shadow">{props.time}</h1>
                <div className='acceleration-users-container'>
                    {props.users?.map((user, index) => {
                        return <UserItem user={user} key={index} sessionId={props.sessionId} round={props.round} />
                    })}
                </div>

            </div>
        </div>
    }
}