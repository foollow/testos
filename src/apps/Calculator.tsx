import React, { useState } from 'react';

const Calculator: React.FC = () => {
    const [display, setDisplay] = useState('0');
    const [prevValue, setPrevValue] = useState<number | null>(null);
    const [operator, setOperator] = useState<string | null>(null);
    const [waitingForOperand, setWaitingForOperand] = useState(false);

    const inputDigit = (digit: number) => {
        if (waitingForOperand) {
            setDisplay(String(digit));
            setWaitingForOperand(false);
        } else {
            setDisplay(display === '0' ? String(digit) : display + digit);
        }
    };

    const performOperation = (nextOperator: string) => {
        const inputValue = parseFloat(display);

        if (prevValue === null) {
            setPrevValue(inputValue);
        } else if (operator) {
            const currentValue = prevValue || 0;
            const newValue = calculate(currentValue, inputValue, operator);
            setPrevValue(newValue);
            setDisplay(String(newValue));
        }

        setWaitingForOperand(true);
        setOperator(nextOperator);
    };

    const calculate = (prev: number, next: number, op: string) => {
        switch (op) {
            case '+': return prev + next;
            case '-': return prev - next;
            case '*': return prev * next;
            case '/': return prev / next;
            default: return next;
        }
    };

    const clear = () => {
        setDisplay('0');
        setPrevValue(null);
        setOperator(null);
        setWaitingForOperand(false);
    };

    const btnClass = "h-12 rounded-full font-medium text-lg transition-all active:scale-95 flex items-center justify-center select-none";
    const grayBtn = `${btnClass} bg-gray-300 dark:bg-gray-600 text-black dark:text-white hover:bg-gray-400 dark:hover:bg-gray-500`;
    const orangeBtn = `${btnClass} bg-orange-500 hover:bg-orange-400 text-white`;
    const darkBtn = `${btnClass} bg-gray-200 dark:bg-[#333333] text-black dark:text-white hover:bg-gray-300 dark:hover:bg-[#4d4d4d]`;

    return (
        <div
            className="h-full w-full p-4 flex flex-col gap-4 transition-colors duration-300"
            style={{ backgroundColor: 'var(--bg-content)' }}
        >
            <div className="flex-1 flex items-end justify-end px-2">
                <span className="text-5xl font-light transition-colors duration-300" style={{ color: 'var(--text-primary)' }}>{display}</span>
            </div>

            <div className="grid grid-cols-4 gap-3">
                <button onClick={clear} className={grayBtn}>AC</button>
                <button onClick={() => setDisplay(String(parseFloat(display) * -1))} className={grayBtn}>+/-</button>
                <button onClick={() => setDisplay(String(parseFloat(display) / 100))} className={grayBtn}>%</button>
                <button onClick={() => performOperation('/')} className={orangeBtn}>÷</button>

                {[7, 8, 9].map(n => <button key={n} onClick={() => inputDigit(n)} className={darkBtn}>{n}</button>)}
                <button onClick={() => performOperation('*')} className={orangeBtn}>×</button>

                {[4, 5, 6].map(n => <button key={n} onClick={() => inputDigit(n)} className={darkBtn}>{n}</button>)}
                <button onClick={() => performOperation('-')} className={orangeBtn}>-</button>

                {[1, 2, 3].map(n => <button key={n} onClick={() => inputDigit(n)} className={darkBtn}>{n}</button>)}
                <button onClick={() => performOperation('+')} className={orangeBtn}>+</button>

                <button onClick={() => inputDigit(0)} className={`${darkBtn} col-span-2 w-auto rounded-full`}>0</button>
                <button onClick={() => !display.includes('.') && setDisplay(display + '.')} className={darkBtn}>.</button>
                <button onClick={() => performOperation('=')} className={orangeBtn}>=</button>
            </div>
        </div>
    );
};

export default Calculator;
