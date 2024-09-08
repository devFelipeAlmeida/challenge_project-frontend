import { BASE_API } from './config'

export const addChallenge = async (jwtToken, bodyObject) => {   
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json',
            'Authorization' : jwtToken
        },
        body: JSON.stringify(bodyObject)
    }     
        try {
            const response = await fetch(`${BASE_API}/challenges`, requestOptions)
            if (response.ok) {
                return [response, '']
            }
            if(response.status === 401) {
                return ['', 'Unauthorised user. Cannot add challenge.']
            }
              const errorMessage = await response.text()
              return ['', `Server side error: ${errorMessage}`]
        } catch (error) {
            return ['', `Server down: ${error}`]
        }
}

export const getActiveAndUpcomingChallenges = async (jwtToken, bodyObject) => {   
    const requestOptions = {
        method: 'GET',
        headers: {
            'Content-Type' : 'application/json',
            'Authorization' : jwtToken
        }
    }     
        try {
            const response = await fetch(`${BASE_API}/challenges/active_and_upcoming`, requestOptions)
            if (response.ok) {
                return [response, '']
            }
            if(response.status === 401) {
                return ['', 'Unauthorised user. Cannot add challenge.']
            }
              const errorMessage = await response.text()
              return ['', `Server side error: ${errorMessage}`]
        } catch (error) {
            return ['', `Server down: ${error}`]
        }
}

export const getChallengesById = async (jwtToken, id) => {   
    const requestOptions = {
        method: 'GET',
        headers: {
            'Content-Type' : 'application/json',
            'Authorization' : jwtToken
        }
    }     
        try {
            const response = await fetch(`${BASE_API}/challenges/${id}`, requestOptions)
            if (response.ok) {
                return [response, '']
            }
            if(response.status === 401) {
                return ['', 'Unauthorised user. Cannot add challenge.']
            }
              const errorMessage = await response.text()
              return ['', `Server side error: ${errorMessage}`]
        } catch (error) {
            return ['', `Server down: ${error}`]
        }
}