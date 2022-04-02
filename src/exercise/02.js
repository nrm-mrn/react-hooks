// useEffect: persistent state
// http://localhost:3000/isolated/exercise/02.js

import React from 'react'

function Greeting({ initialName = '' }) {
  // 🐨 initialize the state to the value from localStorage
  // 💰 window.localStorage.getItem('name') || initialName
  //const [name, setName] = React.useState(initialName || window.localStorage.getItem('name'))

  //Extra 1: lazy init

  const useLocalStorageHook = (storageName, initialName = '') => {

    const [stateVar, setStateVar] = React.useState(() => {
      console.log('reading state')
      return JSON.parse(window.localStorage.getItem(storageName)) || initialName
    })

    React.useEffect(() => {
      window.localStorage.setItem(storageName, JSON.stringify(stateVar))
    }, [stateVar, storageName])

    return [stateVar, setStateVar]
  }

  const [name, setName] = useLocalStorageHook('nameField', initialName)

  // 🐨 Here's where you'll use `React.useEffect`.
  // The callback should set the `name` in localStorage.
  // 💰 window.localStorage.setItem('name', name)

  function handleChange(event) {
    setName(event.target.value)
  }
  return (
    <div>
      <form>
        <label htmlFor="name">Name: </label>
        <input value={name} onChange={handleChange} id="name" />
      </form>
      {name ? <strong>Hello {name}</strong> : 'Please type your name'}
    </div>
  )
}

function App() {
  return <Greeting />
}

export default App