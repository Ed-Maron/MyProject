export const REQUEST_COURSE = 'REQUEST_COURSE';
export const RECEIVE_COURSE = 'RECEIVE_COURSE';
//const URL = "http://77.222.54.255";
/* for dev mode*/
const URL = "http://localhost:3000";

export function requestCourses() {
    return {
        type: REQUEST_COURSE
    }
}

export function receiveCourses(json) {
    return {
        type: RECEIVE_COURSE,
        courses: json
    }
}

export function fetchCourses() {
    return function (dispatch) {
        dispatch(requestCourses());
        const request = async () => {
            const response = await fetch(`${URL}/api/courses.json`);
            try {
                const json = await response.json();
                dispatch(receiveCourses(json));
            } catch (e) {
                console.log(e);
            }
        };
        return request();
    }
}

export const POST_USER_DATA = "POST_USER_DATA";
export const STATUS_SUCCESS = "STATUS_SUCCESS";
export const STATUS_ERROR = "STATUS_ERROR";

export function postUserData() {
    return {
        type: POST_USER_DATA
    }
}

export function statusSuccess() {
    return {
        type: STATUS_SUCCESS,

    }
}

export function statusError(msg) {
    return {
        type: STATUS_ERROR,
        msg
    }
}

export function signUpUser(email, password) {
    return function (dispatch) {
        dispatch(postUserData());
        if (!email && !password) {
            dispatch(statusError("Заполните поля email и пароль"));
            return;
        }
        const checkEmail = async(email) => {
            let isEmailNotNew = false;
            try {
                let data = await fetch(`${URL}/api/checkEmail/`, {
                    method: 'post',
                    credentials: 'include',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email
                    })
                });
                let isEmailNewJson = await data.json();
                isEmailNotNew = isEmailNewJson[0]["count(`id`)"] > 0;
            } catch (e) {
                dispatch(statusError(e.toString()));
                return;
            }
            if (isEmailNotNew) {
                dispatch(statusError("Email уже зарегестрирован"));
                return;
            } else {
                const registerNewUser = async (email, password) => {
                    try {
                        await fetch(`${URL}/api/signup/`, {
                            method: 'post',
                            credentials: 'include',
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                email,
                                password
                            })
                        });
                        dispatch(statusSuccess());
                    } catch (e) {
                        dispatch(statusError(e.toString()));
                    }
                };
                return registerNewUser(email, password);
            }
        };
        return checkEmail(email);
    }
}

export const LOGIN_POST_USER_DATA= "LOGIN_POST_USER_DATA";
export const LOGIN_STATUS_SUCCESS = "LOGIN_STATUS_SUCCESS";
export const LOGIN_STATUS_ERROR = "LOGIN_STATUS_ERROR";

export function checkUserData() {
    return {
        type: LOGIN_POST_USER_DATA
    }
}

export function loginStatusSuccess() {
    return {
        type: LOGIN_STATUS_SUCCESS,
    }
}

export function loginStatusError(msg) {
    return {
        type: LOGIN_STATUS_ERROR,
        msg
    }
}
export function logInUser(email, password) {
    return function(dispatch) {
        dispatch(checkUserData());
        if (!email || !password) {
            dispatch(loginStatusError("Заполните поля email и пароль"));
            return;
        }
        const checkUser = async (email, password) => {
            try {
                let data = await fetch(`${URL}/api/logInUser/`, {
                    method: 'post',
                    credentials: 'include',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email,
                        password
                    })
                });
                let checkUserDataJson = await data.json();
                if (checkUserDataJson.status === "success") {
                    dispatch(loginStatusSuccess());
                }else {
                    dispatch(loginStatusError(checkUserDataJson.msg));
                }
            }catch (e) {
                dispatch(loginStatusError(e.toString()));
                return;
            }
        };
        return checkUser(email, password);
    }
}

// export const AUTHORIZED_USER = "AUTHORIZED_USER";
// export const NOT_AUTHORIZED_USER = "NOT_AUTHORIZED_USER";
//
// export function authorizedUser() {
//     return {
//         type: AUTHORIZED_USER,
//     }
// }
//
// export function notAuthorizedUser() {
//     return {
//         type: NOT_AUTHORIZED_USER,
//     }
// }
//
// export function checkAuthorizationUser() {
//     return function (dispatch) {
//         const checkUser = async function() {
//             try {
//                 let data = await fetch(`${URL}/auth/isAuthorized`);
//                 let dataJson = await data.json();
//                 debugger;
//                 if(dataJson.isAuthorized) {
//                     dispatch(authorizedUser());
//                 }else {
//                     dispatch(notAuthorizedUser());
//                 }
//             }catch(e) {
//                 console.log(`Error: ${e}`);
//             }
//         };
//         return checkUser();
//     }
// }
