import { DOMAIN } from './config'

export const registerApi = async (bodyObject) => {   
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify(bodyObject)
    }     
        try {
            const response = await fetch(`${DOMAIN}/users`, requestOptions)
            if (response.ok) {
                return [response, '']
            }
            if(response.status === 422) {
                return ['', 'User already exists.']
            }
              const errorMessage = await response.text()
              return ['', `Server side error: ${errorMessage}`]
        } catch (error) {
            return ['', `Server down: ${error}`]
        }
}

export const loginApi = async (bodyObject) => {   
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify(bodyObject)
    }     
        try {
            const response = await fetch(`${DOMAIN}/users/sign_in`, requestOptions)
            if (response.ok) {
                return [response, '']
            }
            if(response.status === 401) {
                return ["", "Invalid email or password."]
            }
              const errorMessage = await response.text()
              return ['', `Server side error: ${errorMessage}`]
        } catch (error) {
            return ['', `Server down: ${error}`]
        }
}

export const logoutApi = async (jwtToken) => {   
    const requestOptions = {
        method: 'DELETE',
        headers: {
            'Content-Type' : 'application/json',
            'Authorization' : jwtToken
        },
    }     
        try {
            const response = await fetch(`${DOMAIN}/users/sign_out`, requestOptions)
            if (response.ok) {
                return [response, '']
            }
            if(response.status === 401) {
                return ["", "Invalid email or password."]
            }
              const errorMessage = await response.text()
              return ['', `Server side error: ${errorMessage}`]
        } catch (error) {
            return ['', `Server down: ${error}`]
        }
}

export const fetchUsers = async (jwtToken) => {
    const requestOptions = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': jwtToken // Utiliza o token JWT para autenticação
        }
    };

    try {
        const response = await fetch(`${DOMAIN}/api/v1/users`, requestOptions);
        if (response.ok) {
            const data = await response.json();
            return [data, '']; // Retorna a lista de usuários em caso de sucesso
        }

        const errorMessage = await response.text();
        return ['', `Server side error: ${errorMessage}`]; // Retorna a mensagem de erro caso não seja sucesso
    } catch (error) {
        return ['', `Server down: ${error}`]; // Retorna erro caso o servidor esteja inacessível
    }
};

export const fetchCurrentUser = async (jwtToken, id) => {
    const requestOptions = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': jwtToken // Adicionando 'Bearer' se necessário
        }
    };

    try {
        const response = await fetch(`${DOMAIN}/api/v1/users/${id}`, requestOptions); // Ajuste o endpoint se necessário
        if (response.ok) {
            const data = await response.json();
            return [data, '']; // Retorna os dados do usuário em caso de sucesso
        }

        const errorMessage = await response.text();
        return ['', `Server side error: ${errorMessage}`]; // Retorna a mensagem de erro caso não seja sucesso
    } catch (error) {
        return ['', `Server down: ${error}`]; // Retorna erro caso o servidor esteja inacessível
    }
};