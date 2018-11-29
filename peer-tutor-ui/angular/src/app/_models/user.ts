/**
 * TODO: Finalize respond format
 */
export interface UserRegister {
    student_id: string;
    password: string;
    name: string;
    username: string;
    security_question: string;
    security_answer: string;
    [x:string]: any;
}

export interface Student {
    "_id"?: any;
    "enrolled_classes": any[];
    "meetings": any[];
    "name": string;
    "password"?: string;
    "student_id": string;
    "username": string;
    security_question: string;
    security_answer?: string;
    [x:string]: any;
}
