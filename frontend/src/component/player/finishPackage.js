import '../../style/finish.css'

export default function FinishPackage(props) {

    return <div className='finish-package'>
        <div className="package-container shadow">
            <h1>20 ĐIỂM</h1>
            <div className='checkbox-container'>
                {props.finishPackage.map((score) => {
                    return <input type='checkbox' checked={score === 20}/>
                })}
            </div>
        </div>
        <div className="package-container shadow">
            <h1>30 ĐIỂM</h1>
            <div className='checkbox-container'>
                {props.finishPackage.map((score) => {
                    return <input type='checkbox' checked={score === 30}/>
                })}
            </div>
        </div>
    </div>
}