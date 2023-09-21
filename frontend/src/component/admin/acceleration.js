import { useState, useEffect } from "react"

export default function AccelerationRound(props) {
    var users = props.users

    const [index, setIndex] = useState(-1)

    useEffect(() => {
        users = props.users

        return () => {

        }
    }, [props.users])

    const updateUser = () => {
        props.sendMessage(JSON.stringify(users), 'USER')
    }

    const start = () => {
        props.sendMessage('3', 'START')
    }

    const previousQuestion = () => {
        props.sendMessage(JSON.stringify(props.questions[index - 1]), 'QUESTION')
        setIndex(index - 1)
        users.map((user) => {
            user.answer = ""
            user.answerTime = 0
            user.correct = true
            user.selected = false
        })
        updateUser()
    }

    const nextQuestion = () => {
        props.sendMessage(JSON.stringify(props.questions[index + 1]), 'QUESTION')
        setIndex(index + 1)
        users.map((user) => {
            user.answer = ""
            user.answerTime = 0
            user.correct = true
            user.selected = false
        })
        updateUser()
    }

    const countDown = () => {
        props.sendMessage(((index + 1) * 10).toString(), 'COUNT')
    }

    const displayAnswer = () => {
        let sortedUsers = [...users]
        sortedUsers.sort((a, b) => {
            return a.answerTime - b.answerTime
        })
        props.sendMessage(JSON.stringify(sortedUsers), 'USER')
        props.sendMessage(JSON.stringify(true), 'DISPLAY_ANSWER')
    }

    const displayAcceleration = () => {
        updateUser()
        props.sendMessage(JSON.stringify(false), 'DISPLAY_ANSWER')
    }

    const correctAcceleration = () => {
        let score = 40
        let countCorrectUsers = users.filter((user) => {
            if (user.selected) {
                user.correct = true
                user.score += score
                score -= 10
            } else {
                user.correct = false
            }
            return user.selected
        }).length
        if (countCorrectUsers > 0) {
            props.sendMessage(JSON.stringify(users), 'TRUE')
        } else {
            props.sendMessage(JSON.stringify(users), 'FALSE')
        }
    }

    const finish = () => {
        users.map((user) => {
            user.selected = false
            user.answer = ""
            user.answerTime = 0
            user.answering = false
            user.correct = true
        })
        updateUser()
        props.sendMessage('', 'FINISH')
    }

    return <div>
        <h1>{props.time}</h1>
        <h2>{props.questions?.[index]?.question}</h2>
        <h2>{props.questions?.[index]?.answer}</h2>
        <br />
        <button className="admin-button" onClick={() => previousQuestion()}>Previous</button>
        <input
            value={index}
            onChange={(e) => setIndex(Number.parseInt(e.target.value))}
            type="number"
            style={{ height: "60px", margin: "10px 10px", width: "80px" }} />
        <button className="admin-button" onClick={() => nextQuestion()}>Next</button>
        <br />
        <button className="admin-button" onClick={() => start()}>Start</button>
        <button className='admin-button' onClick={() => countDown()}>Count down</button>
        <button className='admin-button' onClick={() => displayAnswer()}>Hiển thị câu trả lời</button>
        <button className='admin-button' onClick={() => displayAcceleration()}>Hiển thị câu hỏi</button>
        <button className="admin-button" onClick={() => finish()}>Finish</button>
        <table>
            <thead>
                <tr>
                    <th>Họ tên</th>
                    <th>Đáp án sửa</th>
                    <th>Đáp án hiện tại</th>
                    <th>Thời gian sửa</th>
                    <th>Thời gian trả lời</th>
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
                                onChange={(e) => user.answerTime = e.target.value}
                                defaultValue={user.answerTime} />
                        </td>
                        <td><h3>{user.answerTime}</h3></td>
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
        <button className="admin-button" onClick={() => correctAcceleration()}>Đúng tăng tốc</button>
        <button className='admin-button' onClick={() => updateUser()}>Cập nhật điểm</button>
    </div>
}