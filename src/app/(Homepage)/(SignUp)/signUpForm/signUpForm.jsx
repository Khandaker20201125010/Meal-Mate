'use client';

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import Link from "next/link";
import Image from "next/image";
import loginBg from "../../../../../public/assists/images/login.png";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";

const image_hosting_token = process.env.IMAGE_HOSTING_KEY;
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_token}`;

export default function SignUpPage() {
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();
    const { data: session, status } = useSession();
    const [loading, setLoading] = useState(false);
    const [isRedirecting, setIsRedirecting] = useState(false);


    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();

    useEffect(() => {
        if ((status === "authenticated" || session) && !isRedirecting) {
            setIsRedirecting(true);
            router.push("/");
        }
    }, [status, session, isRedirecting, router]);


    const onSubmit = async (data) => {
        setLoading(true);

        try {
            // Validate image file
            if (!data.image[0]) {
                throw new Error("Please select a profile image");
            }

            if (data.image[0].size > 2 * 1024 * 1024) {
                throw new Error("Image size should be less than 2MB");
            }

            // Upload image to imgbb
            const formData = new FormData();
            formData.append("image", data.image[0]);

            const imgbbRes = await fetch(image_hosting_api, {
                method: "POST",
                body: formData,
            });

            if (!imgbbRes.ok) {
                throw new Error("Image upload failed");
            }

            const imgbbData = await imgbbRes.json();
            const imageUrl = imgbbData?.data?.url;

            if (!imageUrl) {
                throw new Error("Failed to get image URL");
            }

            const newUser = {
                name: data.name,
                email: data.email,
                password: data.password,
                image: imageUrl,
                role: "customer",
                status: "regular", // Changed from "tourist" to match schema
            };

            // Save user
            const res = await fetch('/api/users', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newUser),
            });

            const responseData = await res.json();

            if (!res.ok) {
                throw new Error(responseData.message || "Sign up failed");
            }

            // Auto-login after signup
            const signInRes = await signIn("credentials", {
                redirect: false,
                email: newUser.email,
                password: newUser.password,
            });

            if (signInRes?.error) {
                Swal.fire({
                    icon: "error",
                    title: "Sign In Failed",
                    text: signInRes.error,
                });
            } else {
                Swal.fire({
                    icon: "success",
                    title: "Account Created Successfully!",
                    text: "You are now logged in",
                    timer: 2000,
                }).then(() => {
                    router.push("/");
                });
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Sign Up Failed",
                text: error.message || "Please try again later.",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSocialLogin = async (provider) => {
        setLoading(true);
        try {
            const res = await signIn(provider, { redirect: false });

            if (res?.error) {
                throw new Error(res.error);
            }

            // The actual status setting happens in the NextAuth callback
            Swal.fire({
                icon: "success",
                title: `Logged in with ${provider}`,
                timer: 1500,
            }).then(() => {
                window.location.href = "/";
            });
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: `Login with ${provider} failed`,
                text: error.message,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-row-reverse h-screen w-full bg-gradient-to-r from-pink-300 via-orange-400 to-orange-500 overflow-hidden">
            <div className="hidden md:flex w-1/2 h-screen">
                <div className="relative w-full h-full">
                    <Image
                        src={loginBg}
                        alt="Bicycle Sign Up"
                        fill
                        sizes="50vw"
                        className="object-cover"
                        priority
                    />
                </div>
            </div>

            <div className="w-full md:w-1/2 h-full flex items-center justify-center p-6 md:p-12 bg-white/70 backdrop-blur-md shadow-md z-10">
                <div className="w-full max-w-md">
                    <h4 className="text-gray-700 mb-2">Start your journey</h4>
                    <h2 className="text-3xl md:text-4xl font-extrabold text-black mb-8">
                        Sign Up to <span className="text-orange-500">MEALMATE</span>
                    </h2>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Full Name */}
                        <div className="relative group">
                            <label className="text-xs font-medium text-gray-700 bg-white px-2 absolute left-3 -top-2">
                                Full Name
                            </label>
                            <input
                                type="text"
                                {...register("name", {
                                    required: "Full name is required",
                                    minLength: {
                                        value: 3,
                                        message: "Name must be at least 3 characters"
                                    }
                                })}
                                className="w-full px-4 py-2.5 text-gray-700 border border-gray-400 rounded placeholder:text-xs focus:outline-none focus:ring-2 focus:ring-black/40"
                                placeholder="Full Name"
                            />
                            {errors.name && <p className="text-red-600 text-xs mt-1">{errors.name.message}</p>}
                        </div>

                        {/* Email */}
                        <div className="relative group">
                            <label className="text-xs font-medium text-gray-700 bg-white px-2 absolute left-3 -top-2">
                                Email
                            </label>
                            <input
                                type="email"
                                {...register("email", {
                                    required: "Email is required",
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: "Invalid email address"
                                    }
                                })}
                                className="w-full px-4 py-2.5 text-gray-700 border border-gray-400 rounded placeholder:text-xs focus:outline-none focus:ring-2 focus:ring-black/40"
                                placeholder="Email"
                            />
                            {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email.message}</p>}
                        </div>

                        {/* Password */}
                        <div className="relative group">
                            <label className="text-xs font-medium text-gray-700 bg-white px-2 absolute left-3 -top-2">
                                Password
                            </label>
                            <input
                                type={showPassword ? "text" : "password"}
                                {...register("password", {
                                    required: "Password is required",
                                    minLength: {
                                        value: 6,
                                        message: "Password must be at least 6 characters"
                                    }
                                })}
                                className="w-full px-4 py-2.5 text-gray-700 border border-gray-400 rounded placeholder:text-xs focus:outline-none focus:ring-2 focus:ring-black/40"
                                placeholder="Password"
                            />
                            <span
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 top-1 flex items-center pr-4 cursor-pointer"
                            >
                                {showPassword ? <AiFillEye size={18} /> : <AiFillEyeInvisible size={18} />}
                            </span>
                            {errors.password && <p className="text-red-600 text-xs mt-1">{errors.password.message}</p>}
                        </div>

                        {/* Image */}
                        <div className="relative group">
                            <label className="text-xs font-medium text-gray-700 bg-white px-2 absolute left-3 -top-2">
                                Profile Picture
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                {...register("image", {
                                    required: "Profile image is required",
                                    validate: {
                                        lessThan2MB: files =>
                                            files[0]?.size < 2 * 1024 * 1024 || "Image must be smaller than 2MB",
                                        acceptedFormats: files =>
                                            ['image/jpeg', 'image/png', 'image/webp'].includes(files[0]?.type) ||
                                            "Only JPEG, PNG, WEBP formats are supported"
                                    }
                                })}
                                className="w-full px-4 py-2.5 text-gray-700 border border-gray-400 rounded placeholder:text-xs focus:outline-none focus:ring-2 focus:ring-black/40"
                            />
                            {errors.image && <p className="text-red-600 text-xs mt-1">{errors.image.message}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-3 bg-orange-600 text-white rounded font-semibold transition duration-300 ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-orange-500'
                                }`}
                        >
                            {loading ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Signing Up...
                                </span>
                            ) : "Sign Up"}
                        </button>
                    </form>

                    <div className="flex items-center gap-3 my-6">
                        <span className="bg-gray-400 h-[1px] w-full" />
                        <span className="text-gray-600 text-sm">or</span>
                        <span className="bg-gray-400 h-[1px] w-full" />
                    </div>

                    <div className="flex gap-4">
                        <button data-tip="Login with Google"
                            onClick={() => handleSocialLogin("google")}
                            disabled={loading}
                            className={`tooltip tooltip-error  btn bg-transparent flex-1 py-2.5 border border-gray-400 rounded flex items-center justify-center transition ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg hover:shadow-orange-300'
                                }`}
                        >
                            <FcGoogle className="text-xl" />
                        </button>
                        <button data-tip="Login with Facebook"
                            onClick={() => handleSocialLogin("facebook")}
                            disabled={loading}
                            className={`tooltip tooltip-info btn bg-transparent flex-1 py-2.5 border border-gray-400 rounded flex items-center justify-center transition ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg hover:shadow-blue-300'
                                }`}
                        >
                            <FaFacebook className="text-xl text-blue-600" />
                        </button>
                    </div>

                    <p className="mt-6 text-center text-sm text-gray-700">
                        Already have an account?{' '}
                        <Link href="/login" className="font-medium text-orange-600 hover:underline">
                            Login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
