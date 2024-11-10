import { useState } from "react";

function Authentication() {
  const [currentAuth, setCurrentAuth] = useState(0);
  const [registerData, setRegisterData] = useState({
    name: "",
    username: "",
    password: "",
  });
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });
  async function RegisterUser() {
    try {
      const res = await fetch("/api/v1/create-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registerData),
      });
      const data = await res.text();
      alert(data);
      setRegisterData({
        name: "",
        username: "",
        password: "",
      });
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    }
  }
  async function LoginUser() {
    try {
      const res = await fetch("/api/v1/create-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });
      const data = await res.text();
      alert(data);
      setLoginData({ username: "", password: "" });
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    }
  }
  return (
    <div className="bg-primary w-full h-[100vh] relative flex justify-center items-center">
      <div className="w-36 h-36 rounded-full bg-secondary absolute top-[100px] left-[350px] z-10"></div>
      <div className="w-36 h-36 rounded-full bg-secondary absolute top-[400px] left-[770px] z-10"></div>
      <div className="w-[400px] h-[400px] rounded-full bg-secondary absolute top-[400px] left-[-80px] z-10"></div>
      <div className="w-[400px] h-[400px] rounded-full bg-secondary absolute top-[-200px] left-[1000px] z-10"></div>
      {/* BOX  */}
      <div className="w-[40%] h-[300px] z-10 bg-[rgb(200,200,200,0.4)] rounded-xl flex flex-col justify-between items-start backdrop-blur-sm border-[1px] border-white p-4">
        <div className="w-full p-2 flex justify-center items-center gap-2">
          <div
            onClick={() => setCurrentAuth(0)}
            className={`p-2 px-4 ${
              currentAuth === 0
                ? "bg-secondary text-black border-black border-2"
                : "text-white"
            } rounded-full cursor-pointer`}
          >
            <h1>Log In</h1>
          </div>
          <div
            onClick={() => setCurrentAuth(1)}
            className={`p-2 px-4 ${
              currentAuth === 1
                ? "bg-secondary text-black border-black border-2"
                : "text-white"
            } rounded-full cursor-pointer`}
          >
            <h1>Register</h1>
          </div>
        </div>

        {currentAuth === 0 ? (
          <div className="flex flex-col w-full gap-4 px-4 mt-4">
            <input
              value={loginData.username}
              onChange={(e) =>
                setLoginData({ ...loginData, email: e.target.value })
              }
              placeholder="Enter Email Address"
              className="w-full border-b-[1px] bg-transparent outline-none text-white "
            />
            <input
              value={loginData.password}
              onChange={(e) =>
                setLoginData({ ...loginData, password: e.target.value })
              }
              type="password"
              placeholder="Enter Password"
              className="w-full border-b-[1px] bg-transparent outline-none text-white"
            />
          </div>
        ) : (
          <div className="flex flex-col w-full gap-4 px-4 mt-4">
            <input
              value={registerData.name}
              onChange={(e) =>
                setRegisterData({
                  ...registerData,
                  name: e.target.value,
                })
              }
              placeholder="Enter Name"
              className="w-full border-b-[1px] bg-transparent outline-none text-white "
            />
            <input
              value={registerData.username}
              onChange={(e) =>
                setRegisterData({
                  ...registerData,
                  username: e.target.value,
                })
              }
              placeholder="Enter Username Address"
              className="w-full border-b-[1px] bg-transparent outline-none text-white "
            />
            <input
              value={registerData.password}
              onChange={(e) =>
                setRegisterData({
                  ...registerData,
                  password: e.target.value,
                })
              }
              type="password"
              placeholder="Enter Password"
              className="w-full border-b-[1px] bg-transparent outline-none text-white"
            />
          </div>
        )}
        <div className="w-full p-4 flex justify-center items-center">
          <button
            onClick={RegisterUser}
            className="bg-secondary w-full p-2 rounded-full font-normal hover:bg-yellow-600 transition-all duration-300 border-2 border-black"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

export default Authentication;
