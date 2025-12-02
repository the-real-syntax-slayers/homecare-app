// Specifies data needed to log in user
export interface LoginDto {
    username: string;
    password: string;
}
// Specifies data needed to create new user
export interface RegisterDto {
    username: string;
    email: string;
    password: string;
}