import '../../style/start.css'

export default function StartUserItem(props) {

    return <div className={props.user.answering ? "user-item user-item__answer" : "user-item"}>
        <h3>{props.user.name}</h3>
        <h3>{props.user.score}</h3>
    </div>
}