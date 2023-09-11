import UserItem from "./userItem"
import "../../style/start.css"
import { useState } from "react"
import image from '../../resource/image/logo.png'

export default function StartRound(props) {

    const answer = () => {
        props.sendMessage(props.sessionId, 'ANSWER');
    }

    const getTotalNumber = (packageIndex) => {
        if (packageIndex === 1) {
            return 8;
        } else if (packageIndex === 2) {
            return 12;
        } else if (packageIndex === 3){
            return 16;
        } else {
            return null
        }
    }

    return <div className="start-page">

        <img src={image} className="logo shadow" />

        <div className="index-container">
            <h2 className="index shadow">
                Lượt {props.question?.packageIndex}: {props.question?.index}/{getTotalNumber(props.question?.packageIndex)}
            </h2>
            {
                props.isViewer
                    ?
                    null
                    : 
                    <button
                        className="answer-button shadow"
                        onClick={() => answer()}>
                        Trả lời
                    </button>
            }
        </div>

        <div className="bottom">
            <div className="question-container shadow">
                <h2>{props.question?.question}</h2>
                <h1 className="time">{props.time}</h1>
            </div>
            <div className="users-container">
                {props.users.map((user, index) => {
                    return <UserItem user={user} key={index} />
                })}
            </div>
        </div>


    </div>
}