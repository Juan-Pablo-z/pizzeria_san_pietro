import { getUsers } from "@/actions/users-actions";
import { Metadata } from "next";
import UserManager from "./components/UserManager";

export const metadata: Metadata = {
  title: "Gestión de usuarios",
  description: "Gestiona los usuarios del restaurante",
};

const Page: React.FC = async () => {
  const [users] = await Promise.all([getUsers()]);
  if (!users) return null;
  return <UserManager users={users} />;
};

export default Page;
