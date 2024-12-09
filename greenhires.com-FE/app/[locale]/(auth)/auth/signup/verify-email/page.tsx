import Verification from "@/modules/Auth/register-form/Verification";
import { Stack } from "@mui/material";

interface PageProps {
  params: { slug: string[] };
  searchParams?: Record<string, any>;
}

export default async function VerifyEmailPage({
  params,
  searchParams,
}: PageProps) {
  return (
    <div className="container h-screen">
      <div className="-mx-4 flex flex-wrap h-full">
        <div className="flex flex-row-reverse w-full px-4">
          <div className="shadow-three max-w-[600px]  rounded bg-slate-100 px-6 dark:bg-dark mb-24 mt-24 flex items-center">
            <Verification />
          </div>
        </div>
      </div>
    </div>
  );
}
