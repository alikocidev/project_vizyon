import CoreLayout from "@/Layouts/Core";
import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Link, useForm } from "@inertiajs/react";
import { FormEventHandler } from "react";
import SecondaryButton from "@/Components/SecondaryButton";
import Alert from "@/Components/Alert";

export default function ForgotPassword({ status }: { status?: string }) {
    const { data, setData, post, processing, errors } = useForm({
        email: "",
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route("password.email"));
    };

    return (
        <CoreLayout title="Şifremi Unuttum">
            <div className="mt-10 sm:max-w-md mx-auto">
                <div className="p-6 border-y sm:border sm:rounded border-gray-300 dark:border-shark-950">
                    <div className="mb-6 space-y-2">
                        <h1 className="text-lg text-center text-royal-950 dark:text-FFF2D7 font-medium tracking-wider uppercase">
                            Şifre Yenile
                        </h1>
                        <h1 className="text-sm text-center">
                            Şifre yenileme bağlantısını gönderebilmemiz için
                            e-posta adresinize ihtiyacımız var.
                        </h1>
                    </div>
                    {status && <Alert type="info">{status}</Alert>}
                    <form onSubmit={submit}>
                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="block w-full"
                            isFocused={true}
                            onChange={(e) => setData("email", e.target.value)}
                            placeholder="Email"
                            required
                        />
                        <InputError message={errors.email} className="mt-2" />
                        <div className="flex flex-col items-center justify-center mt-6 gap-3">
                            <PrimaryButton
                                type="submit"
                                disabled={processing}
                                className="w-full"
                            >
                                <h1>E-posta Şifre Sıfırlama Bağlantısı</h1>
                            </PrimaryButton>
                            <Link
                                type="button"
                                href={route("login")}
                                className="w-full"
                            >
                                <SecondaryButton className="w-full">
                                    Geri Dön
                                </SecondaryButton>
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </CoreLayout>
    );
}
