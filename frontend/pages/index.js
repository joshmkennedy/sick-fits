import Link from 'next/link'

import Items from '../components/Items'


const Home = props => (
    <div>
        {console.log(props)}
        <Items page={parseFloat(props.query.page) || 1} />
    </div>
)
export default Home