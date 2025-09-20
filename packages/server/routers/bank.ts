import { createNewBank, dump } from "@/db/transactions/bank";
import { publicProcedure, router } from "@/trpc";
import { isString, validateDumpInput } from "@/validators";

const bankRouter = router({
  createNewBank: publicProcedure.input(isString).mutation(async (opts) => {
    const { input: roomCode } = opts;
    const bank = await createNewBank(roomCode).catch(err => console.error(err.message));
    return bank;
  }),
  dump: publicProcedure.input(validateDumpInput).mutation(async (opts) => {
    const {
      input: { roomCode, letter },
    } = opts;
    return await dump(roomCode, letter).catch(err => console.error(err.message));
  }),
});

export default bankRouter;
