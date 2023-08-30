import StartUserItem from "./startUserItem"
import "../../style/start.css"
import { useState } from "react"

export default function StartRound(props) {

    const answer = () => {
        props.sendMessage(props.name, 'ANSWER');
    }

    const getTotalNumber = (packageIndex) => {
        if (packageIndex === 1) {
            return 8;
        } else if (packageIndex === 2) {
            return 12;
        } else {
            return 16;
        }
    }

    return <div className="start-page">

        <div className="index-container">
            <h2 className="index">
                Lượt {props.question.packageIndex}: {props.question.index}/{getTotalNumber(props.question.packageIndex)}
            </h2>
            <button
                className="answer-button"
                onClick={() => answer()}>
                Trả lời
            </button>
        </div>



        <div className="bottom">
            <div className="question-container">
                <h1>{props.question.question}</h1>
                <h1 className="time">{props.time}</h1>
            </div>
            <div className="users-container">
                {props.users.map((user, index) => {
                    return <StartUserItem user={user} key={index} />
                })}
            </div>
        </div>


    </div>
}