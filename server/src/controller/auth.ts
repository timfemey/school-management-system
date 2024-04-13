import { Request, Response } from "hyper-express";
import { auth, firestore } from "../config/firebase.js";
import validator from "validator";
import { checkIfSchoolIdHasBeenUsed } from "../helper/school_ID.js";

export async function SignUp(req: Request, res: Response) {
    const { email, password, school, username, type, dpLink, schoolId } =
        await req.json();
    if (!email || !password || !username) {
        return res.json({
            message: "Email, Password or Username not Defined",
            status: false,
        });
    }

    const isEmail = validator.isEmail(email);
    if (!isEmail) {
        return res.json({ message: "Invalid Email, Try Again", status: false });
    }

    if (String(password).length < 8) {
        return res.json({
            message: "Password must be at least 8 characters",
            status: false,
        });
    }

    if (String(username).length < 5) {
        return res.json({
            message: "Username must be at least 5 characters",
            status: false,
        });
    }

    if (!school || String(school).trim().length < 7) {
        return res.json({
            message: "School Name was not defined or less than 7 characters",
            status: false,
        });
    }

    if (!schoolId) {
        return res.json({
            message: "School ID was not set, Set a Unique School ID",
            status: false,
        });
    }

    const typeOfUser = String(type).toLowerCase();
    if (
        !type ||
        typeOfUser == "director" ||
        typeOfUser == "teacher" ||
        typeOfUser == "student"
    ) {
        return res.json({
            message: "Choose a Type - Director, Teacher or Student",
        });
    }

    if (!dpLink) {
        return res.json({
            message: "Upload a Profile Photo to Continue",
            status: false,
        });
    }

    //If user is a director
    if (typeOfUser == "director") {
        if ((await checkIfSchoolIdHasBeenUsed(schoolId)) == false) {
            auth
                .createUser({
                    email: email,
                    password: password,
                    displayName: username,
                    photoURL: dpLink,
                    emailVerified: false,
                })
                .then((user) => {
                    auth.setCustomUserClaims(user.uid, {
                        type: "director",
                        school_id: schoolId,
                    });
                    firestore.collection("schools").doc(schoolId).set({
                        owner_uid: user.uid,
                        owner_email: user.email,
                        school_name: school,
                        school_dp: dpLink,
                    });

                    return res.json({ message: "Successfully Created Account", status: true })

                });
        } else {
            return res.json({
                message: "The School ID has already been used",
                status: false,
            });
        }
    }

    //If user is a teacher
    if (typeOfUser == "teacher") {
        const schoolCheck = await checkIfSchoolIdHasBeenUsed(schoolId);
        if (schoolCheck == false) {
            return res.json({
                message: "This School ID is not valid",
                status: false,
            });
        } else {
            auth
                .createUser({
                    email: email,
                    password: password,
                    displayName: username,
                    photoURL: dpLink,
                    emailVerified: false,
                })
                .then((user) => {
                    auth.setCustomUserClaims(user.uid, {
                        type: "teacher",
                        school_id: schoolId,
                    });

                    return res.json({ message: "Successfully Created Account", status: true })

                });

        }
    }

    //If user is a student
    if (typeOfUser == "student") {
        const schoolCheck = await checkIfSchoolIdHasBeenUsed(schoolId);
        if (schoolCheck == false) {
            return res.json({
                message: "This School ID is not valid",
                status: false,
            });
        } else {
            auth
                .createUser({
                    email: email,
                    password: password,
                    displayName: username,
                    photoURL: dpLink,
                    emailVerified: false,
                })
                .then((user) => {
                    auth.setCustomUserClaims(user.uid, {
                        type: "student",
                        school_id: schoolId,
                    });


                    return res.json({ message: "Successfully Created Account", status: true })
                });

        }
    }
}

