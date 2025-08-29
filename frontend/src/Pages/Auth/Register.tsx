import { useEffect, FormEventHandler } from "react";
import CoreLayout from "@/Layouts/Core";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Link, useForm } from "@inertiajs/react";
import classNames from "classnames";
import Loading from "@/Components/Loading";

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    useEffect(() => {
        return () => {
            reset("password", "password_confirmation");
        };
    }, []);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route("register"));
    };

    return (
        <CoreLayout title="Kayıt Ol">
            <div className="mt-10 sm:max-w-md mx-auto">
                <div className="p-6 border-y sm:border sm:rounded border-gray-300 dark:border-shark-950">
                    <h1 className="text-lg text-center mt-2 text-royal-950 dark:text-FFF2D7 font-medium tracking-wider uppercase">
                        Merhaba
                    </h1>
                    <form onSubmit={submit}>
                        <div>
                            <InputLabel htmlFor="name" value="İsim" />
                            <TextInput
                                id="name"
                                name="name"
                                value={data.name}
                                className="mt-1 block w-full rounded-md"
                                autoComplete="name"
                                isFocused={true}
                                onChange={(e) =>
                                    setData("name", e.target.value)
                                }
                                required
                            />
                            <InputError
                                message={errors.name}
                                className="mt-2"
                            />
                        </div>
                        <div className="mt-4">
                            <InputLabel htmlFor="email" value="Email" />
                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="mt-1 block w-full rounded-md"
                                autoComplete="username"
                                onChange={(e) =>
                                    setData("email", e.target.value)
                                }
                                required
                            />
                            <InputError
                                message={errors.email}
                                className="mt-2"
                            />
                        </div>
                        <div className="mt-4">
                            <InputLabel htmlFor="password" value="Şifre" />
                            <TextInput
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                className="mt-1 block w-full rounded-md"
                                autoComplete="new-password"
                                onChange={(e) =>
                                    setData("password", e.target.value)
                                }
                                required
                            />
                            <InputError
                                message={errors.password}
                                className="mt-2"
                            />
                        </div>
                        <div className="mt-4">
                            <InputLabel
                                htmlFor="password_confirmation"
                                value="Şifre (Tekrar)"
                            />
                            <TextInput
                                id="password_confirmation"
                                type="password"
                                name="password_confirmation"
                                value={data.password_confirmation}
                                className="mt-1 block w-full rounded-md"
                                autoComplete="new-password"
                                onChange={(e) =>
                                    setData(
                                        "password_confirmation",
                                        e.target.value
                                    )
                                }
                                required
                            />

                            <InputError
                                message={errors.password_confirmation}
                                className="mt-2"
                            />
                        </div>
                        <div className="flex items-center justify-end mt-4 gap-2">
                            <PrimaryButton
                                className="ms-4"
                                disabled={processing}
                            >
                                Kayıt Ol
                            </PrimaryButton>
                            {processing && <Loading />}
                        </div>
                    </form>
                </div>
                <div className="text-right py-2 px-2">
                    <Link
                        href={route("login")}
                        className={classNames(
                            "px-1 rounded-none underline text-sm underline-offset-2",
                            "text-gray-500 dark:text-gray-400 hover:text-royal-950 dark:hover:text-lotus-400 focus:text-royal-950 dark:focus:text-lotus-400",
                            "focus:outline-none focus:ring-0"
                        )}
                    >
                        Zaten bir hesabın var mı?
                    </Link>
                </div>
            </div>
        </CoreLayout>
    );
}
