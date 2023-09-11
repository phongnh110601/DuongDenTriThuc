import { useEffect, useState } from "react"
import '../../style/admin.css'

export default function StartRound(props) {
    var users = props.users

    const [index, setIndex] = useState(-1)

    useEffect(() => {
        users = props.users

        return () => {

        }
    }, [props.users])


    const updateUser = () => {
        console.log(props.users)
        props.sendMessage(JSON.stringify(users), 'UPDATE')
    }

    const start = () => {
        props.sendMessage('1', 'ROUND')
    }

    const previousQuestion = () => {
        props.sendMessage(JSON.stringify(props.questions[index - 1]), 'QUESTION')
        setIndex(index - 1)
    }

    const nextQuestion = () => {
        props.sendMessage(JSON.stringify(props.questions[index + 1]), 'QUESTION')
        setIndex(index + 1)
    }

    const countDown = () => {
        props.sendMessage('', 'COUNT')
    }

    const trueAnswer = () => {
        props.users.map((user) => {
            if (user.answering) {
                user.score += 10
                user.answering = false
            }
        })
        updateUser()
    }

    const falseAnswer = () => {
        props.users.map((user) => {
            if (user.answering) {
                user.score -= 5
                user.answering = false
            }
        })
        updateUser()
    }

    const getTotalNumber = (packageIndex) => {
        if (packageIndex === 1) {
            return 8;
        } else if (packageIndex === 2) {
            return 12;
        } else {
            return 16;
        }
    }

    const finish = () => {
        props.sendMessage('0', 'ROUND')
    }

    return <div>

        <h1>{props.time}</h1>
        <p>
            Lượt {props.questions?.[index]?.packageIndex}: {props.questions?.[index]?.index}/{getTotalNumber(props.questions?.[index]?.packageIndex)}
        </p>
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
        <button className="admin-button" onClick={() => countDown()}>Count down</button>
        <button className="admin-button" onClick={() => finish()}>Finish</button>
        <br />
        <button className="admin-button" onClick={() => trueAnswer()}>True</button>
        <button className="admin-button" onClick={() => falseAnswer()}>False</button>
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
                        <td><h3>{user.name}</h3></td>
                        <td>
                            <input
                                style={{ fontSize: "1rem", width: "100px" }}
                                defaultValue={user.score}
                                onChange={(e) => { user.score = Number.parseInt(e.target.value) }} /></td>
                        <td><h3>{user.score}</h3></td>
                    </tr>
                })}
            </tbody>


        </table>

        <button className="admin-button" onClick={() => updateUser()}>Update</button>
    </div>
}