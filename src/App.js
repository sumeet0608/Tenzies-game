import React,{useState,useEffect} from 'react';
import Die from './components/Die';
import {nanoid} from "nanoid";
import Confetti from "react-confetti";

export default function App(){
    
    const [dice,setDice]=useState(allNewDice());
    const [tenzies, setTenzies]= useState(false);

    const [score,setScore]=useState(0);

    const [bestScore, setBestScore]=useState(
        () => Number(localStorage.getItem("bestScore")) || 0
    );

    useEffect(()=>{
        const allHeld = dice.every(die=>die.isHeld);
        const firstValue = dice[0].value;
        const allValues = dice.every(die=>die.value === firstValue);
        if(allHeld && allValues){
            setTenzies(true);
            if(bestScore ===0 ||score < bestScore){
                setBestScore(score);    
            }
        }
    },[dice,bestScore,score]);

    React.useEffect(() => {
        localStorage.setItem("bestScore", bestScore.toString());
    }, [bestScore]);

    function generateNewDie(){
        return {value : Math.ceil(Math.random()*6), isHeld : false, id : nanoid()}
    }

    function allNewDice(){
        const newDice = [];
        for(let i=0;i < 10 ;i++){
            newDice.push(generateNewDie());
        }
        return newDice;
    }

    

    function rollDice(){
        if(!tenzies){
            setDice(oldDice => oldDice.map(die => {
                return die.isHeld ? die : generateNewDie();
            }));
            setScore(oldScore => oldScore + 1);
        }else{
            setTenzies(false);
            setDice(allNewDice());
            
            setScore(0);
        }
    }

    function holdDice(id){
        setDice(oldDice => oldDice.map(die => {
            return(die.id === id ? {...die, isHeld : !die.isHeld} : die)
        }));
    }

    const diceElements = dice.map(die => <Die key={die.id} value={die.value} isHeld = {die.isHeld} holdDice = {()=>holdDice(die.id)} />)

    return(
        <main>
            {tenzies && <Confetti />}
            <h1 className="title">Tenzies</h1>
            <p className="instructions">Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
            <div className="dice-container">
                {diceElements}
            </div>
            <button 
                className="roll-dice" onClick={rollDice}>
                {tenzies ? "New Game" : "Roll"}
            </button>
            {tenzies && <h4 className='score'>You took {score} rolls to complete.</h4>}
            {tenzies && <h4 className='best-score'>Your best score is {bestScore}.</h4>}
        </main>
    )
}
