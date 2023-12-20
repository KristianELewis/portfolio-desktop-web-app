
export class GeneralError extends Error {
    constructor(message)
    {
        super(message)
        this.name = "GeneralError"
    }
}

export class UnauthorizedError extends Error {
    constructor(message)
    {
        super(message)
        this.name = "UnauthorizedError"
    }
}

export class NotFoundError extends Error {
    constructor(message)
    {
        super(message)
        this.name = "NotFoundError"
    }
}

export class AuthError extends Error {
    constructor(message)
    {
        super(message)
        this.name = "AuthError"
    }
}

export class ServerSideError extends Error {
    constructor(message)
    {
        super(message)
        this.name = "ServerSideError"
    }
}

export class NoProfilePicture extends Error {
    //This is probably not a good way of dealing with this
    constructor(message)
    {
        super(message)
        this.name = "NoProfilePicture"
    }
}


export class UnknownError extends Error {
    constructor(message)
    {
        super(message)
        this.name = "UnknownError"
    }
}


export async function serverErrorDecider(res){
    //all status codes should come with a message

    //just incase one doesnt, this will asign a generic one
    //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    //pretty sure I can just set errMessage to the asyn function
    let errMessage = ""
    await res.json()
    .then(res => errMessage = res.message)
    .catch(err => {
        errMessage = "There was an issue processing your request"
    })
    if (res.status === 400)
    {
        throw new GeneralError(errMessage)
    }
    else if(res.status === 401)
    {
        throw new UnauthorizedError(errMessage)
    }
    else if (res.status === 403)
    {
        throw new AuthError(errMessage)
    }
    else if(res.status === 404)
    {
        throw new NotFoundError(errMessage)
    }
    else if (res.status === 418)
    {
        //not a good way of dealing with this, No profile picture error
        throw new NoProfilePicture(errMessage)
    }
    else if(res.status === 500)
    {
        throw new ServerSideError(errMessage)
    }
    else{
        throw new UnknownError(errMessage)

    }
}