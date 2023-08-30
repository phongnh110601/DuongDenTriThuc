import '../../style/obstacle.css'
import StartUserItem from './startUserItem'

export default function ObstacleRound(props) {

    return <div className="obstacle-page">
        <div className='horizontal-container'>
            <div className='image-container'>
                <img
                    className='obstacle-image'
                    src='https://images.unsplash.com/photo-1575936123452-b67c3203c357?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8fDA%3D&w=1000&q=80' />
            </div>
            <div className='crossword-container'>
                <h2>CHƯỚNG NGẠI VẬT CÓ 13 CHỮ CÁI</h2>

            </div>
        </div>
        <div className='horizontal-container'>
            <div className='obstacle-question-container'>
                <h2 className='question-text'>
                    To use Type References in Java Jackson for converting a JSON array to a list, follow these steps
                </h2>
                <h1 className="obstacle-time">{props.time}</h1>
                <div className='answer-container'>
                    <input placeholder='Nhập đáp án'/>
                    <button>
                        Trả lời CNV
                    </button>
                </div>
            </div>
            <div className='users-container obstacle-users-container'>
                {props.users.map((user, index) => {
                    return <StartUserItem user={user} key={index} />
                })}
            </div>
        </div>
    </div>
}