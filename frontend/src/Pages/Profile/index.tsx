import DeleteUserForm from "@/Pages/Profile/Partials/DeleteUserForm";
import UpdatePasswordForm from "@/Pages/Profile/Partials/UpdatePasswordForm";
import UpdateProfileInformationForm from "@/Pages/Profile/Partials/UpdateProfileInformationForm";
import { Head } from "@inertiajs/react";
import { PageProps } from "@/types";
import CoreLayout from "@/Layouts/Core";

export default function Edit({
    auth,
    mustVerifyEmail,
    status,
}: PageProps<{ mustVerifyEmail: boolean; status?: string }>) {
    return (
        <CoreLayout user={auth.user} title="Profile">
            <Head title="Profile" />
            <div className="w-full lg:w-4/5 lg:mx-auto mt-4 sm:mt-8 px-4 sm:px-8">
                <div className="space-y-4">
                    <div className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow rounded sm:rounded-lg">
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            className="max-w-xl"
                        />
                    </div>

                    <div className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow rounded sm:rounded-lg">
                        <UpdatePasswordForm className="max-w-xl" />
                    </div>

                    <div className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow rounded sm:rounded-lg">
                        <DeleteUserForm className="max-w-xl" />
                    </div>
                </div>
            </div>
        </CoreLayout>
    );
}
