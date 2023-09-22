import '../../style/player.css'
import AnswerItem from './answerItem'

export default function AnswerBoard(props) {
    return <div className="answer-board">
        {props.users.map((user, index) => {
            return <div className={'answer-item-container answer-item-' + index} key={index}>
                <AnswerItem user={user}/>
            </div>
        })}
    </div>
}