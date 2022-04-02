// useState: tic tac toe
// http://localhost:3000/isolated/exercise/04.js

import * as React from 'react'
import { useLocalStorageState } from '../utils'

function Board({ onClick, currentSquares }) {
  // 🐨 currentSquares is the state for this component. Add useState for currentSquares

  // const useLocalStorage = () => {
  //   const [currentSquares, setSquares] = React.useState(
  //     () => JSON.parse(window.localStorage.getItem('savedGame')) || Array(9).fill(null)
  //     )

  //     React.useEffect(
  //       () => window.localStorage.setItem('savedGame', JSON.stringify(currentSquares)), [currentSquares]
  //       )

  //       return [currentSquares, setSquares]
  //     }

  // const [currentSquares, setSquares] = useLocalStorageState('savegame')
  // 🐨 We'll need the following bits of derived state:
  // - nextValue ('X' or 'O')
  // - winner ('X', 'O', or null)
  // - status (`Winner: ${winner}`, `Scratch: Cat's game`, or `Next player: ${nextValue}`)
  // 💰 I've written the calculations for you! So you can use my utilities
  // below to create these variables

  // This is the function your square click handler will call. `square` should
  // be an index. So if they click the center square, this will be `4`.


  function renderSquare(i) {
    return (
      <button className="square" onClick={() => onClick(i)}>
        {currentSquares[i]}
      </button>
    )
  }

  return (
    <div>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
    </div>
  )
}

const Move = ({ history, setCurrentSquares, currentState }) => {
  const buttons = history.map((value, index, array) => {
    const disabled = index + 1 === currentState
    return (
      <li key={index}>
        <button onClick={() => setCurrentSquares(array[index])} disabled={disabled}>
          Go to {index === 0 ? 'start of the game' : `move #${index}`}
          {disabled ? '(current move)' : ''}
        </button>
      </li>
    )
  })
  return <>{buttons}</>
}


function Game() {

  const [currentSquares, setCurrentSquares] = React.useState(Array(9).fill(null))
  const [history, setHistory] = React.useState([Array(9).fill(null)])

  const nextValue = calculateNextValue(currentSquares)
  const winner = calculateWinner(currentSquares)
  const status = calculateStatus(winner, currentSquares, nextValue)
  const currentMove = currentSquares.filter((value) => value === 'O' || value === 'X').length + 1

  function selectSquare(square) {
    if (currentSquares[square] || winner) {
      return null
    }
    const squaresCopy = [...currentSquares]
    const historyCopy = history.slice([0], [currentMove])
    squaresCopy[square] = nextValue
    historyCopy.push(squaresCopy)
    setHistory(historyCopy)
    setCurrentSquares(squaresCopy)


  }

  function restart() {
    // 🐨 reset the currentSquares
    // 💰 `Array(9).fill(null)` will do it!
    setCurrentSquares(Array(9).fill(null))
    setHistory([Array(9).fill(null)])
  }
  return (
    <div className="game">
      <div className="game-board">
        <Board onClick={selectSquare} currentSquares={currentSquares} />
        <button className='restart' onClick={restart}>
          restart
        </button>
      </div>
      <div className='game-info'>
        <div>{status}</div>
        <Move history={history} setCurrentSquares={setCurrentSquares} currentState={currentMove} />
      </div>
    </div>
  )
}

// eslint-disable-next-line no-unused-vars
function calculateStatus(winner, currentSquares, nextValue) {
  return winner
    ? `Winner: ${winner}`
    : currentSquares.every(Boolean)
      ? `Scratch: Cat's game`
      : `Next player: ${nextValue}`
}

// eslint-disable-next-line no-unused-vars
function calculateNextValue(currentSquares) {
  const xSquaresCount = currentSquares.filter(r => r === 'X').length
  const oSquaresCount = currentSquares.filter(r => r === 'O').length
  return oSquaresCount === xSquaresCount ? 'X' : 'O'
}

// eslint-disable-next-line no-unused-vars
function calculateWinner(currentSquares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (currentSquares[a] && currentSquares[a] === currentSquares[b] && currentSquares[a] === currentSquares[c]) {
      return currentSquares[a]
    }
  }
  return null
}

function App() {
  return <Game />
}

export default App