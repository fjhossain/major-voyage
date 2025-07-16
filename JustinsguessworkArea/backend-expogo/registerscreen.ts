// @ts-ignore
import React, { useState } from 'react';
// @ts-ignore
import { KeyboardAvoidingView, Platform, Scrollview, View, TextInput, Stylesheet, Text, TouchableOpacity} from 'react-native'
// @ts-ignore
import registerRequest from './newStudent.js'

const styles = Stylesheet.create({
    container: {
        padding:20,
        justifyContent: 'center'
    },
    input : {
        borderBottomWidth: 1,
        marginBottom: 12,
        paddingVertical: 8,
        paddingHorizontal:4,
    },
    button: {
        backgroundColor: '#007AFF',
        padding: 12,
        marginTop: 16,
        alignItems: 'center',
        borderRadius: 6,
    },
    buttonText: {
        color: '#fff',
        fontWeight:'bold',
    }
});

interface UserData {
    email: string;
    password: string;
    studentID: string;
    firstName: string;
    lastName:string;
    persona1: number;
    persona2: number;
    persona3: number;
    persona4: number;
    selectedDegreeNo: number;
    degreePercent1: number;
    degreePercent2: number;
    degreePercent3: number;
    degreePercent4: number;
}

function hiddenInputs() {
    //here is where we get the rest of the items by calling it's respective script
    
    let persona1_in:number = -1;
    let persona2_in:number = -1;
    let persona3_in:number = -1;
    let persona4_in:number = -1;
    let selectedDegreeNo_in:number =0;
    let degreePercent1_in:number = -1;
    let degreePercent2_in:number = -1;
    let degreePercent3_in:number = -1;
    let degreePercent4_in:number = -1; 

    return [
        persona1_in,
        persona2_in,
        persona3_in,
        persona4_in,
        selectedDegreeNo_in,
        degreePercent1_in,
        degreePercent2_in,
        degreePercent3_in,
        degreePercent4_in
    ]
}
export default function RegisterScreen() {
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [studentID, setstudentID] = useState<string>('')
    const [firstName, setFirstName] = useState<string>('')
    const [lastName, setLastName] = useState<string>('')
    const newtuple = hiddenInputs();
    const [setpersona1,
        setpersona2,
        setpersona3,
        setpersona4,
        setselectedDegreeNo,
        setdegreePercent1,
        setdegreePercent2,
        setdegreePercent3,
        setdegreePercent4] = newtuple;
    const persona1 =setpersona1;
    const persona2 =setpersona2;
    const persona3 =setpersona3;
    const persona4 =setpersona4;
    const selectedDegreeNo =setselectedDegreeNo;
    const degreePercent1 = setdegreePercent1;
    const degreePercent2 = setdegreePercent2;
    const degreePercent3 = setdegreePercent3;
    const degreePercent4 = setdegreePercent4;
    

    const handleRegister = (): void => {
        const userdata: UserData = {
            email,
            password,
            studentID,
            firstName,
            lastName,
            persona1,
            persona2,
            persona3,
            persona4,
            selectedDegreeNo,
            degreePercent1,
            degreePercent2,
            degreePercent3,
            degreePercent4
        };
        if (!email || !password || !studentID || !firstName || !lastName) {
            alert('Please fill out all fields');
            return;
        }
        registerRequest(userdata);//send da packet
    };
    return (
        <KeyboardAvoidingView<KeyboardAvoidingView behavior={Platform,OS === 'ios' ? 'padding' : undefined} style={{ flex: 1}}>
            <Scrollview contentContainerStyle={styles.contianer}>
                <Text style={styles.title}>Register</text>
                <TextInput style={styles.input} placeholder="email" onChangeText={setEmail} value = {email} keyboardType="email-address" />
                <TextInput style={styles.input} placeholder="Password" onChangeText={setPassword} value={password} secureTextEntry />
                <TextInput style={styles.input} placeholder="StudentID" onChangeText={setstudentID} value={studentID} />
                <TextInput style={styles.input} placeholder="FirstName" onChangeText = {setFirstName} value={firstName} />
                <TextInput style={styles.input} placeholder="LastName" onChangeText = {setLastName} value={lastName} />

                <TouchableOpacity style={styles.button} onPress={handleRegister}>
                    <Text style={styles.buttonText}>Register</Text>
                </TouchableOpacity>
        </KeyboardAvoidingView>
    )
}


