import { useEffect, FormEventHandler } from "react";
import Checkbox from "@/Components/Checkbox";
import CoreLayout from "@/Layouts/Core";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Link, useForm } from "@inertiajs/react";
import classNames from "classnames";
import Alert from "@/Components/Alert";

export default function Login({
    status,
    canResetPassword,
}: {
    status?: string;
    canResetPassword: boolean;
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    useEffect(() => {
        return () => {
            reset("password");
        };
    }, []);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route("login"));
    };

    return (
        <CoreLayout title="Giriş Yap">
            <div className="mt-10 sm:max-w-md mx-auto">
                <div className="p-6 border-y sm:border sm:rounded border-gray-300 dark:border-shark-950">
                    <h1 className="text-lg text-center mt-2 text-royal-950 dark:text-FFF2D7 font-medium tracking-wider uppercase">
                        Hoşgeldin
                    </h1>
                    {status && <Alert type="info">{status}</Alert>}
                    <form onSubmit={submit}>
                        <div>
                            <InputLabel htmlFor="email" value="Email" />
                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="mt-1 block w-full rounded-md"
                                autoComplete="username"
                                isFocused={true}
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
                                autoComplete="current-password"
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
                        <div className="block mt-4">
                            <label className="flex items-center w-min whitespace-nowrap cursor-pointer">
                                <Checkbox
                                    name="remember"
                                    checked={data.remember}
                                    onChange={(e) =>
                                        setData("remember", e.target.checked)
                                    }
                                />
                                <span className="ms-2 text-sm text-gray-600 dark:text-gray-400">
                                    Beni hatırla
                                </span>
                            </label>
                        </div>
                        <div className="flex items-end justify-end mt-4">
                            {canResetPassword && (
                                <Link
                                    href={route("password.request")}
                                    className={classNames(
                                        "px-1 rounded-none underline text-sm underline-offset-2",
                                        "text-gray-500 dark:text-gray-400 hover:text-royal-950 dark:hover:text-lotus-400 focus:text-royal-950 dark:focus:text-lotus-400",
                                        "focus:outline-none focus:ring-0"
                                    )}
                                >
                                    Şifreni mi unuttun?
                                </Link>
                            )}

                            <PrimaryButton
                                className="ms-2"
                                disabled={processing}
                            >
                                Giriş Yap
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
                <div className="text-right py-2 px-2">
                    <Link
                        href={route("register")}
                        className={classNames(
                            "px-1 rounded-none underline text-sm underline-offset-2",
                            "text-gray-500 dark:text-gray-400 hover:text-royal-950 dark:hover:text-lotus-400 focus:text-royal-950 dark:focus:text-lotus-400",
                            "focus:outline-none focus:ring-0"
                        )}
                    >
                        Bir hesabın yok mu?
                    </Link>
                </div>
            </div>
        </CoreLayout>
    );
}
