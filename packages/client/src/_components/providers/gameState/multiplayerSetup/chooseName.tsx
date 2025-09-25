import type { User } from "@/types";
import { trpc } from "@/utils/trpc";
import { Dispatch, SetStateAction, useState } from "react";


export function ChooseName({ setUser }: { setUser: Dispatch<SetStateAction<User>>; }) {
  const [userNameInput, setUserNameInput] = useState("");
  const newUserMutation = trpc.user.createUser.useMutation({
    onSuccess: (user) => {
      setUser({ ...user });
    },
    onError: (err) => {
      console.error(err.message);
    },
  });

  function newUser() {
    newUserMutation.mutate(userNameInput);
  }

  return (
    <div className="w-full h-full bg-neutral-300 flex justify-center items-center ">
      <div className="bg-white flex flex-col justify-center items-center w-1/4 rounded-lg p-4 text-black">
        <h4 className="text-xl font-bold mb-2 text-neutral-800">
          Choose a Name
        </h4>
        <input
          type="text"
          required
          className="p-2 border-1 rounded w-full mb-2 outline-0 focus:ring focus:ring-black"
          value={userNameInput}
          placeholder="gerald"
          onChange={(e) => setUserNameInput(e.target.value)} />
        <button
          className="bg-neutral-500 text-white py-2 rounded hover:bg-neutral-600 cursor-pointer w-full "
          onClick={newUser}
        >
          submit
        </button>
      </div>
    </div>
  );
}
