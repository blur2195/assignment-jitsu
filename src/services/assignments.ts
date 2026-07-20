import { Assignment } from "types";
import { createCrudService } from "./createCrudService";

export const assignmentServices = createCrudService<Assignment>("/assignments");
