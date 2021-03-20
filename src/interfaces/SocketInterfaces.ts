
export interface OnlineStatus { 
    token: string,
}

export interface SocketError{ 
    message: string,
    statusCode: number
}

export interface Chat { 
    message: string,
    token: string /* serves as sender */,
    room: string 
    user?: any,
}

