import axios from 'axios';
import Cookies from 'js-cookie';

export default new class {

    login(userId,cb){
        Cookies.set('userId', userId);
        cb()
    }
    logout(username,cb){
        Cookies.remove('userId')
        axios('/api/logout', {
            method: "post",
            data: {username:username},
            withCredentials: true
        }).catch( err => {throw err});
        cb()
    }
}()

