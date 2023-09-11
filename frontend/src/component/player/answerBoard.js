import '../../style/player.css'
import AnswerItem from './answerItem'

export default function answerBoard(props) {
    return <div className="answer-board">
        {props.users.map((user) => {
            return <AnswerItem user={user} />
        })}
    </div>
}