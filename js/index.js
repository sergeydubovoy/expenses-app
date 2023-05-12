let LIMIT = 10000;

// Константы со значениями

const CURRENCY = "₽";
const STATUS_IN_LIMIT = "Все хорошо";
const STATUS_OUT_OF_LIMIT = "Лимит превышен";
const STATUS_OUT_OF_LIMIT_CLASSNAME = "status_red";

// Константы для добавления расходов

const inputNode = document.querySelector('[js-data="expense__input"]');
const buttonAddExpense = document.querySelector(
  '[js-data="expense__button_add"]'
);
const historyNode = document.querySelector('[js-data="history"]');
const sumNode = document.querySelector('[js-data="sum"]');
const limitNode = document.querySelector('[js-data="limit__value"]');
const statusNode = document.querySelector('[js-data="status"]');
const buttonResetHistory = document.querySelector(
  '[js-data="history__button_reset"]'
);

const expenses = [];

// Константы для выбора категория

const categoriesModalWrapper = document.querySelector(
  '[js-data="categories__modal-wrapper"]'
);
const buttonChoseCategory = document.querySelector(
  '[js-data="categories__button"]'
);
const categoryNode = document.querySelector('[js-data="categories__item"]');
const categoryNodes = document.querySelectorAll('[js-data="categories__item"]');
const arrowButton = document.querySelector('[js-data="button__span"]');

let selectedCategory = "";

// Константы для вызова попапа и изменения лимита

const body = document.querySelector(".body");
const openPopupButton = document.querySelector('[js-data="limit__button"]');
const closePopupButton = document.querySelector(
  '[js-data="popup__close-button"]'
);
const changeLimitInput = document.querySelector(
  '[js-data="change-limit__input"]'
);
const changeLimitButton = document.querySelector(
  '[js-data="change-limit__button"]'
);
const popup = document.querySelector('[js-data="popup"]');

initApp(expenses);

buttonAddExpense.addEventListener("click", function () {
  const expense = getExpenseFromUser();

  if (!expense) {
    return;
  }

  trackExspenses(expense);
  render(expenses);
  resetSelectedCategory();
});

function initApp(expenses) {
  limitNode.innerText = LIMIT;
  statusNode.innerText = STATUS_IN_LIMIT;
  sumNode.innerText = calculateExpenses(expenses);
}

function trackExspenses(expense) {
  const expenseObject = { name: expense, category: selectedCategory };
  expenses.push(expenseObject);
}

function getExpenseFromUser() {
  if (!inputNode.value) {
    return null;
  }

  const expense = parseInt(inputNode.value);

  clearInput();

  return expense;
}

function clearInput() {
  inputNode.value = "";
}

function calculateExpenses(expenses) {
  const total = expenses.reduce((sum, expense) => {
    if (typeof expense.name === "number") {
      return sum + expense.name;
    }
    return sum;
  }, 0);

  return total;
}

function resetSelectedCategory() {
  selectedCategory = "";
  buttonChoseCategory.textContent = "Категория";
}

function render(expenses) {
  const sum = calculateExpenses(expenses);

  renderHistory(expenses);
  renderSum(sum);
  renderStatus(sum);
}

function renderHistory(expenses) {
  let expensesListHTML = "";

  expenses.forEach((expense) => {
    expensesListHTML += `<li>${expense.name} ${CURRENCY} - ${
      expense.category ? expense.category : ""
    }</li>`;
  });

  historyNode.innerHTML = `<ol class="history__list">${expensesListHTML}</ol>`;
}

function renderSum(sum) {
  sumNode.innerText = sum;
}

function renderStatus(sum) {
  if (sum <= LIMIT) {
    statusNode.innerText = STATUS_IN_LIMIT;
  } else {
    statusNode.innerText = STATUS_OUT_OF_LIMIT;
    statusNode.classList.add(STATUS_OUT_OF_LIMIT_CLASSNAME);
  }
}

// Добавление расхода по нажатию Enter

inputNode.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    buttonAddExpense.click();
  }
});

// Выбор категорий

buttonChoseCategory.addEventListener("click", function () {
  toggleCategoriesModal();
  arrowButton.style.transform =
    arrowButton.style.transform === "rotateZ(90deg)"
      ? "rotateZ(0deg)"
      : "rotateZ(90deg)";
});

function selectCategory(category) {
  selectedCategory = category;
  categoriesModalWrapper.classList.remove("categories__modal-wrapper_active");
  buttonChoseCategory.textContent = selectedCategory;
  arrowButton.style.transform = "rotateZ(0deg)";
}

categoryNodes.forEach(function (categoryNode) {
  categoryNode.addEventListener("click", function () {
    selectCategory(categoryNode.textContent);
    arrowButton.style.transform = "rotateZ(0deg)";
  });
});

function toggleCategoriesModal() {
  categoriesModalWrapper.classList.toggle("categories__modal-wrapper_active");
  selectedCategory = "";
  arrowButton.style.transform = "rotateZ(0deg)";
}

// Попап

openPopupButton.addEventListener("click", function () {
  popup.style.opacity = "1";
  popup.style.visibility = "visible";
  body.classList.toggle("body_fixed");
});

changeLimitButton.addEventListener("click", function (event) {
  const newLimitValue = changeLimitInput.value;
  LIMIT = newLimitValue;
  limitNode.innerHTML = LIMIT;

  popup.style.opacity = "0";
  popup.style.visibility = "hidden";
  body.classList.remove("body_fixed");
});

// Сброс

buttonResetHistory.addEventListener("click", function () {
  expenses.length = 0;
  render([]);
  resetSelectedCategory();
});
