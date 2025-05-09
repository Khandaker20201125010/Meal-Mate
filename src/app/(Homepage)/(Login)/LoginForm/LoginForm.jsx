"use client";

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

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const { data: session, status, update } = useSession();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    useEffect(() => {
        if (status === "authenticated") {
            router.push("/");
        }
    }, [status, router]);

    if (status === "authenticated") {
        return null;
    }

    const handleLogin = async (data) => {
        setLoading(true);
        const res = await signIn("credentials", {
            email: data.email,
            password: data.password,
            redirect: false,
        });
        setLoading(false);

        if (res.ok) {
            await update(); // force session refresh

            router.refresh(); // refresh layout (if you're using Next.js 13/14 app directory)

            Swal.fire({
                icon: "success",
                title: "Login Successful!",
                text: "Welcome back!",
                timer: 2000,
            });

            router.push("/"); // navigate to home (won’t reload page)
        } else {
            Swal.fire({
                icon: "error",
                title: "Login Failed!",
                text: "Invalid email or password.",
                timer: 2000,
            });
        }
    };


    const handleSocialLogin = async (provider) => {
        setLoading(true);
        await signIn(provider);
        setLoading(false);
    };

    return (
        <div className="flex h-screen w-full bg-gradient-to-r from-orange-500 via-orange-400 to-pink-300 overflow-hidden">
            <div className="hidden md:flex w-1/2 h-screen">
                <div className="relative w-full h-full">
                    <Image
                        src={loginBg}
                        alt="Login Background"
                        fill
                        className="object-cover"
                        priority
                        sizes="50vw"
                    />
                </div>
            </div>

            <div className="w-full md:w-1/2 h-full flex items-center justify-center p-6 md:p-12 bg-white/70 backdrop-blur-md shadow-md z-10">
                <div className="w-full max-w-md">
                    <h4 className="text-gray-700 mb-2">Start your ride</h4>
                    <h2 className="text-3xl md:text-4xl font-extrabold text-black mb-8">
                        Sign in to <span className="text-orange-500">MEALMATE</span>
                    </h2>

                    <form onSubmit={handleSubmit(handleLogin)} className="space-y-6">
                        <div className="relative group">
                            <label className="text-xs font-medium text-gray-700 bg-white px-2 absolute left-3 -top-2">
                                Email
                            </label>
                            <input
                                type="email"
                                {...register("email", { required: "Email is required" })}
                                className="w-full px-4 py-2.5 text-gray-700 border border-gray-400 rounded placeholder:text-xs focus:border-black focus:outline-none focus:ring-2 focus:ring-black/40"
                                placeholder="Email"
                            />
                            {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email.message}</p>}
                        </div>

                        <div className="relative group">
                            <label className="text-xs font-medium text-gray-700 bg-white px-2 absolute left-3 -top-2">
                                Password
                            </label>
                            <input
                                type={showPassword ? "text" : "password"}
                                {...register("password", { required: "Password is required" })}
                                className="w-full px-4 py-2.5 text-gray-700 border border-gray-400 rounded placeholder:text-xs focus:border-black focus:outline-none focus:ring-2 focus:ring-black/40"
                                placeholder="Password"
                            />
                            <span
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 top-1 flex items-center pr-4 cursor-pointer"
                            >
                                {showPassword ? (
                                    <AiFillEye size={18} className="text-gray-700" />
                                ) : (
                                    <AiFillEyeInvisible size={18} className="text-gray-700" />
                                )}
                            </span>
                            {errors.password && <p className="text-red-600 text-xs mt-1">{errors.password.message}</p>}
                        </div>
                        <button
                            type="submit"
                            className="w-full py-3 bg-orange-600 text-white rounded font-semibold hover:bg-orange-500 transition duration-300"
                            disabled={loading}
                        >
                            {loading ? "Logging in..." : "Login"}
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
                            className="tooltip tooltip-error btn bg-transparent flex-1 py-2.5 border border-gray-400 rounded flex items-center justify-center hover:shadow-lg hover:shadow-orange-300 transition"
                        >
                            <FcGoogle className="text-xl" />
                        </button>
                        <button data-tip="Login with Facebook"
                            onClick={() => handleSocialLogin("facebook")}
                            className="tooltip tooltip-info btn bg-transparent flex-1 py-2.5 border border-gray-400 rounded flex items-center justify-center hover:shadow-lg hover:shadow-blue-300 transition"
                        >
                            <FaFacebook className="text-xl text-blue-600" />
                        </button>
                    </div>

                    <p className="mt-6 text-center text-sm text-gray-700">
                        Don't have an account?{" "}
                        <Link href="/signup" className="font-medium underline">
                            Register
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
