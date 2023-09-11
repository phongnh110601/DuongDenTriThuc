import '../../style/obstacle.css'

export default function Crossword(props) {

    const characterComponent = (char, index) => {
        if (char === ' ') {
            return null;
        }
        if (props.answered) {
            if (props.isCorrect) {
                return <h3 key={index} className='character shadow'>{char}</h3>
            } else {
                return <h3 key={index} className='character character__false shadow'></h3>
            }
        } else {
            return <h3 key={index} className={props.isSelecting ? 'character character__selected shadow' : 'character shadow'}></h3>
        }
    }

    return <div className='crossword'>
        <div className='keyword-container'>
            {
                props.keyword.toUpperCase().split('').map((char, index) => {
                    return characterComponent(char, index)
                })
            }
        </div>
        <h2 className='shadow'>{props.index}</h2>
    </div>
}