import { useState, useEffect } from 'react'
import personService from './services/persons'
import { Notification, ErrorNotification } from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([])

  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterText, setFilterText] = useState('')
  const [notification, setNotification] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    personService
      .getPersons()
      .then(allPersons => {
        setPersons(allPersons)
      })
  }, [])

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setFilterText(event.target.value)
  }

  const notify = (note) => {
    setNotification(note)
    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  const notifyError = (error) => {
    setError(error)
    setTimeout(() => {
      setError(null)
    }, 5000)
  }

  const addPerson = (event) => {
    event.preventDefault()
    if (persons.some(person => person.name === newName && (person.number === newNumber || newNumber === ''))) {
      alert(`${newName} is already added to phonebook`)
    } else if (persons.some(person => person.name === newName)) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const personObject = {
          name: newName,
          number: newNumber
        }
        const id = persons.find(person => person.name === newName).id
        personService
          .updateNumber(id, personObject)
          .then(updated => {
            setPersons(persons.map(person => person.id === id ? updated : person))
            notify(`updated number of ${updated.name}`)
          })
          .catch(error => {
            notifyError(`Information of ${newName} has already been removed from server`)
            setPersons(persons.filter(person => person.id !== id))
          })

      }
    } else {
      const personObject = {
        name: newName,
        number: newNumber
      }
      personService
        .createPerson(personObject)
        .then(person => {
          setPersons(persons.concat(person))
          notify(`Added ${person.name} to the phonebook`)
        })
        .catch(error => {
          console.log(error.response.data)
          notifyError(error.response.data.error)
        })
      setNewName('')
      setNewNumber('')
    }
  }

  const removePerson = (name) => {
    if (window.confirm(`Delete ${name} ?`)) {
      const person = persons.find(person => person.name === name)
      const id = person.id

      personService
        .deletePerson(id)
        .then(removed => {
          setPersons(persons.filter(person => person.id !== id))
          notify(`removed ${person.name} from phonebook`)
        })

    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notification} />
      <ErrorNotification message={error} />

      <Filter text={filterText} handler={handleFilterChange} />

      <h3>add a new</h3>
      <PersonForm name={newName} nameHandler={handleNameChange} number={newNumber} numHandler={handleNumChange} submitHandler={addPerson} />

      <h3>Numbers</h3>
      <Persons persons={persons} filter={filterText} removePerson={removePerson} />

    </div>
  )

}

const Filter = (props) => {
  return <div>filter shown with<input value={props.text} onChange={props.handler} /></div>
}

const PersonForm = (props) => {
  return (
    <form onSubmit={props.submitHandler}>
      <div>name: <input value={props.name} onChange={props.nameHandler} /></div>
      <div>number: <input value={props.number} onChange={props.numHandler} /></div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

const Persons = (props) => {
  return (
    <div>
      {props.persons.filter(person => person.name.toLowerCase().includes(props.filter.toLowerCase())).map((person) => {
        return (
          <PersonLine key={person.name} name={person.name} number={person.number} removePerson={props.removePerson} />
        )
      })
      }
    </div>
  )
}

const PersonLine = (props) => {
  return <p>{props.name} {props.number} <Button onClick={() => props.removePerson(props.name)} text='delete' /></p>
}

const Button = (props) => {
  return <button type='button' onClick={props.onClick}>{props.text}</button>
}

export default App