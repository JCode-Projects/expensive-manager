import { questionBudget, formBudget, budgetInput, addIncome, cancelFormButton, formAddElement, addExpense, listElementsContainer, resetAppButton } from './selectors.js';
import UserInterface from './classes/UserInterface.js';
import DB from "./classes/IndexDB.js";
import Budget from './classes/Budget.js';

export let db;
export let bdg;

document.addEventListener("DOMContentLoaded", () => {
    db = new DB();
    validateIfExistBudgetValue();
    addEventListeners();
});

const ui = new UserInterface();

function addEventListeners() {
    addIncome.onclick = e => ui.showAddForm(e, "income");
    addExpense.onclick = e => ui.showAddForm(e, "expense");
    cancelFormButton.onclick = () => ui.hideAddForm();
    formAddElement.onsubmit = e => ui.validateSubmitForm(e);
    listElementsContainer.onclick = e => ui.deleteDOM(e);
    resetAppButton.onclick = e => ui.resetAppDOM(e);
    setTimeout(() => ui.showAllElements(), 200);
    setTimeout(() => ui.validateEmptyList(), 300);
}

function validateIfExistBudgetValue() {
    const budgetValue = localStorage.getItem("budget");
    if(budgetValue) {
        questionBudget.classList.add("d-none");
        bdg = new Budget(budgetValue);
        ui.showBudgeValue(budgetValue);
        return;
    }
    formBudget.onsubmit = validateBudgetValue;
}

function validateBudgetValue(e) {
    e.preventDefault();
    const ValueOfInput = budgetInput.value;
    if(!ValueOfInput.trim().length) {
        ui.showAlert("Enter a valid budget.", "error");
        return;
    }

    bdg = new Budget(ValueOfInput);
    ui.showAlert("Your budget has been registered.");
    validateIfExistBudgetValue();
}