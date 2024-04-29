import { Request, Response } from "hyper-express";
import { verifyUID } from "./auth.js";

interface Body {
    type: "teachers" | "students"
    singular: string //Incase its a particular user , the uid is defined in the singular , if its a group of users singular is an empty string
    paginateValue: string // Value used for paginating requests , if defined, send next 10 data in Pagination
    uid: string
}

async function viewStudentorTeachers(req: Request, res: Response) {
    const body = await req.json() as Body
    const token = req.headers["X-Token"]
    if (!token) return res.json({ message: "Authentication Details not Received, Log In to Continue with Action", status: false })
    const user = (await verifyUID(body.uid, token as string)).user
    const schoolID = user != null ? user.customClaims!["school_id"] : "";
    const type = user != null ? user.customClaims!["type"] : "";
    if (schoolID == "") {
        return res.json({ message: "Invalid User", status: false })
    }

    if (type != "director" && type != "teachers") {
        return res.status(403).json({ message: "Only Directors can view Students / Teachers Data and only Teachers can view Students Data", status: false })
    }

    if (body.type == "students") {

    }

    if (body.type == "teachers") {
        if (type != "director") {
            return res.status(403).json({ message: "Only Directors can view Students and Teachers Data ", status: false })
        }

    }

}