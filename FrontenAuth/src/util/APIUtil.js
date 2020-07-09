import {API_BASE_URL, ACCESS_TOKEN} from "./constants.js";

const request = (options) => {
    const headers = new Headers({
        'Content-Type': 'application/json',
    })

    if(localStorage.getItem(ACCESS_TOKEN)) {
        headers.append('Authorization', 'Bearer ' + localStorage.getItem(ACCESS_TOKEN))
    }

    const defaults = {headers: headers};
    options = Object.assign({}, defaults, options);

    return fetch(options.url, options)
        .then(response =>
            response.json().then(json => {
                if(!response.ok) {
                    return Promise.reject(json);
                }
                return json;
            })
        );
};

export function login(loginRequest) {
    return request({
        url: API_BASE_URL + "/auth/signin",
        method: 'POST',
        body: JSON.stringify(loginRequest)
    });
}

export function signup(signupRequest) {
    return request({
        url:  API_BASE_URL + "/auth/signup",
        method: 'POST',
        body: JSON.stringify(signupRequest)
    });
}

export function forgot(forgotRequest) {
    return request({
        url:  API_BASE_URL + "/auth/forgotPassword",
        method: 'POST',
        body: JSON.stringify(forgotRequest)
    });
}

export function reset(resetRequest) {
    return request({
        url:  API_BASE_URL + "/auth/reset-password",
        method: 'PATCH',
        body: JSON.stringify(resetRequest)
    });
}