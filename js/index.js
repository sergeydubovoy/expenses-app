// Константы со значениями

const LIMIT = 10000;
const CURRENCY = "₽";
const STATUS_IN_LIMIT = "Все хорошо";
const STATUS_OUT_OF_LIMIT = "Все не очень";
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
  expenses.push(expense);
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
  let sum = 0;

  expenses.forEach((element) => {
    sum += element;
  });

  return sum;
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

  expenses.forEach((element) => {
    expensesListHTML += `<li>${element} ${CURRENCY}</li>`;
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

// Изменение класса списка категорий

buttonChoseCategory.addEventListener("click", function () {
  toggleCategoriesModal();
});

// Функция выбора категории

function selectCategory(category) {
  selectedCategory = category;
  categoriesModalWrapper.classList.remove("categories__modal-wrapper_active");
  buttonChoseCategory.textContent = selectedCategory;
}

// Цикл с функцией, которая принимает текст названий категорий

categoryNodes.forEach(function (categoryNode) {
  categoryNode.addEventListener("click", function () {
    selectCategory(categoryNode.textContent);
  });
});

// Функция меняет класс для модального окна и очищает текст выбранной категории

function toggleCategoriesModal() {
  categoriesModalWrapper.classList.toggle("categories__modal-wrapper_active");
  selectedCategory = "";
}
// const arrowButton = document.querySelector('[js-data="button__span_right"]');

// arrowButton.addEventListener("click", function () {
//   console.log(1);
//   arrowButton.classList.toggle("button__span_down");
//   toggleCategoriesModal();
// });

openPopupButton.addEventListener("click", function () {
  popup.style.opacity = "1";
  popup.style.visibility = "visible";
  body.classList.toggle("body_fixed");
});

changeLimitButton.addEventListener("click", function (event) {
  const newLimitValue = changeLimitInput.value;
  limitNode.innerHTML = newLimitValue;

  popup.style.opacity = "0";
  popup.style.visibility = "hidden";
  body.classList.remove("body_fixed");
});
