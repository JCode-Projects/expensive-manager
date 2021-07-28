class Budget {
    constructor(budget) {
        this.budget = Number(budget);
        this.addToLocalStorage();
    }

    addToLocalStorage() {
        localStorage.setItem("budget", this.budget);
    }

    getBudget() {
        return this.budget;
    }

    addToBudget(value) {
        this.budget += Number(value);
        this.addToLocalStorage();
    }

    substractToBudget(value) {
        this.budget -= Number(value);
        this.addToLocalStorage();
    }

    clearBudget() {
        localStorage.removeItem('budget');
        this.budget = 0;
    }
}

export default Budget;