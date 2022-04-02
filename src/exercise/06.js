// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
// 🐨 you'll want the following additional things from '../pokemon':
// fetchPokemon: the function we call to get the pokemon info
// PokemonInfoFallback: the thing we show while we're loading the pokemon info
// PokemonDataView: the stuff we use to display the pokemon info
import {
  PokemonForm,
  fetchPokemon,
  PokemonInfoFallback,
  PokemonDataView
} from '../pokemon'
import { ErrorBoundary } from 'react-error-boundary'

// class ErrorBoundary extends React.Component {
//   state = { error: null }
//   static getDerivedStateFromError(error) {
//     return { error }
//   }


//   render() {
//     const { error } = this.state
//     if (error) {
//       return <this.props.FallbackComponent error={error} />
//     }
//     return this.props.children
//   }
// }

const ErrorFallback = ({ error, resetErrorBoundary }) => {
  return <div role='alert'>
    There was an error: {' '}
    <pre style={{ whiteSpace: 'normal' }}>{error.message}</pre>
    <button onClick={resetErrorBoundary}>Try again</button>
  </div>
}

function PokemonInfo({ pokemonName }) {
  // 🐨 Have state for the pokemon (null)
  // const [pokemon, setPokemon] = React.useState(null)
  // const [error, setError] = React.useState(null)
  // const [status, setStatus] = React.useState('idle')
  const [state, setState] = React.useState(
    {
      pokemon: null,
      error: null,
      status: pokemonName ? 'pending' : 'idle',
    })
  // 🐨 use React.useEffect where the callback should be called whenever the
  // pokemon name changes.
  // 💰 DON'T FORGET THE DEPENDENCIES ARRAY!
  // 💰 if the pokemonName is falsy (an empty string) then don't bother making the request (exit early).
  // 🐨 before calling `fetchPokemon`, clear the current pokemon state by setting it to null
  // 💰 Use the `fetchPokemon` function to fetch a pokemon by its name:
  //   fetchPokemon('Pikachu').then(
  //     pokemonData => { /* update all the state here */},
  //   )
  React.useEffect(() => {
    if (pokemonName === '') {
      return
    }
    // setPokemon(null)
    // setError(null)
    // setStatus('pending')
    setState({ pokemon: null, error: null, status: 'pending' })

    fetchPokemon(pokemonName).then(
      pokemonData => {
        // setPokemon(pokemonData)
        // setStatus('resolved')
        setState({ pokemon: pokemonData, status: 'resolved' })
      }, error => {
        // setError(error)
        // setStatus('rejected')
        setState({ error: error, status: 'rejected' })
      })
  }, [pokemonName])
  // 🐨 return the following things based on the `pokemon` state and `pokemonName` prop:
  //   1. no pokemonName: 'Submit a pokemon'
  //   2. pokemonName but no pokemon: <PokemonInfoFallback name={pokemonName} />
  //   3. pokemon: <PokemonDataView pokemon={pokemon} />
  switch (state.status) {
    case 'idle':
      return 'Submit a pokemon'
    case 'pending':
      return <PokemonInfoFallback name={pokemonName} />
    case 'rejected':
      throw state.error
    case 'resolved':
      return <PokemonDataView pokemon={state.pokemon} />
    default:
      break
  }
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  const inputRef = React.useRef()

  return (
    <div className="pokemon-info-app">
      <PokemonForm inputRef={inputRef} pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <ErrorBoundary
          resetKeys={[pokemonName]}
          FallbackComponent={ErrorFallback}
          onReset={() => {
            setPokemonName('')
            inputRef.current.focus()
          }
          }>
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default App
