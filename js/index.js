const LIMIT = 10000;
const CURRENCY = "₽";
const STATUS_IN_LIMIT = "Все хорошо";
const STATUS_OUT_OF_LIMIT = "Все не очень";
const STATUS_OUT_OF_LIMIT_CLASSNAME = "status_red";

const inputNode = document.querySelector('[js-data="js-expense__input"]');
const buttonNode = document.querySelector('[js-data="js-expense__button_add"]');
const historyNode = document.querySelector('[js-data="js-history"]');
const sumNode = document.querySelector('[js-data="js-sum"]');
const limitNode = document.querySelector('[js-data="js-limit__value"]');
const statusNode = document.querySelector('[js-data="js-status"]');

const categoriesModalWrapper = document.querySelector(
  '[js-data="js-categories__modal-wrapper"]'
);
const buttonChoseCategory = document.querySelector(
  '[js-data="js-categories__button"]'
);
const categoryNode = document.querySelectorAll(
  '[js-data="js-categories__item"]'
);
const categoryNodes = document.querySelectorAll(
  '[js-data="js-categories__item"]'
);

const arrowButton = document.querySelector('[js-data="js-button__span_right"]');

let selectedCategory = "";

const expenses = [];

initApp(expenses);

buttonNode.addEventListener("click", function () {
  const expense = getExpenseFromUser();

  if (!expense) {
    return;
  }

  trackExspenses(expense);
  render(expenses);
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

  historyNode.innerHTML = `<ol>${expensesListHTML}</ol>`;
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

inputNode.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    buttonNode.click();
  }
});

// Новая функциональность

buttonChoseCategory.addEventListener("click", function () {
  toggleCategoriesModal();
});

categoryNodes.forEach(function (categoryNode) {
  categoryNode.addEventListener("click", function () {
    selectCategory(categoryNode.textContent);
  });
});

function toggleCategoriesModal() {
  categoriesModalWrapper.classList.toggle("categories__modal-wrapper_active");
  selectedCategory = "";
}

function selectCategory(category) {
  selectedCategory = category;
  categoriesModalWrapper.classList.remove("categories__modal-wrapper_active");
  buttonChoseCategory.textContent = selectedCategory;
}
// не получается
arrowButton.addEventListener("click", function () {
  console.log(1);
  arrowButton.classList.toggle("button__span_down");
  toggleCategoriesModal();
});
