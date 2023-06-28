'use strict'

const userForm = new UserForm();

// Логин
userForm.loginFormCallback = (data) => {
    ApiConnector.login(data, (response) => {
        if (response.success) {
            location.reload();
        } else {
            userForm.setLoginErrorMessage(response.error)
        }
    })
}


// Регистрация
userForm.registerFormCallback = (data) => {
    ApiConnector.register(data, (response) => {
        if (response.success) {
            location.reload();
        } else {
            userForm.setRegisterErrorMessage(response.error)
        }
    })
}