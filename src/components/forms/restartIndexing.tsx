// Copyright 2020-2022 SubQuery Pte Ltd authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Dispatch, FC, SetStateAction, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { Button } from '@subql/components';
import { Col, Collapse, Form, Input, Row, Select, Slider, Switch } from 'antd';

import { ButtonContainer } from 'components/primary';
import { useNodeVersions, useQueryVersions } from 'hooks/projectHook';
import {
  defaultAdvancedConfig,
  defaultBaseConfig,
  ProjectFormKey,
  StartIndexingSchema,
} from 'types/schemas';
import { START_PROJECT } from 'utils/queries';

const { poiEnabled, timeout } = defaultAdvancedConfig;
const { Item } = Form;

const advancedOptionsConfig = [
  {
    name: ProjectFormKey.batchSize,
    label: 'Batch Size',
    tooltip: 'Batch size of blocks to fetch in one round',
    min: 1,
    max: 100,
  },
  {
    name: ProjectFormKey.workers,
    label: 'Workers',
    tooltip: 'Number of worker threads to use for fetching and processing blocks.',
    min: 1,
    max: 8,
  },
  {
    name: ProjectFormKey.cache,
    label: 'Cache Number',
    tooltip: 'The number of items to cache in memory for faster processing.',
    min: 1,
    max: 500,
  },
  {
    name: ProjectFormKey.cpu,
    label: 'Number of Cpus',
    tooltip: 'The number of CPUs that can be used by the subquery indexer for this project.',
    min: 1,
    max: 8,
  },
  {
    name: ProjectFormKey.memory,
    label: 'Memory',
    tooltip: 'The amount of memory that can be used by the subquery indexer for this project.',
    min: 1,
    max: 8192,
  },
];

const getYupRule = (field: string) => ({
  validator(_: any, value: any) {
    try {
      StartIndexingSchema.validateSyncAt(field, { [field]: value });
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  },
});

function displayVersion(versions: string[]) {
  return versions.map((version, i) => (
    <Select.Option key={i} value={version}>
      {version}
    </Select.Option>
  ));
}

export const IndexingForm: FC<{ setVisible: Dispatch<SetStateAction<boolean>> }> = ({
  setVisible,
}) => {
  const [form] = Form.useForm();
  const [showInput, setShowInput] = useState(true);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const { id } = useParams() as { id: string };
  const nodeVersions = useNodeVersions(id);
  const queryVersions = useQueryVersions(id);
  const [startProjectRequest, { loading: startProjectLoading }] = useMutation(START_PROJECT);

  const onSwitchChange = () => {
    setShowInput(!showInput);
  };

  const handleSubmit = (setVisible: Dispatch<SetStateAction<boolean>>) => async (values: any) => {
    setLoading(true);
    try {
      await startProjectRequest({
        variables: {
          ...values,
          poiEnabled,
          timeout,
          networkDictionary: values.networkDictionary ?? '',
          id,
        },
      });
      form.resetFields();
      setLoading(startProjectLoading);
      setVisible(false);
    } catch (error: any) {
      setSubmitError('Unable to request indexing of project');
      setLoading(false);
    }
  };

  return (
    <Form
      form={form}
      name="form"
      layout="vertical"
      onFinish={handleSubmit(setVisible)}
      initialValues={{ ...defaultBaseConfig, ...defaultAdvancedConfig }}
    >
      <Form.Item
        label="Network Endpoint"
        name={ProjectFormKey.networkEndpoint}
        rules={[getYupRule(ProjectFormKey.networkEndpoint)]}
      >
        <Input placeholder="wss://polkadot.api.onfinality.io/public-ws" />
      </Form.Item>

      <Form.Item label="Is Project Dictionary" valuePropName="checked">
        <Switch onChange={onSwitchChange} defaultChecked checked={showInput} />
      </Form.Item>

      {!showInput && (
        <Item
          label="Dictionary Endpoint"
          name={ProjectFormKey.networkDictionary}
          rules={[getYupRule(ProjectFormKey.networkEndpoint)]}
        >
          <Input placeholder="https://api.subquery.network/sq/subquery/dictionary-polkadot" />
        </Item>
      )}
      <Row gutter={16}>
        <Col span={12}>
          <Item
            label="Indexer Version"
            name={ProjectFormKey.nodeVersion}
            rules={[getYupRule(ProjectFormKey.nodeVersion)]}
          >
            <Select>{displayVersion(nodeVersions)}</Select>
          </Item>
        </Col>
        <Col span={12}>
          <Item
            label="Query Version"
            name={ProjectFormKey.queryVersion}
            rules={[getYupRule(ProjectFormKey.queryVersion)]}
          >
            <Select>{displayVersion(queryVersions)}</Select>
          </Item>
        </Col>
      </Row>
      <Form.Item
        name="purgeDB"
        label="Purge Db"
        valuePropName="checked"
        tooltip="Clean the database dropping project schemas and tables on start of indexing."
      >
        <Switch />
      </Form.Item>
      <Collapse defaultActiveKey="1">
        <Collapse.Panel header="Advanced Options" key="1">
          {advancedOptionsConfig.map(({ name, label, tooltip, min, max }) => (
            <Form.Item name={name} label={label} tooltip={tooltip}>
              <Slider min={min} max={max} />
            </Form.Item>
          ))}
        </Collapse.Panel>
      </Collapse>
      {submitError && <Form.Item validateStatus="error" help={submitError} />}
      <Form.Item>
        <ButtonContainer align="right" mt={30}>
          <Button label="Submit" type="secondary" onClick={() => form.submit()} loading={loading}>
            Submit
          </Button>
        </ButtonContainer>
      </Form.Item>
      {}
    </Form>
  );
};
