// Copyright 2020-2022 SubQuery Pte Ltd authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Dispatch, FC, SetStateAction, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { Button } from '@subql/components';
import { Col, Collapse, Form, Input, Row, Select, Slider, Switch } from 'antd';

import { ButtonContainer } from 'components/primary';
import { useNodeVersions, useQueryVersions } from 'hooks/projectHook';
import { ProjectFormKey, StartIndexingSchema } from 'types/schemas';
import { isTrue } from 'utils/project';
import { START_PROJECT } from 'utils/queries';

const { Item } = Form;

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
  const [showInput, setShowInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const { id } = useParams() as { id: string };
  const nodeVersions = useNodeVersions(id);
  const queryVersions = useQueryVersions(id);
  const [startProjectRequest, { loading: startProjectLoading }] = useMutation(START_PROJECT);

  const initialValues = {
    purgeDB: false,
    batchSize: 30,
    workers: 2,
    cache: 50,
  };

  const onSwitchChange = () => {
    setShowInput(!showInput);
  };

  const handleSubmit = (setVisible: Dispatch<SetStateAction<boolean>>) => async (values: any) => {
    setLoading(true);
    try {
      await startProjectRequest({
        variables: {
          ...values,
          networkDictionary: values.networkDictionary ?? '',
          purgeDB: isTrue(values.purgeDB),
          cpu: 1,
          memory: 1,
          timeout: 0,
          poiEnabled: true,
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
      initialValues={initialValues}
    >
      <Form.Item
        label="Network Endpoint"
        name={ProjectFormKey.networkEndpoint}
        rules={[getYupRule(ProjectFormKey.networkEndpoint)]}
      >
        <Input placeholder="wss://polkadot.api.onfinality.io/public-ws" />
      </Form.Item>

      <Form.Item
        name={ProjectFormKey.networkDictionary}
        label="Is Project Dictionary"
        valuePropName="checked"
      >
        <Switch onChange={onSwitchChange} defaultChecked checked={showInput} />
      </Form.Item>

      {showInput && (
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
      <Form.Item name="purgeDB" label="Purge Db" valuePropName="checked">
        <Switch />
      </Form.Item>
      <Collapse defaultActiveKey="1">
        <Collapse.Panel header="Advanced Options" key="1">
          <Form.Item name="batchSize" label="Batch Size">
            <Slider min={1} max={100} />
          </Form.Item>

          <Form.Item name="workers" label="Workers">
            <Slider min={1} max={8} />
          </Form.Item>

          <Form.Item name="cache" label="Cache Number">
            <Slider min={1} max={100} />
          </Form.Item>
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
