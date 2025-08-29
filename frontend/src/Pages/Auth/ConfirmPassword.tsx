import { useEffect, FormEventHandler } from "react";
import CoreLayout from "@/Layouts/Core";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { useForm } from "@inertiajs/react";

export default function ConfirmPassword() {
    const { data, setData, post, processing, errors, reset } = useForm({
        password: "",
    });

    useEffect(() => {
        return () => {
            reset("password");
        };
    }, []);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route("password.confirm"));
    };

    return (
        <CoreLayout title="Şifre">
            <div className="mt-10 sm:max-w-md mx-auto">
                <div className="p-6 border-y sm:border sm:rounded border-gray-300 dark:border-shark-950">
                    <div className="mb-6 space-y-2">
                        <h1 className="text-lg text-center mt-2 text-royal-950 dark:text-FFF2D7 font-medium tracking-wider uppercase">
                            Güvenlik
                        </h1>
                        <h1 className="text-sm text-center">
                            Bu, uygulamanın güvenli bir alanıdır. Lütfen devam
                            etmeden önce şifreyi girin.
                        </h1>
                    </div>

                    <form onSubmit={submit}>
                        <div className="mt-4">
                            <InputLabel htmlFor="password" value="Password" />

                            <TextInput
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                className="mt-1 block w-full"
                                isFocused={true}
                                onChange={(e) =>
                                    setData("password", e.target.value)
                                }
                            />

                            <InputError
                                message={errors.password}
                                className="mt-2"
                            />
                        </div>

                        <div className="flex items-center justify-end mt-4">
                            <PrimaryButton
                                className="ms-4"
                                disabled={processing}
                            >
                                Onayla
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>
        </CoreLayout>
    );
}
