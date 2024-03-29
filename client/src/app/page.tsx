"use client";
import { useState } from "react";
import { auth, storage } from "../config/firebase";
import {
  createUserWithEmailAndPassword,
  deleteUser,
  inMemoryPersistence,
  updateProfile,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

export default function Home() {
  auth.setPersistence(inMemoryPersistence);

  return <></>;
}

function Auth() {
  const [signIn, setSignIn] = useState<"signin" | "signup">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [school, setSchool] = useState("");

  function SetSchool(token: string) {
    return fetch("", {
      method: "POST",
      body: JSON.stringify({
        title: "director",
        school: school,
        token: token,
      }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
  }

  function SignUp() {
    createUserWithEmailAndPassword(auth, email, password).then(
      async ({ user }) => {
        SetSchool((await auth.currentUser?.getIdToken()) as string)
          .then((res) => {
            if (res.status != 200) {
              deleteUser(user);
              alert("Failed to Set School and School Title, Retry SignUp");
            } else {
              updateProfile(user, {
                displayName: username,
                photoURL: photoURL,
              })
                .then(() => {
                  window.location.replace("/main");
                })
                .catch(() => {
                  deleteUser(user);
                  alert("Failed to Set Username and PhotoURL, Retry SignUp");
                });
            }
          })
          .catch(() => {
            deleteUser(user);
            alert("Failed to Set School and School Title,Retry SignUp");
          });
      }
    );
  }

  function SignIn() {
    signInWithEmailAndPassword(auth, email, password).then(() => {
      window.location.replace("/main");
    });
  }

  function uploadPhoto(input: HTMLInputElement) {
    const allowedExtensions = /(\.jpg|\.jpeg|\.png)$/i;
    const files: FileList | null = input.files;

    if (files && files.length > 0) {
      const selectedFile: File = files[0]; // Assuming only one file is selected
      const fileName: string = selectedFile.name;

      if (!allowedExtensions.test(fileName)) {
        alert("Please select a valid image file (jpg, jpeg or png)");
        input.value = "";
      }

      // Firebase storage reference
      const storageRef = ref(storage, auth.currentUser?.uid + fileName);

      uploadBytes(storageRef, selectedFile).then(async () => {
        const url = await getDownloadURL(storageRef);
        setPhotoURL(url);
      });
    }
  }

  return (
    <>
      <section className="bg-white dark:bg-gray-900">
        <div className="container flex items-center justify-center min-h-screen px-6 mx-auto">
          <form className="w-full max-w-md">
            <div className="flex justify-center mx-auto">
              <img className="w-auto h-7 sm:h-8" src="" alt="" />
            </div>

            <div className="flex items-center justify-center mt-6">
              <a
                href="#"
                onClick={() => setSignIn("signin")}
                className={
                  signIn == "signin"
                    ? "w-1/3 pb-4 font-medium text-center text-gray-500 capitalize border-b-2 dark:text-white border-blue-500 dark:border-blue-400"
                    : "w-1/3 pb-4 font-medium text-center text-gray-500 capitalize border-b dark:border-gray-400 dark:text-gray-300"
                }
              >
                sign in
              </a>

              <a
                href="#"
                onClick={() => setSignIn("signup")}
                className={
                  signIn == "signin"
                    ? "w-1/3 pb-4 font-medium text-center text-gray-800 capitalize border-b-2 dark:text-white "
                    : "w-1/3 pb-4 font-medium text-center text-gray-800 capitalize border-b-2 dark:text-white border-blue-500 dark:border-blue-400"
                }
              >
                sign up
              </a>
            </div>

            <div className="relative flex items-center mt-8">
              {signIn == "signin" ? (
                <></>
              ) : (
                <>
                  <span className="absolute">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-6 h-6 mx-3 text-gray-300 dark:text-gray-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </span>

                  <input
                    type="text"
                    className="block w-full py-3 text-gray-700 bg-white border rounded-lg px-11 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
                    placeholder="School Name"
                  />
                </>
              )}
            </div>
            <div className="relative flex items-center mt-8">
              {signIn == "signin" ? (
                <></>
              ) : (
                <>
                  <span className="absolute">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-6 h-6 mx-3 text-gray-300 dark:text-gray-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </span>

                  <input
                    type="text"
                    className="block w-full py-3 text-gray-700 bg-white border rounded-lg px-11 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
                    placeholder="Username"
                  />
                </>
              )}
            </div>
            {signIn == "signin" ? (
              <></>
            ) : (
              <label
                htmlFor="dropzone-file"
                className="flex items-center px-3 py-3 mx-auto mt-6 text-center bg-white border-2 border-dashed rounded-lg cursor-pointer dark:border-gray-600 dark:bg-gray-900"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 text-gray-300 dark:text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                  />
                </svg>

                <h2 className="mx-3 text-gray-400">School Profile Photo</h2>

                <input
                  id="dropzone-file"
                  accept="image/*"
                  type="file"
                  className="hidden"
                />
              </label>
            )}

            <div className="relative flex items-center mt-6">
              <span className="absolute">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 mx-3 text-gray-300 dark:text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </span>

              <input
                type="email"
                className="block w-full py-3 text-gray-700 bg-white border rounded-lg px-11 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
                placeholder="Email address"
              />
            </div>

            <div className="relative flex items-center mt-4">
              <span className="absolute">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 mx-3 text-gray-300 dark:text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </span>

              <input
                type="password"
                className="block w-full px-10 py-3 text-gray-700 bg-white border rounded-lg dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
                placeholder="Password"
              />
            </div>

            <div className="relative flex items-center mt-6">
              {signIn == "signin" ? (
                <></>
              ) : (
                <>
                  <span className="absolute">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-6 h-6 mx-3 text-gray-300 dark:text-gray-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </span>

                  <select className="block w-full py-3 text-gray-700 bg-white border rounded-lg px-11 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40">
                    <option>Director</option>
                    <option>Teacher</option>
                    <option>Student</option>
                  </select>
                </>
              )}
            </div>

            <div className="mt-6">
              {signIn == "signin" ? (
                <button className="w-full px-6 py-3 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-500 rounded-lg hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50">
                  Sign In
                </button>
              ) : (
                <button className="w-full px-6 py-3 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-500 rounded-lg hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50">
                  Sign Up
                </button>
              )}

              <div className="mt-6 text-center ">
                <a
                  href="#"
                  onClick={() =>
                    setSignIn(signIn == "signin" ? "signup" : "signin")
                  }
                  className="text-sm text-blue-500 hover:underline dark:text-blue-400"
                >
                  {signIn == "signin"
                    ? "Dont have an account?"
                    : "Already have an account?"}
                </a>
              </div>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}
