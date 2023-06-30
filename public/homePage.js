'use strict'

const showNotification = (object, isSuccess, message) => {
    object.setMessage(isSuccess, message);
}

// Выход из личного кабинета
const logoutButton = new LogoutButton();
logoutButton.action = () => {
    ApiConnector.logout((response) => {
        if (response.success) {
            location.reload();
        }
    })
}

// Получение информации о пользователе

ApiConnector.current((response) => {
    if (response.success) {
        ProfileWidget.showProfile(response.data);
    }
})

// Получение текущих курсов валюты

const ratesBoard = new RatesBoard();

function getCurrencyRates() {
    ApiConnector.getStocks((response) => {
        if (response.success) {
            ratesBoard.clearTable();
            ratesBoard.fillTable(response.data);
        }
    })
}

getCurrencyRates();
setInterval(getCurrencyRates, 60000);

// Операции с деньгами

const moneyManager = new MoneyManager();

// Пополнение баланса
moneyManager.addMoneyCallback = (data) => {
    ApiConnector.addMoney(data, (response) => {
        if (response.success) {
            ProfileWidget.showProfile(response.data);
        }
        showNotification(moneyManager, response.success, response.success ? 'Баланс пополнен' : response.error)
    })
}

// Конвертирование валюты
moneyManager.conversionMoneyCallback = (data) => {
    ApiConnector.convertMoney(data, (response) => {
        if (response.success) {
            ProfileWidget.showProfile(response.data);
        }
        showNotification(moneyManager, response.success, response.success ? 'Конвертация произведена успешно' : response.error)
    })
}

// Перевод валюты

moneyManager.sendMoneyCallback = (data) => {
    ApiConnector.transferMoney(data, (response) => {
        if (response.success) {
            ProfileWidget.showProfile(response.data);
        }
        showNotification(moneyManager, response.success, response.success ? 'Перевод произведена успешно' : response.error)
    })
}

// Работа с избранным

const favoritesWidget = new FavoritesWidget();

const updateFavorites = (isSuccess, favoritesData) => {
    if (isSuccess) {
        favoritesWidget.clearTable();
        favoritesWidget.fillTable(favoritesData);
        moneyManager.updateUsersList(favoritesData);
    }
}

// Инициализация начального списка избранного
ApiConnector.getFavorites((response) => {
    updateFavorites(response.success, response.data);
})

// Добавление пользователя в избранное
favoritesWidget.addUserCallback = (data) => {
    ApiConnector.addUserToFavorites(data, (response) => {
        updateFavorites(response.success, response.data);
        showNotification(favoritesWidget, response.success, response.success ? 'Пользователь добавлен в избранное' : response.error)
    })
}

// Удаление пользователя из избранного
favoritesWidget.removeUserCallback = (data) => {
    ApiConnector.removeUserFromFavorites(data, (response) => {
        updateFavorites(response.success, response.data);
        showNotification(favoritesWidget, response.success,response.success ? 'Пользователь удален из избранного' : response.error)
    })
}