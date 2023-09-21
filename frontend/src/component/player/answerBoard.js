import '../../style/player.css'
import AnswerItem from './answerItem'

export default function answerBoard(props) {
    return <div className="answer-board">
        {props.users.map((user, index) => {
            return <AnswerItem user={user} key={index}/>
        })}
    </div>
}