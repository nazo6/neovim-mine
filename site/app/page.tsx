import { DataFetcher } from "./components/DataFetcher";
import { Suspense } from "react";
import { HomeProvider } from "./page_client";
import { Control } from "./components/Control";

export default function Home() {
  return (
    <HomeProvider>
      <Suspense
        fallback={
          <div className="flex justify-center items-center flex-grow">
            <div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent">
            </div>
          </div>
        }
      >
        <div className="flex flex-col lg:flex-row lg:gap-2">
          <div className="lg:w-1/3">
            <div className="lg:sticky lg:top-1">
              <Control />
            </div>
          </div>
          <div className="lg:flex-grow">
            {/* @ts-expect-error Server Component */}
            <DataFetcher />
          </div>
        </div>
      </Suspense>
    </HomeProvider>
  );
}
