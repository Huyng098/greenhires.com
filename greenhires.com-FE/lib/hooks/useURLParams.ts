import { CategoryURLSearchParams } from "@/interfaces/general/category";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";

export const useURLParams = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const changeParams = (params: CategoryURLSearchParams) => {
    const new_params = { ...qs.parse(searchParams.toString()), ...params };
    const query_str = qs.stringify(new_params);
    router.push(`${pathname}?${query_str}`);
  };

  return {
    router,
    searchParams,
    changeParams,
  };
};
