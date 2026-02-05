import axios from 'axios'
const baseUrl = '/api/persons'

const getPersons = () => {
    return axios.get(baseUrl).then(response => response.data)
}

const createPerson = (newPerson) => {
    return axios.post(baseUrl, newPerson).then(response => response.data)
}

const deletePerson = (id) => {
    return axios.delete(`${baseUrl}/${id}`).then(response => response.data)
}

const updateNumber = (id, newObject) => {
    return axios.put(`${baseUrl}/${id}`, newObject).then(response => response.data)
}

export default {
    getPersons: getPersons,
    createPerson: createPerson,
    deletePerson: deletePerson,
    updateNumber: updateNumber
}