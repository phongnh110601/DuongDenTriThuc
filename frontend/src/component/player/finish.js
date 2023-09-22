import { useEffect, useRef, useState } from "react"
import logo from '../../resource/image/logo.png'
import '../../style/finish.css'
import FinishPackage from "./finishPackage"
import star from '../../resource/image/star.gif'

export default function FinishRound(props) {

    const videoRef = useRef(null)

    document.addEventListener("keydown", (e) => {
        if (e.key === ' ') {
            answer()
        }
    })

    useEffect(() => {
        if (props.playingVideo && props.question.type === 'VIDEO') {
            videoRef.current.play()
        }

        return () => {

        }
    }, [props.playingVideo])

    const answer = () => {
        props.sendMessage(props.sessionId, 'ANSWER');
    }

    const getUserClassName = (user) => {
        if (user.selected) {
            return "finish-user-item finish-user-item__select";
        } else {
            if (user.answering) {
                return "finish-user-item finish-user-item__answer";
            } else {
                return "finish-user-item"
            }
        }
    }

    return <div className="finish-page">
        <div className="finish-main shadow">
            <div className="finish-users-container">
                {props.users.map((user, index) => {
                    return <h3 key={index} className={getUserClassName(user)}>
                        {user.name} ({user.score})
                    </h3>
                })}
            </div>
            {
                props.displayFinishPackage ?
                    <FinishPackage finishPackage={props.finishPackage} />
                    :
                    <div className="finish-question-container">
                        <h2>{props.question?.question}</h2>
                        <video
                            preload='auto'
                            ref={videoRef}
                            src={'http://' + props.ip + ':8080/' + props.question?.video}
                            type="video/mp4"
                            className={props.question?.type === 'VIDEO' ? '' : 'hide'} />
                    </div>
            }
            {
                props.isViewer
                    ?
                    null
                    :
                    <button
                        className="finish-answer-button shadow"
                        onClick={() => answer()}>
                        Trả lời
                    </button>
            }
            <h1 className="finish-time shadow">{props.time}</h1>
            {
                props.choosingStar ?
                    <img src={star} className="star-image" />
                    : null
            }
        </div>
        <img src={logo} className="logo shadow" />


    </div>
}