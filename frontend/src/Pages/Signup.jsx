import React from "react";
import { AiOutlineTwitter } from "react-icons/ai";
import { BiLogoFacebook } from "react-icons/bi";
import googleImage from '../assets/google.jpeg';

const GoogleSignupButton = () => {
    const handleSignup = () => {
        // Handle Google Signup logic here
        console.log("Signing up with Google...");
    };

    return (
        <div className="flex justify-center">
            <button
                onClick={handleSignup}
                className="flex items-center bg-teal-500 text-white border border-transparent rounded-lg shadow-md px-5 py-2 transition duration-200 ease-in-out transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50"
            >
                <img src={googleImage} alt="Google" className="w-6 h-6 mr-2" />
                <span className="font-semibold">Sign Up with Google</span>
            </button>
        </div>
    );
};

export const Signup = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-[#0a0e14]">
            <div className="flex flex-col md:flex-row items-center bg-[#1a1f26] rounded-xl shadow-lg p-8 max-w-4xl w-full">
                <div className="hidden md:block md:w-1/2">
                    <img
                        src="https://tecdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
                        alt="Illustration"
                        className="rounded-xl"
                    />
                </div>

                <div className="w-full md:w-1/2 md:pl-10">
                    <h2 className="text-3xl font-bold text-center text-teal-400 mb-6">Create an Account</h2>

                    <div className="flex justify-center mb-4 space-x-4">
                        <GoogleSignupButton />
                    </div>

                    <div className="flex items-center mb-5">
                        <div className="flex-1 border-t border-gray-600"></div>
                        <p className="px-4 text-gray-400">Or</p>
                        <div className="flex-1 border-t border-gray-600"></div>
                    </div>

                    <input
                        type="text"
                        placeholder="Full Name"
                        className="w-full p-3 mb-4 border border-gray-600 bg-[#121820] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />

                    <input
                        type="email"
                        placeholder="Email Address"
                        className="w-full p-3 mb-4 border border-gray-600 bg-[#121820] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        className="w-full p-3 mb-4 border border-gray-600 bg-[#121820] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />

                    <input
                        type="password"
                        placeholder="Confirm Password"
                        className="w-full p-3 mb-4 border border-gray-600 bg-[#121820] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />

                    <div className="flex justify-between items-center mb-6 text-sm text-gray-400">
                        <label className="flex items-center">
                            <input type="checkbox" className="mr-2" /> I agree to the Terms and Conditions
                        </label>
                    </div>

                    <button
                        className="w-full py-3 bg-teal-500 text-white rounded-lg font-semibold hover:bg-teal-400 transition duration-300"
                        type="submit"
                    >
                        Sign Up
                    </button>

                    <p className="mt-4 text-center text-gray-400">
                        Already have an account?{" "}
                        <a href="#" className="text-teal-400 hover:underline hover:underline-offset-4 hover:text-teal-300">
                            Login
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;
