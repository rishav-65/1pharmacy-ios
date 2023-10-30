import { config } from '@APIConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import APIPost from '../APIHandler/APIPost';
import { getURL } from '@APIRepository';

export const getUserSessions = async () => {
    try {
        return JSON.parse(await AsyncStorage.getItem('userSessions') as string);
    } catch (err) {
        return null;
    }
}

export const getActiveUserSession = async () => {

}

export const requestOTP = async (phone: string) => {
    return APIPost({
        url: getURL({
          key: 'GENERATE_LOGIN_OTP'
        }),
        body: {
          phone: phone
        }
      })
}

export const submitOTP = async (phone: string, OTP: string) => {
    return APIPost({
        url: getURL({
            key: 'USER_LOGIN'
        }),
        body: {
            phone: phone,
            otp: OTP
        }
    })
}

export const setUserSessions = async (sessions: Array<any>) => {
    await AsyncStorage.setItem(
        'userSessions',
        JSON.stringify({ sessions, loggedIn: true, lastActiveSessionIndex: 0, activeSessionIndex: 0 }),
    );

    return(sessions[0]);
}

export const logOut = async () => {
    try {
        const loggedInUser = await getUserSessions();
        await AsyncStorage.removeItem('userSessions');
    } catch (err) {
        console.log(err);
    }
}
