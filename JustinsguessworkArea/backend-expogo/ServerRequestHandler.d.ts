export function loginrequest(email: string, password: string): Promise<[]>;
export function registerRequest(setofdata:[
    STUDENT_EMAIL:string, 
    STUDENT_USERNAME:string, 
    PASSWORD_ENCRYPT:string, 
    persona1:boolean,
    persona2:boolean,
    persona3:boolean,
    persona4:boolean,
    selectedDegreeNo:any,
    listinputs:[Number,Number,Number,Number,Number,Number]]): Promise<boolean>;
export function update(setofdata:[
    STUDENT_EMAIL:string, 
    STUDENT_USERNAME:string, 
    PASSWORD_ENCRYPT:string, 
    persona1:boolean,
    persona2:boolean,
    persona3:boolean,
    persona4:boolean,
    selectedDegreeNo:any,
    listinputs:[Number,Number,Number,Number,Number,Number]]
): Promise<void>;
