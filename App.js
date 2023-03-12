import './style.css';
import React from "react"
import Die from "./Die"
import {nanoid} from "nanoid"
import Confetti from "react-confetti"
import Toggler from "./toggler.js"

export default function App() {
    const [darkMode, setDarkMode] = React.useState(true)
    const [dice, setDice] = React.useState(allNewDice())
    const [tenzies, setTenzies] = React.useState(false)
    const [rollCount, setRollCount] = React.useState(0)
    const [bestRollCount, setBestRollCount] = React.useState(
      localStorage.getItem("bestRollCount") || Infinity
    );

    function toggleDarkMode() {
      setDarkMode(prevMode => !prevMode)
  }

    React.useEffect(() => {
        const allHeld = dice.every(die => die.isHeld)
        const firstValue = dice[0].value
        const allSameValue = dice.every(die => die.value === firstValue)
        if (allHeld && allSameValue) {
            setTenzies(true)
        }
        const storedBestRollCount = localStorage.getItem("bestRollCount");
          if (storedBestRollCount) {
            setBestRollCount(Number(storedBestRollCount));
        }
    }, [dice])

    function generateNewDie() {
        return {
            value: Math.ceil(Math.random() * 6),
            isHeld: false,
            id: nanoid()
        }
    }
    
    function allNewDice() {
        const newDice = []
        for (let i = 0; i < 10; i++) {
            newDice.push(generateNewDie())
        }
        return newDice
    }
    
    function rollDice() {
        if(!tenzies) {
            setDice(oldDice => oldDice.map(die => {
                return die.isHeld ? 
                    die :
                    generateNewDie()
            }))
            setRollCount(prevCount => prevCount + 1)
        } else {
            setTenzies(false)
            setDice(allNewDice())
            setRollCount(0)
            if (rollCount < bestRollCount) {
              setBestRollCount(rollCount);
              localStorage.setItem("bestRollCount", rollCount);
            }
        }
    }
    
    function holdDice(id) {
        setDice(oldDice => oldDice.map(die => {
            return die.id === id ? 
                {...die, isHeld: !die.isHeld} :
                die
        }))
    }
    
    const diceElements = dice.map(die => (
        <Die 
            key={die.id} 
            value={die.value} 
            isHeld={die.isHeld} 
            holdDice={() => holdDice(die.id)}
        />
    ))
    
    return (
        <main darkMode={darkMode} className={darkMode ? "dark": ""}>
            {tenzies && <Confetti />}
            <div className="header">
              <h1 className={darkMode ? "title-dark": "title"}>Tenzies</h1>
              <Toggler toggleDarkMode={toggleDarkMode} />
            </div>
            <p className={darkMode ? "instructions-dark": "instructions"}>Roll until all dice are the same. 
            Click each die to freeze it at its current value between rolls.</p>
            <div className="count-container" >
              <p className={darkMode ? "roll-count-dark": "roll-count"}>Roll count: {rollCount}</p>
              <p className={darkMode ? "best-count-dark": "best-count"}>Best: {bestRollCount}</p>
            </div>
            <div className="dice-container">
                {diceElements}
            </div>
            <button 
                className="roll-dice" 
                onClick={rollDice}
            >
                {tenzies ? "New Game" : "Roll"}
            </button>
        </main>
    )
}
