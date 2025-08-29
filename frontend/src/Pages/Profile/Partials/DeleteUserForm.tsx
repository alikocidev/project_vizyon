import { useRef, useState, FormEventHandler } from "react";
import DangerButton from "@/Components/DangerButton";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import Modal from "@/Components/Modal";
import SecondaryButton from "@/Components/SecondaryButton";
import TextInput from "@/Components/TextInput";
import { useForm } from "@inertiajs/react";

export default function DeleteUserForm({
    className = "",
}: {
    className?: string;
}) {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef<HTMLInputElement>(null);

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
    } = useForm({
        password: "",
    });

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
    };

    const deleteUser: FormEventHandler = (e) => {
        e.preventDefault();

        destroy(route("profile.destroy"), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current?.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);

        reset();
    };

    return (
        <section className={`space-y-6 ${className}`}>
            <header>
                <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    Hesabı Sil
                </h2>

                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Hesabınız silindiğinde, tüm kaynakların ve verilerin kalıcı
                    olarak silinecektir.
                </p>
            </header>

            <DangerButton onClick={confirmUserDeletion}>
                Hesabı Sil
            </DangerButton>

            <Modal
                show={confirmingUserDeletion}
                onClose={closeModal}
                className="max-w-2xl"
            >
                <form onSubmit={deleteUser} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                        Hesabınızı silmek istediğinizden emin misiniz?
                    </h2>

                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        Hesabınız silindiğinde, tüm kaynakların ve verilerin
                        kalıcı olarak silinecektir.
                    </p>

                    <div className="mt-6">
                        <InputLabel
                            htmlFor="password"
                            value="Şifre"
                            className="sr-only"
                        />

                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            ref={passwordInput}
                            value={data.password}
                            onChange={(e) =>
                                setData("password", e.target.value)
                            }
                            className="mt-1 block w-3/4"
                            isFocused
                            placeholder="Şifre"
                        />

                        <InputError
                            message={errors.password}
                            className="mt-2"
                        />
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        <SecondaryButton onClick={closeModal}>
                            İptal
                        </SecondaryButton>

                        <DangerButton disabled={processing}>
                            Hesabı Sil
                        </DangerButton>
                    </div>
                </form>
            </Modal>
        </section>
    );
}
