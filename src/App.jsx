import React from "react"
import './App.css'
import Die from "./components/Die.jsx"
import Scoreboard from "./components/Scoreboard.jsx"
import {nanoid} from "nanoid"
import Confetti from "react-confetti"

export default function App() {
    // Create state to hold the array of numbers and game state
    const [dice, setDice] = React.useState(allNewDice())
    const [tenzies, setTenzies] = React.useState(false)

    // Create and initialize states to hold rolls stats and best time of the game
    const [rolls, setRolls] = React.useState(0)
    const [bestRolls, setBestRolls] = 
        React.useState(JSON.parse(localStorage.getItem("bestRolls")) || 0)
    const [bestTime, setBestTime] =
        React.useState(JSON.parse(localStorage.getItem("bestTime")) || 0)
    
    //  Sync two different states together with useEffect
    React.useEffect(() => {
        // Check if all dice are held
        const allHeld = dice.every(die => die.isHeld)
        // Check if every die's value has the same one as the first die in dice array
        const allSameValue = dice.every(die => die.value === dice[0].value)
        if (allHeld && allSameValue) {
            setTenzies(true)
            setStart(false)
            setRecords()
        }
    }, [dice])
    
    // Set bestRolls to localStorage for every item bestRolls changes
    React.useEffect(() => {
        localStorage.setItem("bestRolls", JSON.stringify(bestRolls))
    }, [bestRolls])
    
    // Set bestTime to localStorage for every item bestTime changes
    React.useEffect(() => {
        localStorage.setItem("bestTime", JSON.stringify(bestTime))
    }, [bestTime])
    
    function setRecords() {
        // Check if bestRolls doesn't exist or newest rolls are better than bestRolls
        // if so, reassign the variable
        if (!bestRolls || rolls < bestRolls) {
            setBestRolls(rolls)
        }
        
        const timeFloored = Math.floor(time / 10)
        // Check if bestTime doesn't exist or newest time is lower than bestTime
        // if so, reassign the variable
        if (!bestTime || timeFloored < bestTime) {
            setBestTime(timeFloored)
        }
    }

    function generateNewDie() {
        return {
            value: Math.ceil(Math.random() * 6),
            isHeld: false,
            id: nanoid()
        }
    }
    
    function allNewDice() {
        // newDice is an array of objects
        const newDice = []
        for (let i = 0; i < 10; i++) {
            newDice.push(generateNewDie())
        }
        return newDice
    }
    
    function holdDice(id) {
        // Update dice state using old one
        setDice(oldDice => oldDice.map(die => {
            // Update the object in the array and flip the `isHeld` prop,
            // if it is the same die with the `id` prop passed into the function,
            // else return the same die
            return die.id === id ? 
                {...die, isHeld: !die.isHeld} :
                die
        }))
    }
    
    // Map over the state numbers array to generate the array
    // of Die elements and render those in the App component
    const diceElements = dice.map(die => (
        // Pass `holdDice` function down to each instance of the Die component
        // with a callback function with `die.id` as parameter
        <Die 
            key={die.id} 
            value={die.value} 
            isHeld={die.isHeld} 
            holdDice={() => holdDice(die.id)}
        />
    ))
    
    // Clicking the button should generate a new array of dies
    // and set the `dice` state to the new array
    // (thus re-rendering the array to the page)
    function rollDice() {
        if(!tenzies) {
            setDice(oldDice => oldDice.map(die => {
                return die.isHeld ? 
                    die :
                    generateNewDie()
            }))
            updateRolls()
        } else {
            // Reset the game if user won and click on button
            resetGame()
        }
    }
    
    // Increase rolls counter to update previous state
    function updateRolls() {
        return setRolls((oldRolls) => oldRolls + 1)
    }
    
    function resetGame() {
        setTenzies(false);
        setDice(allNewDice());
        setRolls(0);
        setStart(true);
        setTime(0);
    }
    
    // Timer
    const [time, setTime] = React.useState(0)
    const [start, setStart] = React.useState(true)
    
    React.useEffect(() => {
        let interval = null
        if (start) {
            interval = setInterval(() => {
                setTime((prevTime) => prevTime + 10)
            }, 10)
        } else {
            clearInterval(interval)
        }
        return () => clearInterval(interval)
    }, [start])
    
    return (
        <>
            {/* Render Confetti component if `tenzies` is true*/}
            {tenzies && <Confetti />}
            <main>
                <h1 className="title">Tenzies</h1>
                {!tenzies && (
                    <p className="instructions">
                        Roll until all dice are the same.
                        <br />Click each die to freeze it
                        <br />at its current value between rolls.
                    </p>
                )}
                {tenzies && <p className="winner">Congratulations. You Won!</p>}
                
                <div className="stats-container">
                    <p>Rolls: {rolls}</p>
                    <p>
                    {/* Divide the time by 10 because it is the value of a millisecond
                    then modulo 1000. Append it to a zero so that when the time starts
                    it will display zero instead of a single digit.
                    
                    Slice and pass in a parameter of -2, when the number 
                    becomes two digits, the zero will be removed. */}
                    Timer: {("0" + Math.floor((time / 1000) % 60)).slice(-2)}:
                    {("0" + ((time / 10) % 1000)).slice(-2)}
                    </p>
                </div>
                
                <div className="dice-container">{diceElements}</div>
                
                <button 
                    className="roll-dice" 
                    onClick={rollDice}
                >
                    {tenzies ? "New Game" : "Roll"}
                </button>
                
                <Scoreboard bestRolls={bestRolls} bestTime={bestTime} />
            </main>
        </>
    )
}