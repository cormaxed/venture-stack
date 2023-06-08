import { createStore, action } from "easy-peasy";
import { Task } from "../types/types";

type Project = { id: string; name: string; subtype: string };

export const store = createStore({
  activeProject: { id: null, name: "Inbox", subtype: "task" } as Project,
  changeActiveProject: action((state: any, payload: Project) => {
    state.activeProject = payload;
  }),

  lastTaskMutation: { id: null },
  setLastTaskMutation: action((state: any, payload: any) => {
    state.lastTaskMutation = payload;
  }),

  lastProjectMutation: { id: null },
  setLastProjectMutation: action((state: any, payload: any) => {
    state.lastProjectMutation = payload;
  }),

  activeTask: {} as Task,
  setActiveTask: action((state: any, payload: Task) => {
    state.activeTask = payload;
  }),

  profile: {} as any,
  setProfile: action((state: any, payload: any) => {
    state.profile = payload;
  }),
});

export default store;
