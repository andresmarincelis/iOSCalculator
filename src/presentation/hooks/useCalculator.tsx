/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from 'react';

enum Operator {
    add = '+',
    substract = '-',
    multiply = 'x',
    divide = '÷',
}

export const useCalculator = () => {

    const [formula, setFormula] = useState('');

    const [number, setNumber] = useState('0'); //es string para que no se vaya sumando si no es lo que queremos
    const [prevNumber, setPrevNumber] = useState('0');

    const lastOperation = useRef<Operator>();

    useEffect(() => {
        if (lastOperation.current) {
            const firstFormulaPart = formula.split(' ').at(0); //tomar la primera posicion
            setFormula(`${firstFormulaPart} ${lastOperation.current} ${number}`);
        } else {
            setFormula(number);
        }

    }, [number]);

    useEffect(() => {
        const subResult = calculateSubResult();
        setPrevNumber(`${subResult}`);
    }, [formula]);


    const clean = () => {
        setNumber('0'); //borrar el numero principal
        setPrevNumber('0'); //borrar el subnumero antes del result
        lastOperation.current = undefined; //sacar la operacion utilizada
        setFormula('');

    };

    const deleteOperation = () => {

        let currentSign = '';
        let temporalNumber = number;

        if (number.includes('-')) {
            currentSign = '-';
            temporalNumber = number.substring(1); //esto es para que se saque el sign negativo
        }
        if (temporalNumber.length > 1) { //si tiene mas de 1 caracter el numero, se borra el ultimo
            return setNumber(currentSign + temporalNumber.slice(0, -1)); //el currentsign es para concatenar si esta negativo
        }
        setNumber('0'); //cuando borrar el ultimo numero, vuelve a 0, sea negativo o no.
    };

    const toggleSign = () => {
        if (number.includes('-')) {
            return setNumber(number.replace('-', ''));
        }

        setNumber('-' + number);
    };

    const buildNumber = (numberString: string) => {

        //este es para que no se pueda poner mas de un punto
        if (number.includes('.') && numberString === '.') return;
        //este es para que no se pueda partir con un punto
        if (number.startsWith('0') || number.startsWith('-0')) {
            if (numberString === '.') {
                return setNumber(number + numberString);
            }
            //esto es para evaluar si es otro cero y no hay punto
            if (numberString === '0' && number.includes('.')) {
                return setNumber(number + numberString);
            }
            //ver si es diferente de cero, si hay punto y si es el primer numero
            if (numberString !== '0' && !number.includes('.')) {
                return setNumber(numberString);
            }
            //esto es para evitar el 0000.00
            if (numberString === '0' && !number.includes('.')) {
                return;
            }
            return setNumber(number + numberString);
        }
        setNumber(number + numberString);
    };

    const setLastNumber = () => { //esto es para no poder sumar 0. con algo
        calculateResult();
        if (number.endsWith('.')) {
            setPrevNumber(number.slice(0, -1));
        } else {
            setPrevNumber(number);
        }
        setNumber('0');
    };

    const divideOperation = () => {
        setLastNumber();
        lastOperation.current = Operator.divide;
    };

    const multiplyOperation = () => {
        setLastNumber();
        lastOperation.current = Operator.multiply;
    };

    const substractOperation = () => {
        setLastNumber();
        lastOperation.current = Operator.substract;
    };

    const addOperation = () => {
        setLastNumber();
        lastOperation.current = Operator.add;
    };

    const calculateResult = () => {
        const result = calculateSubResult();
        setFormula(`${result}`);

        lastOperation.current = undefined;
        setPrevNumber('0');
    };

    const calculateSubResult = () => {

        const [firstValue, operation, secondValue] = formula.split(' ');

        const num1 = Number(firstValue);
        const num2 = Number(secondValue);

        if (isNaN(num2)) { return num1 };

        switch (operation) {

            case Operator.add:
                return num1 + num2;
            case Operator.substract:
                return num1 - num2;
            case Operator.multiply:
                return num1 * num2;
            case Operator.divide:
                return num1 / num2;

            default:
                throw new Error('Error');
        }

    }

    return {
        //Properties
        number,
        prevNumber,
        formula,
        //Methods
        buildNumber,
        clean,
        deleteOperation,
        toggleSign,
        divideOperation,
        multiplyOperation,
        substractOperation,
        addOperation,
        calculateResult,
    };
};
