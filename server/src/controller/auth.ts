import { Request, Response } from "hyper-express";
import { auth, firestore, timestamp } from "../config/firebase.js";
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
                        timestamp: timestamp.now()
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

                    firestore.collection("schools").doc(schoolId).collection("teachers").doc(user.uid).set({
                        email: email,
                        uid: user.uid,
                        timestamp: timestamp.now()
                    })

                    return res.json({ message: "Successfully Created Account", status: true })

                });

        }
    }

    //If user is a student
    if (typeOfUser == "student") {
        const schoolCheck = await checkIfSchoolIdHasBeenUsed(schoolId);
        if (schoolCheck == false) {
            return res.json({
                message: "This School ID is not valid and has been used already",
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

                    firestore.collection("schools").doc(schoolId).collection("students").doc(user.uid).set({
                        email: email,
                        uid: user.uid,
                        timestamp: timestamp.now()
                    })


                    return res.json({ message: "Successfully Created Account", status: true })
                });

        }
    }
}

export async function verifyUID(uid: string, token?: string) {
    try {
        if (token != undefined) {
            const res = await auth.verifyIdToken(token, true);
            if (res.uid != uid) return { validUID: false, user: null };
            const user = await auth.getUser(res.uid)
            return { user: user, validUID: true };
        }
        const res = await auth.getUser(uid);
        if (res.uid) return { user: res, validUID: true };
        return { validUID: false, user: null };
    } catch (error) {
        console.error(error);
        return { validUID: false, user: null };
    }
}

export async function verifyToken(token: string) {
    try {
        const res = await auth.verifyIdToken(token, true);
        if (res.uid) return res.uid;
        return "";
    } catch (error) {
        console.error(error);
        return "";
    }
}
