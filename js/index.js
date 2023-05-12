const LIMIT = 10000;
const CURRENCY = "₽";
const STATUS_IN_LIMIT = "Все хорошо";
const STATUS_OUT_OF_LIMIT = "Все не очень";
const STATUS_OUT_OF_LIMIT_CLASSNAME = "status_red";

const inputNode = document.querySelector('[js-data="expense__input"]');
const buttonAddExpense = document.querySelector(
  '[js-data="expense__button_add"]'
);
const historyNode = document.querySelector('[js-data="history"]');
const sumNode = document.querySelector('[js-data="sum"]');
const limitNode = document.querySelector('[js-data="limit__value"]');
const statusNode = document.querySelector('[js-data="status"]');

const categoriesModalWrapper = document.querySelector(
  '[js-data="categories__modal-wrapper"]'
);
const buttonChoseCategory = document.querySelector(
  '[js-data="categories__button"]'
);
const categoryNode = document.querySelector('[js-data="categories__item"]');
const categoryNodes = document.querySelectorAll('[js-data="categories__item"]');

let selectedCategory = "";

const expenses = [];

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

// Новая функциональность

inputNode.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    buttonAddExpense.click();
  }
});

buttonChoseCategory.addEventListener("click", function () {
  toggleCategoriesModal();
});

function selectCategory(category) {
  selectedCategory = category;
  categoriesModalWrapper.classList.remove("categories__modal-wrapper_active");
  buttonChoseCategory.textContent = selectedCategory;
}

categoryNodes.forEach(function (categoryNode) {
  categoryNode.addEventListener("click", function () {
    selectCategory(categoryNode.textContent);
  });
});

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
