import { moduleRedirect } from "@/actions/auth-action";
import { Cargos } from "@/enum/cargos.enum";
import { modulesRedirectHelper } from "@/helpers";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function RouterPage() {
  return await moduleRedirect();
}
