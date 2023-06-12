import Request from '../common/request'
import {
    baseURL
} from '../common/config'

const instance = new Request({
    baseURL,
    header: {
        
        'Content-Type': 'application/json'
    }
})

export default instance