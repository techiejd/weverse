import { cookies } from "next/headers";

const Page = () => {
  const cookieStore = cookies();
  return (
    <div className="overflow-hidden">
      {cookieStore.getAll().map((cookie) => (
        <div key={cookie.name}>
          <p>
            <span style={{ wordWrap: "break-word" }}>Name: {cookie.name}</span>
          </p>
          <p>
            <span style={{ wordWrap: "break-word" }}>
              Value: {cookie.value}
            </span>
          </p>
        </div>
      ))}
    </div>
  );
};

export default Page;
