import '../../style/player.css'

export default function AnswerItem(props) {

    return <div className={props.user.correct ? "answer-item" : "answer-item answer-item__false"}>
        <h2>{props.user.name}</h2>
        <div>
            <h1>{props.user.answer}</h1>
            <h1>{props.user.answerTime}</h1>
        </div>
    </div>
}