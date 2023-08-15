import '../index.css'

export default function ScoreItem(props) {
    return <div className={props.user.answering ? "score-item red": "score-item"}>
        <span>{props.user.name}</span>
        <span>{props.user.score}</span>
    </div>
}