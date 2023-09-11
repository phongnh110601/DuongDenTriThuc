import { useEffect, useState } from "react"

export default function FinishRound(props) {

    var users = props.users
    const [mediumQuestions, setMediumQuestions] = useState([])
    const [hardQuestions, setHardQuestions] = useState([])
    const [finishPackage, setFinishPackage] = useState([0, 0, 0, 0])
    const [time, setTime] = useState('')
    const [score, setScore] = useState(0)
    const [isChoosingStar, setIsChoosingStar] = useState(false)

    useEffect(() => {
        users = props.users
        let newMediumQuestions = props.questions.mediumQuestions
        let newHardQuestions = props.questions.hardQuestions
        newMediumQuestions?.map((question) => {
            if (question.selected === undefined) {
                question.selected = false
            }
        })
        setMediumQuestions(newMediumQuestions)
        newHardQuestions?.map((question) => {
            if (question.selected === undefined) {
                question.selected = false
            }
        })
        setHardQuestions(newHardQuestions)
        return () => {

        }
    }, [props.users, props.questions])

    const start = () => {
        props.sendMessage('4', 'ROUND')
    }

    const countDown = () => {
        props.sendMessage(time, 'COUNT')
    }

    const updateUser = () => {
        props.sendMessage(JSON.stringify(users), 'UPDATE')
    }

    const updatePackage = (newFinishPackage) => {
        props.sendMessage(JSON.stringify(newFinishPackage), 'PACKAGE')
    }

    const confirmPackage = () => {
        props.sendMessage('', 'CONFIRM')
    }

    const displayPackage = () => {
        let initialPackage = [0, 0, 0, 0]
        setFinishPackage(initialPackage)
        props.sendMessage(JSON.stringify(initialPackage), 'PACKAGE')
    }

    const star = () => {
        setIsChoosingStar(!isChoosingStar)
        props.sendMessage((!isChoosingStar).toString(), 'STAR')
    }

    const correctFinish = () => {
        users.map((user) => {
            if (user.selected) {
                if (user.answering) {
                    if (isChoosingStar) {
                        user.score += 2 * score
                        setIsChoosingStar(false)
                        props.sendMessage('false', "STAR")
                    } else {
                        user.score += score
                    }
                } else {
                    user.score -= score;
                }
            } else if (user.answering) {
                user.score += score;
            }
            user.answering = false
        })
        updateUser()
    }

    const incorrectFinish = () => {
        if (isChoosingStar) {
            setIsChoosingStar(false)
            props.sendMessage('false', "STAR")
        }
        users.map((user) => {
            if (user.answering && !user.selected) {
                user.score -= score/2
            }
            user.answering = false
        })
        updateUser()
    }
    return <div>
        <h1>{props.time}</h1>
        <button className="admin-button" onClick={() => start()}>Start</button>
        <button className="admin-button" onClick={() => countDown()}>Count down</button>
        <button className="admin-button" onClick={() => { 
            users?.map((user) => {
                if (user.selected && isChoosingStar) {
                    user.score -= score
                }
                user.answering = false
            })
            updateUser()
            props.sendMessage('5', 'COUNT')
         }}>Thời gian giành quyền</button>
        <button className="admin-button" onClick={() => displayPackage()}>Chọn gói câu hỏi</button>
        <br />
        20
        {finishPackage?.map((score, index) => {
            return <input
                type="checkbox"
                checked={score === 20}
                key={index}
                onChange={(e) => {
                    const newFinishPackage = [...finishPackage]
                    if (e.target.checked) {
                        newFinishPackage[index] = 20
                    }

                    setFinishPackage(newFinishPackage)
                    updatePackage(newFinishPackage)
                }} />
        })}
        <br />
        30
        {finishPackage?.map((score, index) => {
            return <input
                type="checkbox"
                checked={score === 30}
                key={index}
                onChange={(e) => {
                    const newFinishPackage = [...finishPackage]
                    if (e.target.checked) {
                        newFinishPackage[index] = 30
                    }

                    setFinishPackage(newFinishPackage)
                    updatePackage(newFinishPackage)
                }} />
        })}
        <br />
        <button className="admin-button" onClick={() => confirmPackage()}>Confirm</button>
        <button className="admin-button" onClick={() => correctFinish()}>True</button>
        <button className="admin-button" onClick={() => incorrectFinish()}>False</button>
        <button className="admin-button" onClick={() => star()}>Ngôi sao hy vọng</button>
        <table>
            <thead>
                <tr>
                    <th>Họ tên</th>
                    <th>Điểm sửa</th>
                    <th>Điểm hiện tại</th>
                </tr>

            </thead>
            <tbody>
                {users?.map((user, index) => {
                    return <tr
                        key={index}
                        className={user.answering ? "admin-user-item user-item__answer" : "admin-user-item"}>
                        <td>
                            <button className="admin-button"
                                onClick={() => {
                                    users?.map((user) => {
                                        user.selected = false
                                    })
                                    user.selected = true
                                    updateUser()
                                }}>{user.name}</button>
                        </td>
                        <td>
                            <input
                                onChange={(e) => user.score = e.target.value}
                                defaultValue={user.score} />
                        </td>
                        <td><h3>{user.score}</h3></td>
                    </tr>
                })}
            </tbody>


        </table>
        <table>
            <thead>
                <tr>
                    <th></th>
                    <th>Điểm</th>
                    <th>Câu hỏi</th>
                    <th>Câu trả lời</th>
                    <th>Đã được chọn</th>
                </tr>
            </thead>

            <tbody>
                {mediumQuestions?.map((question, index) => {
                    return <tr key={index}>
                        <td>
                            <button
                                className="admin-button"
                                onClick={() => {
                                    users?.map((user) => {
                                        if (user.selected) {
                                            user.answering = true
                                        } else {
                                            user.answering = false
                                        }
                                    })
                                    props.sendMessage(JSON.stringify(question), 'QUESTION')
                                    let newMediumQuestions = [...mediumQuestions]
                                    newMediumQuestions[index].selected = true
                                    setMediumQuestions(newMediumQuestions)
                                    setTime('15')
                                    setScore(question.score)
                                }}>
                                Hiển thị
                            </button>
                        </td>
                        <td>{question.score}</td>
                        <td>{question.question}</td>
                        <td>{question.answer}</td>
                        <td><input type='checkbox' checked={question.selected} onChange={(e) => question.selected = e.target.checked} /></td>
                    </tr>
                })}
            </tbody>


        </table>
        <table>
            <thead>
                <tr>
                    <th></th>
                    <th>Điểm</th>
                    <th>Câu hỏi</th>
                    <th>Câu trả lời</th>
                    <th>Đã được chọn</th>
                </tr>
            </thead>

            <tbody>
                {hardQuestions?.map((question, index) => {
                    return <tr key={index}>
                        <td>
                            <button
                                className="admin-button"
                                onClick={() => {
                                    users?.map((user) => {
                                        if (user.selected) {
                                            user.answering = true
                                        } else {
                                            user.answering = false
                                        }
                                    })
                                    props.sendMessage(JSON.stringify(question), 'QUESTION')
                                    let newHardQuestions = [...hardQuestions]
                                    newHardQuestions[index].selected = true
                                    setHardQuestions(newHardQuestions)
                                    setTime('20')
                                    setScore(question.score)
                                }}>
                                Hiển thị
                            </button>
                        </td>
                        <td>{question.score}</td>
                        <td>{question.question}</td>
                        <td>{question.answer}</td>
                        <td><input type='checkbox' checked={question.selected} onChange={(e) => question.selected = e.target.checked} /></td>
                    </tr>
                })}
            </tbody>


        </table>
    </div>
}