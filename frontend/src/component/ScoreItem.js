import '../index.css'

export default function ScoreItem(props) {

    return <div className={props.user.answering ? "score-item red": "score-item"}>
        <span>{props.user.name}</span>
        <div>
            <span>{props.user.score}</span>
            {props.isAdmin ? <button onClick={() => props.deleteUser(props.user.name)}>Delete</button> : null}
        </div>
    </div>
}