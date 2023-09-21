export default function Connect(props) {

    return <div>
        <input
            placeholder='Enter ip:'
            value={props.ip}
            className="admin-button"
            onChange={(e) => props.setIp(e.target.value)} />
        <input
            placeholder='Enter name:'
            className="admin-button"
            value={props.name}
            onChange={(e) => props.setName(e.target.value)} />
        <button
            className="admin-button"
            onClick={() => props.connect()}>
            Connect
        </button>
    </div>
}