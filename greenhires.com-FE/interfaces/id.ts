import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

export const idSchema = z.string().uuid().default(uuidv4());
