import { Request, Response } from "hyper-express";
import { auth } from "../config/firebase.js";
import validator from "validator";
import { generateSchoolId } from "../helper/school_ID.js";

export async function SignUp(req: Request, res: Response) {
    const { email, password, school, username, type, dpLink } = await req.json();
    if (!email || !password || !username) {
        return res.json({ message: "Email, Password or Username not Defined", status: false })
    }

    const isEmail = validator.isEmail(email)
    if (!isEmail) {
        return res.json({ message: "Invalid Email, Try Again", status: false })
    }

    if (String(password).length < 8) {
        return res.json({ message: "Password must be at least 8 characters", status: false })
    }

    if (String(username).length < 5) {
        return res.json({ message: "Username must be at least 5 characters", status: false })
    }

    if (!school || String(school).trim().length < 7) {
        return res.json({ message: "School Name was not defined or less than 7 characters", status: false })
    }

    if (!type || String(type).toLowerCase() == "director" || String(type).toLowerCase() == "teacher" || String(type).toLowerCase() == "student") {
        return res.json({ message: "Choose a Type - Director, Teacher or Student" })
    }

    if (!dpLink) {
        return res.json({ message: "Upload a Profile Photo to Continue", status: false })
    }



    auth.createUser({ email: email, password: password, displayName: username, photoURL: dpLink, emailVerified: false }).then((user) => {
        auth.setCustomUserClaims(user.uid, { type: type, school_id: generateSchoolId(school) })
    })
}
