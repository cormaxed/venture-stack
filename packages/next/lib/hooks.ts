import useSWR from "swr";
import { useEffect, useState } from "react";
import { useStoreActions, useStoreState } from "easy-peasy";
import { fetcher } from "./fetcher";
import { Profile, ProjectType, Projects, Task } from "../types/types";
import logger from "./client-logger";

export const useUserProjects = () => {
  const { data, mutate, error } = useSWR<Projects>(
    encodeURI("/project?structure=flat&types=user"),
    fetcher
  );

  return {
    projects: data,
    mutate,
    isLoading: !data && !error,
    error,
  };
};

export const useProjects = (
  structure: "flat" | "tree" = "tree",
  types: Array<ProjectType> = null
) => {
  const typeQuery = types ? `&types=${types.join("&type=")}` : "";
  const { data, mutate, error } = useSWR<Projects>(
    encodeURI(`/project?structure=${structure}${typeQuery}`),
    fetcher
  );

  // refresh projects when a project is mutated
  const lastProjectMutation = useStoreState(
    (state: any) => state.lastProjectMutation
  );
  useEffect(() => {
    mutate();
  }, [lastProjectMutation, mutate]);

  return {
    projects: data,
    mutate,
    isLoading: !data && !error,
    error,
  };
};

export const useTasks = (projectId: string) => {
  const { data, error } = useSWR<Task[]>(
    projectId ? `/task?projectId=${projectId}` : null,
    fetcher
  );

  return {
    data,
    isLoading: !data && !error,
    error,
  };
};

export const useMe = () => {
  const { data, error } = useSWR<Profile>("/me", fetcher);

  return {
    profile: data,
    isLoading: !data && !error,
    error,
  };
};

export const useTask = (
  projectId: string,
  lastTaskMutation: Task
): { data: Array<Task>; isLoading: boolean; error: Error } => {
  const [data, setData] = useState([] as Task[]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (projectId) {
          setData(await fetcher(`/task?projectId=${projectId}`));
        }
        setIsLoading(false);
      } catch (e) {
        logger.error(e);
        setError(e);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [projectId, lastTaskMutation]);

  return { data, isLoading, error };
};

export const useProfile = () => {
  const setActiveProject = useStoreActions(
    (state: any) => state.changeActiveProject
  );
  const setProfile = useStoreActions((state: any) => state.setProfile);

  const { profile, isLoading, error } = useMe();

  useEffect(() => {
    if (profile) {
      setProfile(profile);
      setActiveProject(profile.defaultProject);
    }
  }, [profile, setActiveProject, setProfile]);

  return { profile, isLoading, error };
};
