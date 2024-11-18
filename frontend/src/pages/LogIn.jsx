import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
function LogIn() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch("/api/v1/login-user", {
        headers: { "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === true) {
        sessionStorage.setItem("token", data.id);
        setLoading(false);
        return navigate(`/main/${data.id}`);
      } else {
        return alert(data);
      }
    } catch (err) {
      console.log(err);
      setLoading(false);
      return alert("Something Went Wrong");
    }
  }
  return (
    <div className="w-full h-[100vh] flex justify-start items-start bg-zinc-900">
      <div className="w-1/2 h-full bg-zinc-950"></div>
      <form
        onSubmit={handleSubmit}
        className="w-1/2 h-full bg-zinc-900 flex flex-col justify-center items-start p-32 relative"
      >
        <Link
          to={"/"}
          className="px-4 py-2 border-[1px] border-secondary top-10 left-10 rounded-full absolute text-sm text-secondary cursor-pointer hover:bg-secondary hover:text-white"
        >
          Home
        </Link>
        <div className="w-full flex flex-col justify-start items-start">
          <h1 className=" font-normal text-base mt-1 text-secondary">
            Connect To ZanVault
          </h1>
          <h1 className="text-white font-semibold text-2xl">
            Login to your account
          </h1>
          <div className="flex flex-col mt-4 w-full gap-1">
            <h1 className="text-white font-normal">Username</h1>
            <input
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              placeholder="Enter Your Username"
              className="w-full bg-zinc-800 border-zinc-200 border-[1px] rounded-full p-1 px-2 text-sm text-white font-normal"
            />
          </div>
          <div className="flex flex-col mt-4 w-full gap-1">
            <h1 className="text-white font-normal">Password</h1>
            <input
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              type="password"
              placeholder="Enter Your Password"
              className="w-full bg-zinc-800 border-zinc-200 border-[1px] rounded-full p-1 px-2 text-sm text-white font-normal"
            />
          </div>
          <div className="flex flex-col mt-4 w-full gap-1 justify-center items-end">
            <button
              type="submit"
              className="px-4 py-2 bg-secondary rounded-full text-white hover:bg-green-900"
            >
              {loading ? "Loading" : "Log In"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default LogIn;
