import { useEffect, useRef } from "react"
import image from '../../resource/image/logo.png'
import '../../style/finish.css'
import FinishPackage from "./finishPackage"
import star from '../../resource/image/Star.gif'


export default function FinishRound(props) {

    const videoRef = useRef(null)

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
                <img src={star} className="star-image"/>
                : null
            }
        </div>
        <img src={image} className="logo shadow" />


    </div>
}