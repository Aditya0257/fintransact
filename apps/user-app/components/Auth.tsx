"use client";

import { useState } from "react";
import { LabelledInput } from "./LabelledInput";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

interface SignInInputs {
    phone: string;
    password: string;
    name: string;
}

export const Auth = () => {

    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [inputs, setInputs] = useState<SignInInputs>({
        phone: "",
        password: "",
        name: ""
    });


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputs((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    }

    async function handleSubmit(e: any) {
        e.preventDefault();
        try {
            setIsLoading(true);
            setError(null);


            const result = await signIn("credentials", {
                phone: inputs.phone,
                password: inputs.password,
                name: inputs.name,
                redirect: false,
            });


            if (result?.error) {
                setError("Invalid credentials. Please try again.");
                return;
            }

            router.push("/dashboard");
            router.refresh();



        } catch (error) {
            setError("An unexpected error occurred. Please try again. ");
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    }



    return (
        <div className="h-screen flex justify-center ">
            <div className="flex flex-col justify-center ">
                <div className="px-10 text-center text-3xl font-extrabold">
                    Welcome to Fintransact
                </div>
                <div className="px-2 mt-2 text-center text-slate-500 font-light text-md">
                    Join us now by entering your details.
                </div>
                <div className="mt-3">
                    <LabelledInput
                        onChange={handleInputChange}
                        label="Name"
                        type="text"
                        placeholder="Enter your name"
                        id="name"
                        name="name"
                        value={inputs.name}
                    />
                </div>
                <div className="mt-3">
                    <LabelledInput
                        onChange={handleInputChange}
                        label="Phone"
                        type="text"
                        placeholder="Enter your phone number"
                        id="phone"
                        name="phone"
                        value={inputs.phone}
                    />
                </div>
                <div className="mt-3">
                    <LabelledInput
                        onChange={handleInputChange}
                        label="Password"
                        type="password"
                        placeholder="Enter your password"
                        id="password"
                        name="password"
                        value={inputs.password}
                    />
                </div>

                {error && (
                    <div className="text-red-500 text-sm">{error}</div>
                )}


                <button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="w-full mt-5 select-none rounded-lg bg-gray-900 py-3 px-6 text-center align-middle  text-sm font-bold  text-white shadow-md shadow-gray-900/10 transition-all hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                    type="button"
                >
                    {isLoading ? "Joining in..." : "Join In"}
                </button>
            </div>
        </div>
    );
};