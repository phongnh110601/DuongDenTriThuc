import '../../style/start.css'

export default function UserItem(props) {

    return <div className={props.user.answering ? "user-item user-item__answer shadow" : "user-item shadow"}>
        <h3>{props.user.name}</h3>
        <h3>{props.user.sessionId === props.sessionId ? props.user.answer : null}</h3>
        <h3>{(props.user.sessionId === props.sessionId && props.round === 3) ? (props.user.answerTime.toFixed(2)) : null}</h3>
        <h3>{(props.user.answering && props.round === 2) ? props.user.answerIndex : null}</h3>
        <h3>{props.user.score}</h3>
    </div>
}