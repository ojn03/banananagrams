import { createNewBank } from "@/db/transactions/bank";
import { publicProcedure, router } from "@/trpc";
import { isString } from "@/validators";

const bankRouter = router({
  createNewBank: publicProcedure.input(isString).mutation(async (opts) => {
    const { input: roomCode } = opts;
    const bank = await createNewBank(roomCode);
    return bank;
  }),
});

export default bankRouter;
