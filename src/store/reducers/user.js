

var initState = {
    isLogin : false
}


export default (state=initState, action) => {
    switch (action.type) {
        case 'login':
            return {
                isLogin: true
            } 
            case 'exitLogin':
            return {
                isLogin: false
            }   
        default:
            return state
    }
}
