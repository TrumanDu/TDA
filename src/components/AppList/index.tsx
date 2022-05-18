/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  IconPlusStroked,
  IconListView,
  IconSearch,
  IconFlowChartStroked,
  IconDeleteStroked,
  IconKanban,
} from '@douyinfe/semi-icons';
import { Row, Col, Button, Input, List, Modal } from '@douyinfe/semi-ui';
import { CompositionEvent, useEffect, useState } from 'react';

import './index.css';

const AppList = (props: {
  onNew: any;
  onSelect: any;
  dataSource: any;
  channel: string;
}) => {
  const { onNew, onSelect, dataSource, channel } = props;
  const [focusIndex, setFocusIndex] = useState<number>();
  const [searchKey, setSearchKey] = useState<string>();
  const [listData, setListData] = useState<[]>([]);

  const onSearch = (
    search: string | React.CompositionEvent<HTMLInputElement> | null
  ) => {
    let newList;
    if (search) {
      newList = dataSource.filter(
        (item: { name: (string | CompositionEvent<HTMLInputElement>)[] }) =>
          item.name.includes(search)
      );
    } else {
      newList = dataSource;
    }
    setSearchKey(search);
    setListData(newList);
  };

  useEffect(() => {
    setListData(dataSource);
  }, [dataSource]);

  const handleDelete = (name: string) => {
    Modal.warning({
      title: 'Are you sure delete?',
      onOk: () => {
        window.electron.ipcRenderer.send(channel, 'delete', { name });
      },
    });
  };

  return (
    <>
      <Row
        style={{
          marginTop: '5px',
          marginBottom: '5px',
        }}
      >
        <Col span={6} offset={6}>
          <Button
            icon={<IconPlusStroked />}
            theme="solid"
            style={{ marginRight: 10 }}
            onClick={onNew}
          >
            New
          </Button>
        </Col>
        <Col span={6} offset={6} style={{ textAlign: 'right' }}>
          <Button icon={<IconListView />} theme="borderless" type="tertiary" />
        </Col>
      </Row>
      <div
        style={{
          width: '100%',
          height: '1px',
          borderTop: '1px solid #d5d5d5',
        }}
      />
      <List
        className="mind-map-list"
        header={
          <Input
            onCompositionEnd={(v) => onSearch(v)}
            onChange={(v) => (!v ? onSearch(null) : onSearch(v))}
            placeholder="Search"
            value={searchKey}
            prefix={<IconSearch />}
          />
        }
        dataSource={listData}
        renderItem={(item: MindMapItem, index) => (
          <List.Item
            className={index === focusIndex ? 'mind-map-list-focus-item' : ''}
            onClick={() => {
              setFocusIndex(index);
              onSelect(item);
            }}
            header={
              item.name.indexOf('mind') > 0 ? (
                <IconFlowChartStroked
                  style={{ color: '#9C27B0' }}
                  size="large"
                />
              ) : (
                <IconKanban style={{ color: '#0062d6' }} size="large" />
              )
            }
            main={
              <div>
                <span
                  style={{
                    color: 'var(--semi-color-text-0)',
                    fontWeight: 500,
                  }}
                >
                  {item.name.substring(0, item.name.indexOf('.'))}
                </span>
              </div>
            }
            extra={
              <Button
                style={{ display: 'none' }}
                theme="borderless"
                type="danger"
                onClick={() => handleDelete(item.name)}
                icon={<IconDeleteStroked />}
              />
            }
          />
        )}
      />
    </>
  );
};

export default AppList;
