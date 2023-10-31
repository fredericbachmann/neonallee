export function checkInput(
    type: 'name' | 'city' | 'email' | 'username' | 'artistname' | 'about',
    value: string
) {
    switch (type) {
        case 'name':
            return checkName(value)
        case 'city':
            return checkCity(value)
        case 'email':
            return checkEmail(value)
        case 'username':
            return checkUsername(value)
        case 'artistname':
            return checkName(value)
        case 'about':
            return { valid: true }
    }
}


function checkUsername(value: string) {
    if (value.length > 15) return {
        valid: false,
        message: 'Maximal 15 Zeichen'
    }
    else if (!value.match('^[a-z0-9]*$')) return {
        valid: false,
        message: 'Nur Kleinbuchstaben und Ziffern sind erlaubt!'
    }
    else return {
        valid: true
    }

}

function checkName(value: string) {
    if (value.length > 30) return {
        valid: false,
        message: 'Maximal 30 Zeichen'
    }
    else if (!value.match('^[a-zA-Z ]*$')) return {
        valid: false,
        message: 'Es sind nur Buchstaben und Leerzeichen erlaubt'
    }
    else return {
        valid: true
    }
}

function checkEmail(value: string) {
    if (!value.match('^[A-Z0-9+_.-]+@[A-Z0-9.-]+$')) return {
        valid: false,
        message: 'Bitte eine gültige Email-Addresse angeben.'
    }
    else return {
        valid: true
    }
}

function checkCity(value: string) {
    if (value.length > 30) return {
        valid: false,
        message: 'Maximal 30 Zeichen'
    }
    else if (!value.match('^[a-zA-Z]*$')) return {
        valid: false,
        message: 'Nur Buchstaben erlaubt.'
    }
    else return {
        valid: true
    }
}
