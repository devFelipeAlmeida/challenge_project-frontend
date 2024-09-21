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
            const response = await fetch(`${BASE_API}`, requestOptions)
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

export const getActiveAndUpcomingChallenges = async (jwtToken) => {   
    const requestOptions = {
        method: 'GET',
        headers: {
            'Content-Type' : 'application/json',
            'Authorization' : jwtToken
        }
    }     
        try {
            const response = await fetch(`${BASE_API}/active_and_upcoming`, requestOptions)
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
            const response = await fetch(`${BASE_API}/${id}`, requestOptions)
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

export const getChallenges = async (jwtToken) => {
    const requestOptions = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': jwtToken // Adiciona Bearer se necessário
        }
    };
    try {
        const response = await fetch(`${BASE_API}`, requestOptions); // Adiciona '/challenges'
        if (response.ok) {
            return [await response.json(), null];
        }
        const errorMessage = await response.text();
        return [null, `Server side error: ${errorMessage}`];
    } catch (error) {
        return [null, `Server down: ${error}`];
    }
};
  
  // Função para deletar um desafio
  export const deleteChallenge = async (jwtToken, challengeId) => {
    const requestOptions = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: jwtToken,
      },
    };
  
    try {
      const response = await fetch(`${BASE_API}/${challengeId}`, requestOptions);
      if (response.ok) {
        return [response, ""];
      }
      if (response.status === 401) {
        return ["", "Unauthorised user. Cannot delete challenge."];
      }
      const errorMessage = await response.text();
      return ["", `Server side error: ${errorMessage}`];
    } catch (error) {
      return ["", `Server down: ${error}`];
    }
  };

  export const updateChallenge = async (jwtToken, id, bodyObject) => {   
    const requestOptions = {
        method: 'PUT',
        headers: {
            'Content-Type' : 'application/json',
            'Authorization' : jwtToken
        },
        body: JSON.stringify(bodyObject)
    }     
        try {
            const response = await fetch(`${BASE_API}/${id}`, requestOptions)
            if (response.ok) {
                return [response, '']
            }
            if(response.status === 401) {
                return ['', 'Unauthorised user. Cannot update challenge.']
            }
              const errorMessage = await response.text()
              return ['', `Server side error: ${errorMessage}`]
        } catch (error) {
            return ['', `Server down: ${error}`]
        }
}

export const markChallengeAsCompleted = async (challengeId, jwtToken) => {
  try {
    const response = await fetch(`${BASE_API}/${challengeId}/mark_as_completed`, {
      method: "PATCH",
      headers: {
        "Content-Type" : "application/json",
        "Authorization" : jwtToken,
      },
    });

    if (!response.ok) throw new Error("Failed to mark challenge as completed.");
    return [response, null];
  } catch (error) {
    return [null, error.message];
  }
};

// Função para obter desafios concluídos (somente para admin)
export const getCompletedChallenges = async (jwtToken) => {
  try {
    const response = await fetch(`${BASE_API}/completed_challenges`, {
      method: "GET",
      headers: {
        "Content-Type" : "application/json",
        "Authorization" : jwtToken,
      },
    });

    if (!response.ok) throw new Error("Failed to fetch completed challenges.");
    return [response, null];
  } catch (error) {
    return [null, error.message];
  }
};

export const fetchComments = async (jwtToken, challengeId) => {
  try {
    const response = await fetch(`${BASE_API}/${challengeId}/comments`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': jwtToken // Adicione o token JWT ao cabeçalho
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Error fetching comments');
    }
    return [data, null];
  } catch (error) {
    return [null, error.message];
  }
};

export const addComment = async (jwtToken, challengeId, commentContent) => {
  const requestOptions = {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': jwtToken
      },
      body: JSON.stringify({ content: commentContent  })
  }
  try {
      const response = await fetch(`${BASE_API}/${challengeId}/comments`, requestOptions)
      if (response.ok) {
          return [await response.json(), '']
      }
      if (response.status === 401) {
          return ['', 'Unauthorized user. Cannot add comment.']
      }
      const errorMessage = await response.text()
      return ['', `Server side error: ${errorMessage}`]
  } catch (error) {
      return ['', `Server down: ${error}`]
  }
}

export const approveChallenge = async (jwt, challengeId) => {
  try {
    const response = await fetch(`${BASE_API}/${challengeId}/approve`, {
      method: "DELETE",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': jwt
      }
    });
    if (!response.ok) throw new Error("Failed to approve challenge");
    return [await response.json(), null];
  } catch (error) {
    return [null, error.message];
  }
};

export const rejectChallenge = async (challengeId, jwtToken ) => {
  try {
    const response = await fetch(`${BASE_API}/${challengeId}/reject`, {
      method: "PATCH",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': jwtToken
      }
    });
    if (!response.ok) throw new Error("Failed to reject challenge");
    return [await response.json(), null];
  } catch (error) {
    return [null, error.message];
  }
};