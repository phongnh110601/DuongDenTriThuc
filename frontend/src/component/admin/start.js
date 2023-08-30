import { useEffect, useState } from "react"
import '../../style/start.css'

export default function StartRound(props) {
    var users = props.users
    const [file, setFile] = useState(null)
    const [questions, setQuestions] = useState([])
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

    const loadJSON = () => {
        console.log(file)
        var reader = new FileReader()
        reader.onload = (event) => {
            setQuestions(JSON.parse(event.target.result))
            alert('Load successfully!')
        }
        reader.readAsText(file)
        setIndex(-1)
    }

    const upload = () => {
        const formData = new FormData()
        formData.append('file', file)
        fetch('http://' + props.ip + ':8080/file/excel-upload', {
            method: 'post',
            body: formData
        }).then(res => res.json())
            .then(data => {
                console.log(data)
                setQuestions(data)
                alert('Upload successfully!')
            })
    }

    const start = () => {
        props.sendMessage('', 'START')
    }

    const previousQuestion = () => {
        props.sendMessage(JSON.stringify(questions[index - 1]), 'QUESTION')
        setIndex(index - 1)
    }

    const nextQuestion = () => {
        props.sendMessage(JSON.stringify(questions[index + 1]), 'QUESTION')
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

    return <div>
        <input
            type='file'
            onChange={(e) => setFile(e.target.files[0])} />
        <button
            className="admin-button"
            onClick={() => upload()}>
            Upload
        </button>
        <h1>{props.time}</h1>
        <p>
            Lượt {questions[index]?.packageIndex}: {questions[index]?.index}/{getTotalNumber(questions[index]?.packageIndex)}
        </p>
        <h2>{questions[index]?.question}</h2>
        <h2>{questions[index]?.answer}</h2>
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
        <br />
        <button className="admin-button" onClick={() => trueAnswer()}>True</button>
        <button className="admin-button" onClick={() => falseAnswer()}>False</button>
        {users.map((user, index) => {
            return <div
                style={{ display: "flex", width: "fit-content" }}
                key={index}
                className={user.answering ? "user-item__answer" : ""}>
                <h1>{user.name}</h1>
                <input
                    style={{ fontSize: "2rem", width: "100px" }}
                    onChange={(e) => user.score = e.target.value}
                    defaultValue={user.score} />
                <h1>{user.score}</h1>
            </div>
        })}
        <button className="admin-button" onClick={() => updateUser()}>Update</button>
    </div>
}