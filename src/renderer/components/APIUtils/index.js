import { API_BASE_URL } from '../constants'

const request = options => {
  const headers = new Headers({
    'Content-Type': 'application/json'
  })

  if (localStorage.accessToken !== 'null') {
    headers.append('Authorization', 'Bearer ' + localStorage.accessToken)
  }

  const defaults = {
    headers: headers
  }
  options = Object.assign({}, defaults, options)

  return fetch(options.url, options).then(response =>
    response.json().then(json => {
      if (!response.ok) {
        return Promise.reject(json)
      }
      return json
    })
  )
}

const formRequest = options => {
  const headers = new Headers({
    // 'Content-Type': 'multipart/form-data'
  })

  if (localStorage.accessToken !== 'null') {
    headers.append('Authorization', 'Bearer ' + localStorage.accessToken)
  }

  const defaults = {
    headers: headers
  }
  options = Object.assign({}, defaults, options)

  return fetch(options.url, options).then(response => {})
}

export function loadAvatar (email) {
  return request({
    url: API_BASE_URL + '/file/loadAvatar?email=' + email,
    method: 'GET'
  })
}

export function login (loginRequest) {
  return request({
    url: API_BASE_URL + '/auth/login',
    method: 'POST',
    body: JSON.stringify(loginRequest)
  })
}

export function signup (signupRequest) {
  return request({
    url: API_BASE_URL + '/auth/signup',
    method: 'POST',
    body: JSON.stringify(signupRequest)
  })
}

export function checkEmailAvailability (email) {
  return request({
    url: API_BASE_URL + '/account/checkEmailAvailability?email=' + email,
    method: 'GET'
  })
}

export function loadProfile (email) {
  return request({
    url: API_BASE_URL + '/account/profile?email=' + email,
    method: 'GET'
  })
}

export function editProfile (signupRequest) {
  return request({
    url: API_BASE_URL + '/account/profile/edit',
    method: 'POST',
    body: JSON.stringify(signupRequest)
  })
}

export function uploadAvatar (formData) {
  return formRequest({
    url: API_BASE_URL + '/file/uploadAvatar',
    method: 'POST',
    body: formData
  })
}
