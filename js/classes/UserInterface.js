import { budgetValue, addElementFormContainer, formAddElement, conceptButton, valueButton, listElementsContainer, emptyMessageContainer } from '../selectors.js';
import { db } from '../app.js';
import { bdg } from '../app.js';

class UserInterface {
    showAlert(message, type) {
        const alertDiv = document.createElement("div");
        alertDiv.textContent = message;
        alertDiv.classList.add("alert");

        setTimeout(() => {
            type === "error" ? alertDiv.classList.add("alert-error") : alertDiv.classList.add("alert-success");
        }, 100);

        if(!document.querySelector(".alert")) {
            document.querySelector("body").appendChild(alertDiv);

            setTimeout(() => {
                type === "error" ? alertDiv.classList.remove("alert-error") : alertDiv.classList.remove("alert-success");

                setTimeout(() => {
                    alertDiv.remove();
                }, 100);
            }, 3000);
        }
    }

    showBudgeValue(value) {
        if(value <= 0) {
            budgetValue.classList.add("advertisement");
        } else {
            budgetValue.classList.remove("advertisement");
        }
        budgetValue.textContent = `$${Intl.NumberFormat("es-ES").format(value)}`;
    }

    showAddForm(e, type) {
        e.preventDefault();
        addElementFormContainer.classList.remove("d-none");
        this.type = type;
    }

    hideAddForm(e) {
        formAddElement.reset();
        addElementFormContainer.classList.add("d-none");
    }

    validateSubmitForm(e, type) {
        e.preventDefault();
        const concept = conceptButton.value;
        const value = valueButton.value;
        const dt = new Date();
        if(!concept.trim().length || !value.trim().length) {
            this.showAlert("The description and value are required.", "error");
            return;
        }

        const element = {
            id: Date.now(),
            description: concept,
            value,
            date: `${dt.getDay()}/${dt.getMonth() + 1}/${dt.getFullYear()} ${dt.getHours()}:${dt.getMinutes()}:${dt.getSeconds()}`,
            type: this.type
        }

        if(db.insertToDB(element)) {
            this.type == "income" ? bdg.addToBudget(element.value) : bdg.substractToBudget(element.value);
            this.showBudgeValue(bdg.budget);
            this.showAlert("Added Successfully.");
            this.hideAddForm();
            this.showAllElements();
        } else {
            this.showAlert("An error has ocurred.");
        }
    }

    showAllElements() {
        this.clearListElementsContainer();
        db.selectAllToDB();
    }

    addItemInDOM(element) {
        const { id, description, value, date, type } = element.value;
        const elementDiv = document.createElement('div');
        elementDiv.className = `element ${type == "income" ? "income" : "expense"}`;
        elementDiv.innerHTML = `
            <div class="icon">
                <em class="${type == "income" ? "far fa-money-bill-alt" : "fas fa-shopping-basket"}"></em>
            </div>
            <div class="content">
                <h3 class="concept">${description}</h3>
                <p class="date">Date: <span>${date}</span></p>
                <p class="value">Value: <span>$${Intl.NumberFormat("es-ES").format(value)}</span></p>
            </div>
            <div class="delete">
                <em data-id="${id}" class="fas fa-trash"></em>
            </div>
        `;
        
        listElementsContainer.appendChild(elementDiv);
    }

    clearListElementsContainer() {
        while(listElementsContainer.children[1]) {
            listElementsContainer.removeChild(listElementsContainer.children[1]);
        }
    }

    deleteDOM(e) {
        const id = e.target.dataset.id;
        const value = e.target.parentElement.parentElement.querySelector(".value span").textContent.slice(1).split(".").join("");
        const type = e.target.parentElement.parentElement.classList.contains("income");
        if(id) {
            const answer = confirm('Are you sure you want to delete?');
            if(answer) {
                if(db.deleteToDB(Number(id))) {
                    e.target.parentElement.parentElement.remove();
                    type ? bdg.substractToBudget(value) : bdg.addToBudget(value);
                    this.showBudgeValue(bdg.budget);
                    this.validateEmptyList();
                    this.showAlert("Has been successfully removed.");
                }
            }
        }
    }

    validateEmptyList() {
        const emptyDiv = document.createElement("div");
        emptyDiv.classList.add("empty-list");
        emptyDiv.innerHTML = `
            <em class="fas fa-clipboard-list"></em>
            <h3>You haven't added any expenses or income.</h3>
        `;
        if(document.querySelector(".element")) {
            if(document.querySelector(".empty-list")) {
                emptyDiv.remove();
            }
        } else {
            listElementsContainer.appendChild(emptyDiv);
        }
    }

    resetAppDOM(e) {
        e.preventDefault();
        if(confirm("Are you sure you want to restart the app?")) {
            if(db.clearDB()) {
                bdg.clearBudget();
                window.location.reload();
                return;
            }
            this.showAlert("Can't restart the app.", "error");
        }
    }
}

export default UserInterface;