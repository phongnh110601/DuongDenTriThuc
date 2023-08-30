export default function Connect(props) {

    return <div>
        <input
            placeholder='Enter ip:'
            value={props.ip}
            onChange={(e) => props.setIp(e.target.value)} />
        <input
            placeholder='Enter name:'
            value={props.name}
            onChange={(e) => props.setName(e.target.value)} />
        <button
            onClick={() => props.connect()}>
            Connect
        </button>
    </div>
}