// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { FC } from 'react';
import styled from 'styled-components';

import { Text } from 'components/primary';
import { ProjectDetails } from 'hooks/projectHook';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 350px;
  margin-top: 50px;
`;

const Separator = styled.div`
  display: flex;
  width: 100%;
  height: 1px;
  background-color: black;
`;

const ContentContainer = styled.div`
  display: flex;
  margin-top: 40px;
`;

const LeftContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-width: 500px;
  width: 45%;
`;

const BottomContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 50px;
`;

const RightContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-left: 80px;
`;

const InfoContainer = styled.div<{ mt?: number; ml?: number }>`
  display: flex;
  flex-direction: column;
  margin-left: ${({ ml }) => ml ?? 0}px;
  margin-top: ${({ mt }) => mt ?? 0}px;
`;

type InfoProps = {
  title: string;
  desc: string;
  ml?: number;
  mt?: number;
};

const InfoView: FC<InfoProps> = ({ title, desc, ml, mt }) => (
  <InfoContainer ml={ml} mt={mt}>
    <Text size={18}>{title}</Text>
    <Text mt={15} size={16} color="gray">
      {desc}
    </Text>
  </InfoContainer>
);

type Props = {
  id: string;
  project: ProjectDetails;
};

const ProjectDetailsView: FC<Props> = ({ id, project }) => {
  const { description, websiteUrl, codeUrl } = project;
  return (
    <Container>
      <Text fw="600" mb={10} size={20}>
        Project Details
      </Text>
      <Separator />
      <ContentContainer>
        <LeftContainer>
          <InfoView title="Description" desc={description} />
          <BottomContainer>
            <InfoView title="Created" desc="3 days ago" />
            <InfoView ml={150} title="Last Updated" desc="5 days ago" />
          </BottomContainer>
        </LeftContainer>
        <RightContainer>
          <InfoView title="Deployment ID" desc={id} />
          <InfoView mt={30} title="Website URL" desc={websiteUrl} />
          <InfoView mt={30} title="Source Code URL" desc={codeUrl} />
        </RightContainer>
      </ContentContainer>
    </Container>
  );
};

export default ProjectDetailsView;
