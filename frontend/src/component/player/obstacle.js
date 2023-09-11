import '../../style/obstacle.css'
import Crossword from './crossword'
import AnswerBoard from './answerBoard'
import UserItem from './userItem'
import { useState } from 'react'

export default function ObstacleRound(props) {

    const [answer, setAnswer] = useState('')

    const handleKeyDown = (e) => {
        if (e.keyCode === 13) {
            props.sendMessage(JSON.stringify({
                answer: answer.toUpperCase(),
                sessionId: props.sessionId
            }), 'ANSWER')
        }
    }

    const answerObstacle = () => {
        props.sendMessage(JSON.stringify({
            sessionId: props.sessionId,
            answer: "obstacle"
        }), 'ANSWER')
    }

    if (props.isDisplayAnswer) {
        return <AnswerBoard users={props.users} />
    } else {
        return <div className="obstacle-page">
            <div className='horizontal-container'>
                <div className='image-container'>
                    <img
                        className='obstacle-image shadow'
                        src={'http://' + props.ip + ':8080/' + props.obstacle.image} />
                    <div className={props.obstacle.questions?.[0].correct ? 'quarter__true' : 'quarter quarter-1 shadow'} />
                    <div className={props.obstacle.questions?.[1].correct ? 'quarter__true' : 'quarter quarter-2 shadow'} />
                    <div className={props.obstacle.questions?.[2].correct ? 'quarter__true' : 'quarter quarter-3 shadow'} />
                    <div className={props.obstacle.questions?.[3].correct ? 'quarter__true' : 'quarter quarter-4 shadow'} />
                    <div className={props.obstacle.questions?.[4].correct ? 'quarter__true' : 'quarter quarter-5 shadow'} />
                </div>
                <div className='crossword-container shadow'>
                    <h2 className='crossword-title shadow'>
                        {props.obstacle.correct ? 'CHƯỚNG NGẠI VẬT: ' + props.obstacle.answer : 'CHƯỚNG NGẠI VẬT CÓ ' + props.obstacle.answer?.split('').filter((e) => e !== ' ').length + ' CHỮ CÁI'}
                    </h2>
                    {
                        props.obstacle.questions?.map((question, index) => {
                            if (index !== 4) {
                                return <Crossword
                                    key={index}
                                    index={index + 1}
                                    keyword={question.answer}
                                    answered={question.answered}
                                    isCorrect={question.correct}
                                    isSelecting={question.selecting} />
                            } else {
                                return null;
                            }

                        })
                    }
                </div>
            </div>
            <div className='horizontal-container'>
                <div className='obstacle-question-container shadow'>
                    <h2 className='question-text'>
                        {
                            props.obstacle.questions?.filter((question) => question.selecting)[0]?.question
                        }
                    </h2>
                    <h1 className="obstacle-time shadow">{props.time}</h1>
                    <div className='answer-container'>
                        {
                            props.isViewer ?
                                null
                                :
                                <input
                                    className='shadow'
                                    value={answer}
                                    onChange={(e) => setAnswer(e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(e)}
                                    placeholder='Nhập đáp án, Enter để gửi' />
                        }
                        {
                            props.isViewer ?
                                null
                                :
                                <button onClick={() => answerObstacle()} className='shadow'>
                                    Trả lời CNV
                                </button>
                        }
                    </div>
                </div>
                <div className='users-container obstacle-users-container'>
                    {props.users.map((user, index) => {
                        return <UserItem user={user} key={index} sessionId={props.sessionId} round={props.round} />
                    })}
                </div>
            </div>
        </div>
    }
}