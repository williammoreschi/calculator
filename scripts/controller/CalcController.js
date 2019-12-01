class CalcController {
    constructor() {
        this._audio = new Audio('click.mp3');
        this._audioOnOff = false;
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
        this.initKeyboard();
    }

    initialize() {
        this.setDisplayDate();
        setInterval(() => {
            this.setDisplayDate();
        }, 1000);
        this.setLastNumberToDisplay();
        this.pastFromClipboard();

        document.querySelectorAll(".btn-ac").forEach(btn=>{
            btn.addEventListener('dblclick',e => { 
                this.toogleAudio();
            });
        });
    }

    toogleAudio(){
        this._audioOnOff = !this._audioOnOff;
    }

    playAudio(){
        if(this._audioOnOff){
            this._audio.currentTime = 0;
            this._audio.play();
        }
    }

    initKeyboard() {
        document.addEventListener('keyup', e => {
            this.playAudio();
            switch (e.key) {
                case "Escape":
                    this.clearAll();
                    break;
                case "Backespace":
                    this.clearEntry();
                    break;
                case "%":
                case "/":
                case "*":
                case "-":
                case "+":
                    this.addOperation(e.key);
                    break;
                case ",":
                case ".":
                    this.addDot();
                    break;
                case "=":
                case "Enter":
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
                    this.addOperation(parseInt(e.key));
                    break;
                case 'c':
                    if (e.ctrlKey) {
                        this.copyToCliboard();
                    }
                    break;
            }
        });
    }

    copyToCliboard() {
        let input = document.createElement('input');
        input.value = this.displayCalc;
        document.body.appendChild(input);
        input.select();
        document.execCommand("Copy");
        input.remove();
    }

    pastFromClipboard(){
         document.addEventListener('paste',e=>{
            let text = e.clipboardData.getData('text');
            if(isNaN(text)){
                this.setError();
            }else{
                this.displayCalc = text;
            }
         });
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
        this._lastOperator = '';
        this._lastNumber = '';
        this.setLastNumberToDisplay();
    }

    clearEntry() {
        this._operation.pop();
        this.setLastNumberToDisplay();
    }

    getLastOperation() {
        return this._operation[this._operation.length - 1];
    }

    setLastOperation(value) {
        this._operation[this._operation.length - 1] = value;
    }

    isOperator(value) {
        return (['+', '-', '*', '/', '%', '.'].indexOf(value) > -1);
    }

    pushOperation(value) {
        this._operation.push(value);
        if (this._operation.length > 3) {
            this.calc();
        }
    }

    getResult() {
        try{
            return eval(this._operation.join(""));
        }catch(erro){
            setTimeout(()=>{
                this.setError();
            },1);
        }
    }

    calc() {
        let last = '';
        let result = '';
        this._lastOperator = this.getLastElement();

        if (this._operation.length < 3) {
            let firstNumber = this._operation[0];
            this._operation = [firstNumber, this._lastOperator, this._lastNumber];
        }

        if (this._operation.length > 3) {
            last = this._operation.pop();
            this._lastNumber = this.getResult();
        } else if (this._operation.length == 3) {
            this._lastNumber = this.getLastElement(false);
        }

        if (last == "%") {
            result = this.percentageCalc();
        } else {
            result = this.getResult();
        }

        this._operation = [result];

        if (last != '') {
            this._operation.push(last);
        }

        this.setLastNumberToDisplay();
    }
    percentageCalc() {
        let operator = this.getLastElement();
        let result = '';
        if (operator == "*") {
            result = this.getResult();
            result /= 100;
        } else {
            try{
                result = eval(`${this._operation[0]}${operator}(${this._operation[0]} / 100 * ${this._operation[2]})`);
            }catch(erro){
                setTimeout(()=>{
                    this.setError();
                },1);
            }
        }

        return result;
    }

    getLastElement(isOperator = true) {
        let lastElement = '';

        for (let i = this._operation.length - 1; i >= 0; i--) {
            if (this.isOperator(this._operation[i]) == isOperator) {
                lastElement = this._operation[i];
                break;
            }
        }

        if (lastElement === '') {
            lastElement = (isOperator) ? this._lastOperator : this._lastNumber;
        }

        return lastElement;
    }

    setLastNumberToDisplay() {
        let lastNumber = this.getLastElement(false);
        this.displayCalc = lastNumber ? lastNumber : 0;
    }

    addOperation(value) {
        if (isNaN(this.getLastOperation())) {
            if (this.isOperator(value)) {
                this.setLastOperation(value);
            } else {
                this.pushOperation(value);
                this.setLastNumberToDisplay();
            }
        } else {
            if (this.isOperator(value)) {
                this.pushOperation(value);
            } else {
                let newValue = this.getLastOperation().toString() + value.toString();
                this.setLastOperation(newValue);
                this.setLastNumberToDisplay();
            }
        }
    }

    addDot() {
        let lastElement = this.getLastOperation();

        if (typeof lastElement === 'string' && lastElement.split('').indexOf('.') > -1) return;

        if (this.isOperator(lastElement) || !lastElement) {
            this.pushOperation("0.");
        } else {
            this.setLastOperation(lastElement.toString() + '.');
        }
        this.setLastNumberToDisplay();
    }

    setError() {
        this.clearAll();
        this.displayCalc = "Error";
    }

    execBtn(value) {
        this.playAudio();
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
                this.addDot();
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
                this.addOperation(value);
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

        if(value.toString().length > 10){
            this.setError();
            return;
        }
        this._displayCalcEl.innerHTML = value;
    }

    get currentDate() {
        return new Date();
    }

    set currentDate(value) {
        this._currentDate = value;
    }
}