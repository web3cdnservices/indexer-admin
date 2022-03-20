// Copyright 2020-2022 SubQuery Pte Ltd authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useCallback, useState, VFC } from 'react';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';

import { ProjectDetails } from 'hooks/projectHook';
import { projectId } from 'utils/project';

import ProjectDetailsView from './projectDetailsView';
import ProjectLogView from './projectLogView';

enum TabbarItem {
  ProjectDetails,
  NodeLog,
}

type Props = {
  id: string;
  project: ProjectDetails;
};

const ProjectTabbarView: VFC<Props> = ({ id, project }) => {
  const [value, setValue] = useState<TabbarItem>(TabbarItem.ProjectDetails);

  const handleChange = (_: any, newValue: TabbarItem) => {
    setValue(newValue);
  };

  const renderContent = useCallback(() => {
    switch (value) {
      case TabbarItem.NodeLog:
        return <ProjectLogView container={`node_${projectId(id)}`} />;
      default:
        return <ProjectDetailsView id={id} project={project} />;
    }
  }, [value]);

  return (
    <div style={{ marginTop: 30 }}>
      <Tabs value={value} onChange={handleChange} textColor="primary" indicatorColor="primary">
        <Tab value={TabbarItem.ProjectDetails} label="Project Details" />
        <Tab value={TabbarItem.NodeLog} label="Service Log" />
      </Tabs>
      {renderContent()}
    </div>
  );
};

export default ProjectTabbarView;
