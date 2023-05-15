// Элементы со значениями

let LIMIT = 10000;
const CURRENCY = " ₽";
const STATUS_IN_LIMIT = "Все хорошо";
const STATUS_OUT_OF_LIMIT = "Лимит превышен";
const STATUS_OUT_OF_LIMIT_CLASSNAME = "status_red";

// Элементы для добавления расходов, статистики, выбора категорий

const inputNode = document.getElementById("expenseInput");
const addExpenseButton = document.getElementById("addExpenseButton");
const categorySelect = document.getElementById("categorySelect");
let categoryNode = categorySelect.value;
const sumNode = document.getElementById("sumValue");
const limitNode = document.getElementById("limitValue");
const statusNode = document.getElementById("status");
const historyNode = document.getElementById("history");
const resetHistoryButton = document.getElementById("resetHistoryButton");

const expenses = [];

let selectedCategory = "";

// Элементы для вызова попапа и изменения лимита

const body = document.querySelector(".body");
const popup = document.getElementById("popup");
const openPopupButton = document.getElementById("openPopupButton");
const closePopupButton = document.getElementById("closePopupButton");
const newLimitInput = document.getElementById("newLimitInput");
const changeLimitButton = document.getElementById("changeLimitButton");

const calculateExpenses = (expenses) => {
  const total = expenses.reduce((sum, expense) => {
    if (typeof expense.amount === "number") {
      return sum + expense.amount;
    }
    return sum;
  }, 0);

  return total;
};

const trackExpenses = (expense) => {
  const expenseObject = { amount: expense, category: categorySelect.value };
  expenses.push(expenseObject);
};

const getExpenseFromUser = () => {
  if (!inputNode.value) {
    return null;
  }

  const expense = parseInt(inputNode.value);

  clearInput();

  return expense;
};

const initApp = (expenses) => {
  limitNode.innerText = LIMIT + CURRENCY;
  statusNode.innerText = STATUS_IN_LIMIT;
  sumNode.innerText = calculateExpenses(expenses) + CURRENCY;
};

initApp(expenses);

addExpenseButton.addEventListener("click", () => {
  const expense = getExpenseFromUser();

  if (!expense) {
    return;
  }

  trackExpenses(expense);
  render(expenses);
  resetSelectedCategory();
});

const clearInput = () => {
  inputNode.value = "";
};

const resetSelectedCategory = () => {
  categorySelect.selectedIndex = 0;
};

const render = (expenses) => {
  const sum = calculateExpenses(expenses);

  renderHistory(expenses);
  renderSum(sum);
  renderStatus(sum);
};

const renderHistory = (expenses) => {
  let expensesListHTML = "";

  expenses.forEach((expense) => {
    expensesListHTML += `<li>${expense.amount} ${CURRENCY} - ${
      expense.category ? expense.category : ""
    }</li>`;
  });

  historyNode.innerHTML = `<ol class="history__list">${expensesListHTML}</ol>`;
};

const renderSum = (sum) => {
  sumNode.innerText = sum + CURRENCY;
};

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

// Добавление расхода по нажатию Enter

inputNode.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    addExpenseButton.click();
  }
});

// Выбор категорий

categorySelect.addEventListener("change", () => {
  categoryNode = categorySelect.value;
});

// Открытие попапа

openPopupButton.addEventListener("click", () => {
  popup.style.opacity = "1";
  popup.style.visibility = "visible";
  body.classList.toggle("body_fixed");
});

// Функция изменения лимита, в которой:
// - присвоение значения нового лимита от инпута
// - проверка на пустую строку и значение меньшее или равное нулю
// - обновление лимита
// - пересчет лимита и тоггл класса, чтобы статус правильно отображался
// - закрытие попапа

changeLimitButton.addEventListener("click", (event) => {
  const newLimitValue = newLimitInput.value;
  if (!newLimitValue || Number(newLimitValue) <= 0) {
    alert("Лимит должен быть числом, большим нуля!");
    return;
  }
  LIMIT = newLimitValue;
  limitNode.innerHTML = LIMIT;
  renderStatus(calculateExpenses(expenses));
  statusNode.classList.toggle(
    STATUS_OUT_OF_LIMIT_CLASSNAME,
    calculateExpenses(expenses) > LIMIT
  );
  closePopup();
});

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

resetHistoryButton.addEventListener("click", () => {
  expenses.length = 0;
  render([]);
  resetSelectedCategory();
});
