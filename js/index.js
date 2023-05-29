//--ОБЪЯВЛЯЕМ ПЕРЕМЕННЫЕ И КОНСТАНТЫ--------------------------------------

// Элементы со значениями

const CURRENCY = " ₽";
const STATUS_IN_LIMIT = "Все хорошо";
const STATUS_OUT_OF_LIMIT = "Лимит превышен";
const STATUS_OUT_OF_LIMIT_CLASSNAME = "status_red";

const STORAGE_LABEL_LIMIT = "Limit";
const STORAGE_LABEL_EXPENSES = "expenses";

// Элементы для добавления расходов, статистики, выбора категорий

const inputNode = document.getElementById("expenseInput");
const addExpenseButton = document.getElementById("addExpenseButton");
const categorySelectNode = document.getElementById("categorySelect");
let categoryNode = categorySelectNode.value;
const sumNode = document.getElementById("sumValue");
const limitNode = document.getElementById("limitValue");

let LIMIT = 10000;

const statusNode = document.getElementById("status");
const historyNode = document.getElementById("history");
const resetHistoryButton = document.getElementById("resetHistoryButton");

const expensesFromStorageString = localStorage.getItem(STORAGE_LABEL_EXPENSES);
const expensesFromStorage = JSON.parse(expensesFromStorageString);
let expenses = [];

let selectedCategory = "";

// Элементы для вызова попапа и изменения лимита

const body = document.querySelector(".body");
const popup = document.getElementById("popup");
const openPopupButton = document.getElementById("openPopupButton");
const closePopupButton = document.getElementById("closePopupButton");
const newLimitInput = document.getElementById("newLimitInput");
const changeLimitButton = document.getElementById("changeLimitButton");

//--ФУНКЦИИ-----------------------------------------------------------------

// Функция подсчета суммы расходов
// - Отделяет от расхода+категории само значение расхода и считает сумму

const calculateSum = (expenses) => {
  const sum = expenses.reduce((sum, expense) => {
    return sum + expense.amount;
  }, 0);

  return sum;
};

// Функция сохранения расходов в localStorage

const saveExpensesToLocalStorage = () => {
  const expensesString = JSON.stringify(expenses);
  localStorage.setItem(STORAGE_LABEL_EXPENSES, expensesString);
};

// Функция трекера расходов
// - Проверяет на тип данных
// - Собирает значение расхода и его категорию
// - Добавляет в массив
// - Добавляет в localStorage

const trackExpenses = (expense) => {
  if (typeof expense !== "number") {
    return;
  }

  const expenseObject = { amount: expense, category: categorySelectNode.value };
  expenses.push(expenseObject);

  saveExpensesToLocalStorage();
};

// Функция получения расхода от пользователя
// - Проверяет инпут на пустое значение и на соответствие числу
// - Очищает инпут
// - Получает расход

const getExpenseFromUser = () => {
  if (inputNode.value === "") {
    return null;
  }

  const expense = parseInt(inputNode.value);

  clearInput();

  return expense;
};

// Функция инициализации лимита из локального хранилища браузера

const initLimit = () => {
  const localStorageLimit = localStorage.getItem(STORAGE_LABEL_LIMIT);
  if (localStorageLimit) {
    LIMIT = localStorageLimit;
    limitNode.innerText = LIMIT + CURRENCY;
  } else return;
};

// Главная функция инициализации приложения
// - Задает изначальные значения переменных при открытии приложения

const initApp = (expenses) => {
  initLimit();
  limitNode.innerText = LIMIT + CURRENCY;
  statusNode.innerText = STATUS_IN_LIMIT;
  sumNode.innerText = calculateSum(expenses) + CURRENCY;
};

// Запуск функции инициации

initApp(expenses);

// Функция добавления расхода
// - Объявляем константу с функцией получения расхода от пользователя
// - Проверяем на пустую строку
// - Запускаем функции:
//   - Трекера расходов
//   - Рендера
//   - Сброса выбранной категории

const addExpense = () => {
  const expense = getExpenseFromUser();

  if (!expense || categorySelectNode.selectedIndex === 0) {
    alert(!expense ? "Введите сумму расхода" : "Выберите категорию");
    return;
  }

  trackExpenses(expense);
  render(expenses);
  resetSelectedCategory();
};

// Обработчик события по клику на кнопку "Добавить"
// - При клике запускает функцию addExpense

addExpenseButton.addEventListener("click", addExpense);

// Функция очистки инпута после ввода расхода
// - Очищает поле инпута после ввода расхода

const clearInput = () => {
  inputNode.value = "";
};

// Функция сброса выбранной категории
// - Устанавливает выбранное значение в выпадающем меню select на значение по умолчанию

const resetSelectedCategory = () => {
  categorySelectNode.selectedIndex = 0;
};

// Большая функция рендеринга
// - Запускает функцию подсчета суммы расходов
// - Запускает функцию рендеринга истории
// - Запускает функцию рендеринга суммы
// - Запускает функцию рендеринга статусы

const render = (expenses) => {
  const sum = calculateSum(expenses);

  renderHistory(expenses);
  renderSum(sum);
  renderStatus(sum);
};

// Функция рендеринга истории
// - Создаем пустую строку, в которую будем добавлять новые элементы
// - Создаем список расходов на основе массива объектов expenses
//   - Цикл forEach проходит по каждому элементу массива expenses, который представляет один расход
//     и добавляет в переменную expensesListHTML новый элемент списка
//   - Элемент списка формируется с помощью шаблонной строки,
//     в которой информация о сумме расхода expense.amount и категория расхода expense.category
//   - Если для расхода не была указана категория,
//     тогда отображается пустая строка вместо категории (пустые кавычки)
// - Создаем список расходов

const renderHistory = (expenses) => {
  let expensesListHTML = "";

  expenses.forEach((expense) => {
    expensesListHTML += `<li>${expense.amount} ${CURRENCY} - ${
      expense.category ? expense.category : ""
    }</li>`;
  });

  historyNode.innerHTML = `<ol class="history__list">${expensesListHTML}</ol>`;
};

// Функция рендеринга суммы
// - В sumNode с поомощью свойства innerText вставляем сумму и знак рубля

const renderSum = (sum) => {
  sumNode.innerText = sum + CURRENCY;
};

// Функция рендеринга статуса
// - Проверяем значение суммы
//   - Если лимит больше суммы, то с помощью свойства innerText пишем, что все ок
//   - Если же сумма больше лимита, то с помощью свойства innerText подставляем шаблонную строку

const renderStatus = (sum) => {
  if (sum <= LIMIT) {
    statusNode.innerText = STATUS_IN_LIMIT;
  } else {
    statusNode.innerText = `${STATUS_OUT_OF_LIMIT} (${
      LIMIT - sum
    } ${CURRENCY})`;
    statusNode.classList.add(STATUS_OUT_OF_LIMIT_CLASSNAME);
  }
};

// Рендерим историю расходов из localStorage
if (Array.isArray(expensesFromStorage)) {
  expenses = expensesFromStorage;
}
render(expenses);

// Добавление расхода по нажатию Enter

inputNode.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    addExpense();
  }
});

// Выбор категорий
const categorySelect = () => {
  categoryNode = categorySelectNode.value;
};

categorySelectNode.addEventListener("change", categorySelect);

// Открытие попапа

const openPopup = () => {
  popup.style.opacity = "1";
  popup.style.visibility = "visible";
  body.classList.toggle("body_fixed");
};

openPopupButton.addEventListener("click", openPopup);

// Функция изменения лимита, в которой:
// - присвоение значения нового лимита от инпута
// - проверка на пустую строку и значение меньшее или равное нулю
// - обновление лимита
// - пересчет лимита и тоггл класса, чтобы статус правильно отображался
// - закрытие попапа

const setNewLimit = () => {
  const newLimitValue = newLimitInput.value;
  if (!newLimitValue || Number(newLimitValue) <= 0) {
    alert("Лимит должен быть числом, большим нуля!");
    return;
  }
  LIMIT = newLimitValue;
  limitNode.innerHTML = LIMIT;
  renderStatus(calculateSum(expenses));
  statusNode.classList.toggle(
    STATUS_OUT_OF_LIMIT_CLASSNAME,
    calculateSum(expenses) > LIMIT
  );
  localStorage.setItem(STORAGE_LABEL_LIMIT, newLimitValue);
  closePopup();
};

changeLimitButton.addEventListener("click", setNewLimit);

// Вызываем обработчик событий, чтобы лимит менялся еще и по нажатию Enter

newLimitInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    changeLimitButton.click();
  }
});

// По клику на кнопку закрытия попапа, он закрывается

closePopupButton.addEventListener("click", () => {
  closePopup();
});

// Проверяем был ли клик мышкой на сером фоне попапа, если да, то закрываем попап

popup.addEventListener("click", (event) => {
  if (event.target === popup) {
    closePopup();
  }
});

// Закрываем попап

const closePopup = () => {
  popup.style.opacity = "0";
  popup.style.visibility = "hidden";
  body.classList.remove("body_fixed");
};

// Сброс

const resetHistory = () => {
  expenses.length = 0;
  render([]);
  resetSelectedCategory();
  localStorage.removeItem(STORAGE_LABEL_EXPENSES);
};

resetHistoryButton.addEventListener("click", resetHistory);
