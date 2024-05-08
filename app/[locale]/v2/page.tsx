import { cookies } from "next/headers";

const Page = () => {
  const cookieStore = cookies();
  return cookieStore.getAll().map((cookie) => (
    <div key={cookie.name}>
      <p>Name: {cookie.name}</p>
      <p>Value: {cookie.value}</p>
    </div>
  ));
};

export default Page;
