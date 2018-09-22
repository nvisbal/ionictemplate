
/**
 * Interface para el registro del usuario
 */
export interface IUserSesion{
    email:string,
    uid:string
}

export interface IUser{
    uid:string,
    firstname:string,
    lastname:string,
    active:boolean
    email?:string | null,
    photo?: string | null;
}

export interface ISesion{
    uid:string,
    displayName:string,
    email:string,
    createdAt: number
}
