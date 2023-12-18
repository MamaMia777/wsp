import Image from "next/image";

const LoginPage = () => {
  return (
    <section
      className="fixed top-0 left-0 w-full h-screen  grid grid-cols-2"
      style={{ position: "fixed" }}
    >
      <div className="bg-[#18181b] p-5 flex flex-col justify-between">
        <div className="flex items-center gap-4 text-[1.3rem] text-[white]">
          <Image src={"/ui/Box.svg"} width={30} height={30} alt="wsp" />
          <span>wsp</span>
        </div>
        <Image
          src={"/logo.png"}
          width={100}
          height={50}
          alt="wsp"
          unoptimized
        />
      </div>
      <div className="flex items-center justify-center">
        <div className="flex flex-col gap-3">
          <h1>Sign in</h1>
          <button>Sing in with Email</button>
        </div>
      </div>
    </section>
  );
};
export default LoginPage;
