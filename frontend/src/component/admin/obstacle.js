import '../../style/admin.css'
import { useEffect, useState } from 'react'

export default function ObstacleRound(props) {

    var users = props.users
    var obstacle = props.obstacle
    const [currentCrossword, setCurrentCrossword] = useState(0)

    useEffect(() => {
        users = props.users
        obstacle = props.obstacle
        return () => {

        }
    }, [props.users, props.obstacle])

    const start = () => {
        props.sendMessage('2', 'ROUND')
        updateObstacleToClient()
    }

    const countDown = () => {
        props.sendMessage('', 'QUESTION')
        props.sendMessage('', 'COUNT')
    }

    const selectQuestion = (index) => {
        setCurrentCrossword(index)
        users.map((user) => {
            user.answer = "";
            user.correct = true
            user.selected = false
            user.answerTime = 0
        })
        obstacle.questions.filter((question, i) => {
            if (i === index) {
                question.selecting = true
            } else {
                question.selecting = false
            }
        })
        updateUser()
        updateObstacleToClient()
    }

    const correctCrossword = () => {
        obstacle.questions[currentCrossword].selecting = false;
        obstacle.questions[currentCrossword].answered = true;
        let countCorrectUser = users.filter((user) => {
            console.log(user)
            if (user.selected) {
                user.correct = true
                user.score += 10
            } else {
                user.correct = false
            }
            return user.selected
        }).length
        if (countCorrectUser > 0) {
            obstacle.questions[currentCrossword].correct = true;
        } else {
            obstacle.questions[currentCrossword].correct = false;
        }
        console.log(users)
        updateObstacleToClient()
        updateUser()
    }


    const updateUser = () => {
        props.sendMessage(JSON.stringify(users), 'UPDATE')
    }

    const displayAnswer = () => {
        props.sendMessage(JSON.stringify(true), 'DISPLAY_ANSWER')
        updateUser()
    }

    const displayObstacle = () => {
        props.sendMessage(JSON.stringify(false), 'DISPLAY_ANSWER')
    }

    const reset = () => {
        users.map((user) => user.answering = false)
        updateUser()
    }

    const correctObstacle = () => {
        let countAnsweredQuestion = obstacle.questions.filter((question) => !question.answered).length
        console.log(countAnsweredQuestion)
        users.filter((user) => {
            if (user.selected) {
                user.answering = false
                user.score += (countAnsweredQuestion + 1) * 10
            }
        })
        obstacle.correct = true
        obstacle.questions.map((question) => {
            question.answered = true
            question.correct = true
        })
        updateUser()
        updateObstacleToClient()
    }

    const updateObstacleToClient = () => {
        props.sendMessage(JSON.stringify(props.obstacle), 'OBSTACLE')
    }

    const finish = () => {
        props.sendMessage('0', 'ROUND')
    }

    return <div>
        <h1>{props.time}</h1>
        <h3>Chướng ngại vật: {props.obstacle?.answer}</h3>
        <button className='admin-button' onClick={() => start()}>Start</button>
        <button className='admin-button' onClick={() => countDown()}>Count down</button>
        <button className='admin-button' onClick={() => reset()}>Reset quyền trả lời</button>
        <button className='admin-button' onClick={() => updateObstacleToClient()}>Cập nhật CNV</button>
        <button className="admin-button" onClick={() => finish()}>Finish</button>
        <br />

        <table>
            <thead>
                <tr>
                    <th>Hàng ngang</th>
                    <th>Câu hỏi</th>
                    <th>Câu trả lời</th>
                    <th>Đang được chọn</th>
                    <th>Đã trả lời</th>
                    <th>Đúng</th>
                </tr>
            </thead>
            <tbody>
                {props.obstacle?.questions?.map((question, index) => {
                    return <tr key={index}>
                        <td><button className='admin-button' onClick={() => selectQuestion(index)}>Hàng ngang {index + 1}</button></td>
                        <td>{question.question}</td>
                        <td>{question.answer}</td>
                        <td><input type='checkbox' defaultChecked={question.selecting} onChange={(e) => question.selecting = e.target.checked} /></td>
                        <td><input type='checkbox' defaultChecked={question.answered} onChange={(e) => question.answered = e.target.checked} /></td>
                        <td><input type='checkbox' defaultChecked={question.correct} onChange={(e) => question.correct = e.target.checked} /></td>

                    </tr>
                })}
            </tbody>

        </table>
        <table>
            <thead>
                <tr>
                    <th>Họ tên</th>
                    <th>Đáp án sửa</th>
                    <th>Đáp án hiện tại</th>
                    <th>Điểm sửa</th>
                    <th>Điểm hiện tại</th>
                    <th>Trả lời đúng</th>
                    <th>Selected</th>
                </tr>
            </thead>
            <tbody>
                {users?.map((user, index) => {
                    return <tr
                        key={index}
                        className={user.answering ? "admin-user-item user-item__answer" : "admin-user-item"}>
                        <td><h3>{user.name}</h3></td>
                        <td>
                            <input
                                onChange={(e) => user.answer = e.target.value}
                                defaultValue={user.answer} />
                        </td>
                        <td><h3>{user.answer}</h3></td>
                        <td>
                            <input
                                onChange={(e) => user.score = e.target.value}
                                defaultValue={user.score} />
                        </td>
                        <td><h3>{user.score}</h3></td>
                        <td>
                            <input
                                type='checkbox'
                                defaultChecked={user.selected}
                                onChange={(e) => {
                                    user.selected = e.target.checked
                                }} />
                        </td>
                        <td><h3>{user.selected.toString()}</h3></td>
                    </tr>
                })}
            </tbody>

        </table>
        <br />

        <button className='admin-button' onClick={() => correctCrossword()}>Đúng hàng ngang</button>
        <button className='admin-button' onClick={() => correctObstacle()}>Đúng CNV</button>
        <button className='admin-button' onClick={() => updateUser()}>Cập nhật điểm</button>
        <button className='admin-button' onClick={() => displayAnswer()}>Hiển thị câu trả lời</button>
        <button className='admin-button' onClick={() => displayObstacle()}>Hiển thị CNV</button>
    </div>
}