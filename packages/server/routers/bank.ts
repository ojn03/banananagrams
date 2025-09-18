import { createNewBank, dump } from "@/db/transactions/bank";
import { publicProcedure, router } from "@/trpc";
import { isString, validateDumpInput } from "@/validators";

const bankRouter = router({
  createNewBank: publicProcedure.input(isString).mutation(async (opts) => {
    const { input: roomCode } = opts;
    const bank = await createNewBank(roomCode);
    return bank;
  }),
  dump: publicProcedure.input(validateDumpInput).mutation(async (opts) => {
    const {
      input: { roomCode, letter },
    } = opts;
    return await dump(roomCode, letter);
  }),
});

export default bankRouter;
