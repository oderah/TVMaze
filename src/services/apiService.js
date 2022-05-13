const axios = require('axios')

const HAS_CONTENT_TYPE = [ 'post', 'put', 'patch' ]

const onError = ({ err, handleErrors }) => {
    if (handleErrors) return handleErrors(err)
    console.error(err)
    return null
}
const request = async ({ url, type, data, handleErrors }) => {
    let headers = {}, res
    if (HAS_CONTENT_TYPE.includes(type)) headers['Content-Type'] = 'application/json'
    try {
        switch (type) {
            case 'get':
                res = await axios.get(url, { headers }) 
                break
            case 'post':
                res = await axios.post(url, data, { headers }) 
                break
            case 'patch':
                res = await axios.patch(url, data, { headers }) 
                break
            case 'delete':
                res = await axios.delete(url, { headers, data })
                break
            default:
                res = null
                break
        }
        return res
    } catch(err) {
        return onError({ 
            err, handleErrors
        })
    }
}

export default request