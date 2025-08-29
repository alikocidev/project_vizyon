import CoreLayout from "@/Layouts/Core";
import PrimaryButton from "@/Components/PrimaryButton";
import { Link, useForm } from "@inertiajs/react";
import { FormEventHandler } from "react";
import SecondaryButton from "@/Components/SecondaryButton";
import Loading from "@/Components/Loading";

export default function VerifyEmail({ status }: { status?: string }) {
    const { post, processing } = useForm({});

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route("verification.send"));
    };

    return (
        <CoreLayout title="Email Doğrulama">
            <div className="mt-10 sm:max-w-md mx-auto">
                <div className="p-6 border-y sm:border sm:rounded border-gray-300 dark:border-shark-950">
                    <div className="mb-6 space-y-2">
                        <h1 className="text-lg text-center mt-2 text-royal-950 dark:text-FFF2D7 font-medium tracking-wider uppercase">
                            Eposta Onayla
                        </h1>
                        <h1 className="text-sm text-center">
                            Kaydolduğunuz için teşekkürler! Başlamadan önce,
                            Eposta adresinizi doğrulayın. E-postayı
                            almadıysanız, size memnuniyetle tekrar göndereceğiz.
                        </h1>
                    </div>
                    {status === "verification-link-sent" && (
                        <div className="mb-4 font-medium text-sm text-green-600 dark:text-green-400">
                            Yeni bir doğrulama linki mail adresine gönderildi.
                        </div>
                    )}
                    <form onSubmit={submit}>
                        <div className="flex flex-col items-center justify-center mt-6 gap-3">
                            <PrimaryButton
                                type="submit"
                                disabled={processing}
                                className="w-full flex items-center justify-center gap-3"
                            >
                                <h1>Maili Tekrar Gönder</h1>
                                {true && <Loading />}
                            </PrimaryButton>
                            <Link href={route("login")} className="w-full">
                                <SecondaryButton className="w-full flex items-center justify-center">
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
