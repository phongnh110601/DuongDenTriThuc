import '../../style/waiting.css'

export default function WaitingScreen(props) {
    
    return <div className="waiting-page">
        {props.users.map((user, index) => {
            return <div key={index} className='waiting-user-item'>
                <img src={'http://' + props.ip + ':8080/' + user.avatar}/>
                <h2>{user.name}</h2>
                <h1>{user.score}</h1>
            </div>
        })}
    </div>
}