'use client';

import { useState } from "react";
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

const image_hosting_token = process.env.NEXT_PUBLIC_IMAGE_HOSTING_KEY;
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_token}`;

export default function SignUpPage() {
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();
    const { data: session } = useSession();
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();

    if (session) {
        router.push("/");
    }

    const onSubmit = async (data) => {
        setLoading(true);

        try {
            // Upload image to imgbb
            const formData = new FormData();
            formData.append("image", data.image[0]);

            const imgbbRes = await fetch(image_hosting_api, {
                method: "POST",
                body: formData,
            });

            const imgbbData = await imgbbRes.json();
            const imageUrl = imgbbData?.data?.url;

            if (!imageUrl) throw new Error("Image upload failed");

            const newUser = {
                name: data.name,
                email: data.email,
                password: data.password,
                image: imageUrl,
                role: "tourist",
            };

            // Save user
            const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/users`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newUser),
            });

            if (res.status === 200) {
                reset();

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
                        title: "Account Created and Logged In Successfully!",
                        timer: 2000,
                        willClose: () => {
                            router.push("/");
                        },
                    });
                }
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Sign Up Failed",
                    text: "Please try again later.",
                });
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Something Went Wrong",
                text: error.message || "Please try again later.",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSocialLogin = async (provider) => {
        setLoading(true);
        const res = await signIn(provider, { redirect: false });
        setLoading(false);

        if (!res?.error) {
            Swal.fire({
                icon: "success",
                title: `Logged in with ${provider}`,
                timer: 1500,
            }).then(() => {
                window.location.href = "/";
            });
        } else {
            Swal.fire({
                icon: "error",
                title: `Login with ${provider} failed`,
                text: res.error,
            });
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
                        className="object-cover"
                        priority
                    />
                </div>
            </div>

            <div className="w-full md:w-1/2 h-full flex items-center justify-center p-6 md:p-12 bg-white/70 backdrop-blur-md shadow-md z-10">
                <div className="w-full max-w-md">
                    <h4 className="text-gray-700 mb-2">Start your ride</h4>
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
                                {...register("name", { required: "Full name is required" })}
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
                                {...register("email", { required: "Email is required" })}
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
                                {...register("password", { required: "Password is required" })}
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
                                {...register("image", { required: "Profile image is required" })}
                                className="w-full px-4 py-2.5 text-gray-700 border border-gray-400 rounded placeholder:text-xs focus:outline-none focus:ring-2 focus:ring-black/40"
                            />
                            {errors.image && <p className="text-red-600 text-xs mt-1">{errors.image.message}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-orange-600 text-white rounded font-semibold hover:bg-orange-500 transition duration-300"
                        >
                            {loading ? "Signing Up..." : "Sign Up"}
                        </button>
                    </form>

                    <div className="flex items-center gap-3 my-6">
                        <span className="bg-gray-400 h-[1px] w-full" />
                        <span className="text-gray-600 text-sm">or</span>
                        <span className="bg-gray-400 h-[1px] w-full" />
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={() => handleSocialLogin("google")}
                            className="flex-1 py-2.5 border border-gray-400 rounded flex items-center justify-center hover:shadow-lg hover:shadow-orange-300 transition"
                        >
                            <FcGoogle className="text-xl" />
                        </button>
                        <button
                            onClick={() => handleSocialLogin("facebook")}
                            className="flex-1 py-2.5 border border-gray-400 rounded flex items-center justify-center hover:shadow-lg hover:shadow-blue-300 transition"
                        >
                            <FaFacebook className="text-xl text-blue-600" />
                        </button>
                    </div>

                    <p className="mt-6 text-center text-sm text-gray-700">
                        Already have an account?
                        <Link href="/login" className="font-medium underline ml-1">
                            Login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
