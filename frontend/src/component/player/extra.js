import UserItem from "./userItem"
import "../../style/start.css"
import logo from '../../resource/image/logo.png'

export default function ExtraRound(props) {

    const answer = () => {
        props.sendMessage(props.sessionId, 'ANSWER');
    }

    return <div className="start-page">

        <img src={logo} className="logo shadow" />
        <div className="question-image-container">
            <img src={props.question?.image} className="question-image" />
        </div>

        <div className="index-container">
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