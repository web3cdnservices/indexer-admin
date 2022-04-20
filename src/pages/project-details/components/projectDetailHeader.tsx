// Copyright 2020-2022 SubQuery Pte Ltd authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { FC } from 'react';
import styled from 'styled-components';

import Avatar from 'components/avatar';
import { Separator, Text } from 'components/primary';
import { TagItem } from 'components/tagItem';
import { ProjectDetails } from 'hooks/projectHook';
import { cidToBytes32 } from 'utils/ipfs';

import { ProjectStatus } from '../types';

type Props = {
  id: string;
  project: ProjectDetails;
  projectStatus: ProjectStatus;
};

const ProjectDetailsHeader: FC<Props> = ({ id, projectStatus, project }) => {
  return (
    <Container>
      <LeftContainer>
        <Avatar address={cidToBytes32(id)} size={100} />
        <ContentContainer>
          <Text fw="600" size={30}>
            {project.name}
          </Text>
          <Text fw="400" size={15}>
            {project.owner}
          </Text>
          <VersionContainer>
            <TagItem versionType="INDEXED NETWORK" value={project.metadata?.chain} />
            <Separator height={30} />
            <TagItem versionType="VERSION" value={`V${project.version ?? '1.0.0'}`} />
            <Separator height={30} />
            <TagItem versionType="PROJECT STATUS" value={projectStatus} />
          </VersionContainer>
        </ContentContainer>
      </LeftContainer>
    </Container>
  );
};

export default ProjectDetailsHeader;

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  min-height: 200px;
  padding-right: 32px;
`;

const LeftContainer = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  min-width: 685px;
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  margin-left: 40px;
`;

const VersionContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 25px;
  height: 50px;
  width: 450px;
`;
