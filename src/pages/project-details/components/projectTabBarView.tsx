// Copyright 2020-2022 SubQuery Pte Ltd authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useCallback, useState, VFC } from 'react';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';

import { ProjectDetails } from 'hooks/projectHook';
import { projectId } from 'utils/project';

import ProjectLogView from '../../../components/logView';
import { ProjectPAYG } from '../payg/projectPayg';
import { ProjectConfig } from '../types';
import ProjectDetailsView from './projectDetailsView';

enum TabbarItem {
  ProjectDetails,
  NodeLog,
  PAYG,
}

type Props = {
  id: string;
  project: ProjectDetails;
  config: ProjectConfig;
};

const ProjectTabbarView: VFC<Props> = ({ id, project, config }) => {
  const [value, setValue] = useState<TabbarItem>(TabbarItem.PAYG);

  const handleChange = (_: any, newValue: TabbarItem) => {
    setValue(newValue);
  };

  const renderContent = useCallback(() => {
    switch (value) {
      case TabbarItem.NodeLog:
        return <ProjectLogView container={`node_${projectId(id)}`} height={650} />;
      case TabbarItem.ProjectDetails:
        return <ProjectDetailsView id={id} project={project} />;
      case TabbarItem.PAYG:
        return <ProjectPAYG id={id} config={config} />;
      default:
        return <div />;
    }
  }, [value]);

  return (
    <div style={{ marginTop: 30 }}>
      <Tabs value={value} onChange={handleChange} textColor="primary" indicatorColor="primary">
        <Tab value={TabbarItem.ProjectDetails} label="Project Details" />
        <Tab value={TabbarItem.NodeLog} label="Service Log" />
        <Tab value={TabbarItem.PAYG} label="Flex Plan" />
      </Tabs>
      {renderContent()}
    </div>
  );
};

export default ProjectTabbarView;
