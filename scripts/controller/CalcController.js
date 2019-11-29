class CalcController {
    constructor() {
        this._lastOperator = '';
        this._lastNumber = '';
        this._operation = [];
        this._locale = 'pr-Br';
        this._displayCalcEl = document.querySelector("#display");
        this._dateEl = document.querySelector("#data");
        this._timeEl = document.querySelector("#hora");

        this._currentDate;

        this.initialize();
        this.initButtonsEvents();
    }

    initialize() {
        this.setDisplayDate();
        setInterval(() => {
            this.setDisplayDate();
        }, 1000);
        this.setLastOperationDisplay();
    }

    setDisplayDate() {
        this.displayDate = this.currentDate.toLocaleDateString(this._locale, {
            day: "2-digit",
            month: "long",
            year: "numeric"
        });
        this.displayTime = this.currentDate.toLocaleTimeString(this._locale);
    }

    addEventListenerAll(element, events, fn) {
        events.split(" ").forEach(event => {
            element.addEventListener(event, fn, false);
        });
    }

    clearAll() {
        this._operation = [];
        this.setLastOperationDisplay();
    }

    clearEntry() {
        this._operation.pop();
        this.setLastOperationDisplay();
    }

    getLastOperation() {
        return this._operation[this._operation.length - 1];
    }

    setLastOperation(value){
        this._operation[this._operation.length - 1] = value;
    }

    isOperator(value) {
        return (['+', '-', '*', '/', '%', '.'].indexOf(value) > -1);
    }

    pushOperation(value){
        this._operation.push(value);
        if(this._operation.length > 3){
            this.calc();
        }
    }

    getResult(){
        return eval(this._operation.join(""));
    }

    calc(){
        let last = '';
        this._lastOperator = this.getLastElement();

        if(this._operation.length < 3){
            let firstNumber = this._operation[0];
            this._operation = [firstNumber,this._lastOperator,this._lastNumber];
        }

        if(this._operation.length > 3){
            last = this._operation.pop();
            this._lastNumber = this.getResult();
        }else if(this._operation.length == 3){
            this._lastNumber = this.getLastElement(false);
        }

        
        let result = this.getResult();
        if(last == "%"){
            result /= 100;
            this._operation = [result];
        }else{
            this._operation = [result];
        }
        
        if(last != ''){
            this._operation.push(last);
        }

        this.setLastOperationDisplay();
    }

    getLastElement(isOperator = true){
        let lastElement = '';

        for(let i = this._operation.length-1; i >= 0; i--){
            if(this.isOperator(this._operation[i]) == isOperator){
                lastElement = this._operation[i];
                break;
            }
        }

        if(lastElement === ''){
            lastElement = (isOperator) ? this._lastOperator : this._lastNumber; 
        }

        return lastElement;
    }

    setLastOperationDisplay(){        
        let lastNumber = this.getLastElement(false);    
        this.displayCalc = lastNumber ? lastNumber : 0;
    }

    addOperation(value) {
        if (isNaN(this.getLastOperation())) {
            if (this.isOperator(value)) {
                this.setLastOperation(value);
            } else if(isNaN(value)){
                console.log('B');
            } else {
                this.pushOperation(value);
                this.setLastOperationDisplay();
            }
        } else {
            if (this.isOperator(value)) {
                this.pushOperation(value);
            }else{
                let newValue = this.getLastOperation().toString() + value.toString();
                this.setLastOperation(parseInt(newValue));
                this.setLastOperationDisplay();
            }
        }
    }

    setError() {
        this.displayCalc = "Error";
    }

    execBtn(value) {
        switch (value) {
            case "ac":
                this.clearAll();
                break;
            case "ce":
                this.clearEntry();
                break;
            case "porcento":
                this.addOperation('%');
                break;
            case "divisao":
                this.addOperation('/');
                break;
            case "multiplicacao":
                this.addOperation('*');
                break;
            case "subtracao":
                this.addOperation('-');
                break;
            case "soma":
                this.addOperation('+');
                break;
            case "ponto":
                this.addOperation('.');
                break;
            case "igual":
                this.calc();
                break;
            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                this.addOperation(parseInt(value));
                break;
            default:
                this.setError();
                break;
        }
    }

    initButtonsEvents() {
        let buttons = document.querySelectorAll("#buttons > g, #parts > g");

        buttons.forEach((btn, index) => {
            this.addEventListenerAll(btn, 'click drag', e => {
                let textBtn = btn.className.baseVal.replace("btn-", "");

                this.execBtn(textBtn);
            });

            this.addEventListenerAll(btn, 'mouseover mouseup mousedown', e => {
                btn.style.cursor = "pointer";
            });
        });

    }

    get displayDate() {
        return this._dateEl.innerHTML;
    }

    set displayDate(value) {
        this._dateEl.innerHTML = value;
    }

    get displayTime() {
        return this._timeEl.innerHTML;
    }

    set displayTime(value) {
        this._timeEl.innerHTML = value;
    }

    get displayCalc() {
        return this._displayCalcEl.innerHTML;
    }

    set displayCalc(value) {
        this._displayCalcEl.innerHTML = value;
    }

    get currentDate() {
        return new Date();
    }

    set currentDate(value) {
        this._currentDate = value;
    }
}