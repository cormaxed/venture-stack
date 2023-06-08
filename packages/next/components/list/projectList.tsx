import { Icon } from "@chakra-ui/icons";
import { List, ListItem, HStack, Text } from "@chakra-ui/react";
import {
  MdInbox,
  MdToday,
  MdCalendarViewMonth,
  MdCircle,
  MdGridView,
} from "react-icons/md";

import { GiWaterDrop } from "react-icons/gi";
import { useStoreActions, useStoreState } from "easy-peasy";
import { Project } from "../../types/types";

interface ProjectNode extends Project {
  children?: ProjectNode[];
}

interface ProjectProp {
  project: ProjectNode;
  level: number;
}

interface ProjectListProp {
  projects: Project[];
}

const iconMap = {
  InboxIcon: { icon: MdInbox, boxSize: 6, color: "blue.300" },
  TodayIcon: { icon: MdToday, boxSize: 6, color: "green.300" },
  UpcomingIcon: { icon: MdCalendarViewMonth, boxSize: 6, color: "purple.300" },
  FilterIcon: { icon: MdGridView, boxSize: 6, color: "orange.600" },
  CircleIcon: { icon: MdCircle, boxSize: 4, color: "gray.600" },
  FavIcon: { icon: GiWaterDrop, boxSize: 5, color: "green.600" },
};

const getIcon = (project: Project) => {
  let { color } = iconMap[project.icon];
  const { icon, boxSize } = iconMap[project.icon];

  if (project.color) {
    color = project.color;
  }

  return <Icon as={icon} boxSize={boxSize} color={color} />;
};

const ProjectListItem = (props: ProjectProp) => {
  const { project, level } = props;
  const activeProject = useStoreState((state: any) => state.activeProject);
  const setActiveProject = useStoreActions(
    (state: any) => state.changeActiveProject
  );
  return (
    <>
      <ListItem
        marginTop="2px"
        _hover={{ backgroundColor: "gray.200" }}
        backgroundColor={activeProject.id === project.id ? "gray.200" : ""}
        rounded="md"
        onClick={() => {
          setActiveProject({
            id: project.id,
            name: project.name,
            subtype: project.subtype,
          });
        }}
      >
        <HStack spacing={1}>
          {getIcon(project)}
          <Text paddingLeft={2} fontSize="xl">
            {project.name}
          </Text>
        </HStack>
      </ListItem>
      {project.children && (
        <List marginLeft={level * 4}>
          {project.children.map((child) => (
            <ProjectListItem key={child.id} project={child} level={level + 1} />
          ))}
        </List>
      )}
    </>
  );
};

const ProjectList = (props: ProjectListProp) => {
  const { projects } = props;
  return (
    <List>
      {projects.map((project) => (
        <ProjectListItem key={project.id} project={project} level={1} />
      ))}
    </List>
  );
};

export default ProjectList;
