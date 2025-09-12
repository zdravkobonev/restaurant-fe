import React, { useEffect, useMemo, useState } from "react";
import {
  Button,
  Table,
  Modal,
  Form,
  Input,
  Select,
  Popconfirm,
  Tag,
  Space,
} from "antd";
import type { SelectProps } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  fetchRoles,
  fetchUsers,
  createUser,
  updateUserRoles,
  removeUser,
} from "../../store/usersSlice";
import type { RootState } from "../../store/store";
import type { RoleOut, UserOut } from "../../api/users";

// ...using Select's `options` prop instead of <Option /> children

type RoleWithParent = RoleOut & {
  parent_id?: number | null;
  children?: RoleWithParent[];
};

const TagPreview: React.FC<{ roles: string[] }> = ({ roles }) => {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const [overflow, setOverflow] = React.useState(false);
  const [expanded, setExpanded] = React.useState(false);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const check = () => {
      const lh = parseFloat(getComputedStyle(el).lineHeight || "20");
      const maxH = lh * 2 + 8; // two lines + small padding
      setOverflow(el.scrollHeight > maxH + 1);
    };

    check();
    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => ro.disconnect();
  }, [roles]);

  const visible = roles.join(" ").length === 0 ? [] : roles;

  return (
    <div>
      <div
        ref={ref}
        className="overflow-hidden"
        style={{ maxHeight: expanded ? undefined : "3.6rem" }}
      >
        <div className="flex flex-wrap gap-y-2 items-start">
          {visible.map((r) => (
            <Tag key={r} color="blue">
              {r}
            </Tag>
          ))}
        </div>
      </div>
      {overflow && (
        <div className="w-full flex justify-center">
          <Button
            type="link"
            onClick={() => setExpanded((v) => !v)}
            className="!text-xs"
          >
            {expanded ? "Покажи по-малко" : `Виж всички (${roles.length})`}
          </Button>
        </div>
      )}
    </div>
  );
};

const UsersPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { users, roles } = useAppSelector((s: RootState) => s.users);

  const [createVisible, setCreateVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<UserOut | null>(null);

  const [form] = Form.useForm();
  const [editForm] = Form.useForm();

  // prepare grouped options for Select: if roles have parent_id, group by parent
  const roleOptions: SelectProps<number>["options"] = useMemo(() => {
    const rlist = (roles || []) as RoleWithParent[];
    // prefer nested children structure if present
    const hasChildren = rlist.some(
      (r) => Array.isArray(r.children) && r.children!.length > 0
    );
    if (hasChildren) {
      const groups = rlist
        .filter((r) => Array.isArray(r.children) && r.children!.length > 0)
        .map((p) => ({
          label: <span>{p.name}</span>,
          title: p.name,
          options: (p.children || []).map((c) => ({
            label: <span>{c.name}</span>,
            value: c.id,
          })),
        }));

      // include roles that are not parents (no children) as flat options
      const nonParents = rlist
        .filter(
          (r) => !Array.isArray(r.children) || (r.children || []).length === 0
        )
        .map((r) => ({ label: r.name, value: r.id }));

      return [...groups, ...nonParents];
    }

    // fallback to parent_id grouping if present
    const hasParent = rlist.some(
      (r) => r && r.parent_id !== undefined && r.parent_id !== null
    );
    if (!hasParent) {
      return rlist.map((r) => ({ label: r.name, value: r.id }));
    }

    const parents = rlist.filter(
      (r) => r.parent_id === undefined || r.parent_id === null
    );
    const children = rlist.filter(
      (r) => r.parent_id !== undefined && r.parent_id !== null
    );

    return parents.map((p) => ({
      label: <span>{p.name}</span>,
      title: p.name,
      options: children
        .filter((c) => c.parent_id === p.id)
        .map((c) => ({ label: <span>{c.name}</span>, value: c.id })),
    }));
  }, [roles]);

  // flattened list of all roles (parents + their children) to map names->ids
  const flattenedRoles: RoleWithParent[] = useMemo(() => {
    const rlist = (roles || []) as RoleWithParent[];
    const withChildren: RoleWithParent[] = [];
    rlist.forEach((r) => {
      withChildren.push(r);
      if (Array.isArray(r.children)) {
        r.children.forEach((c) => withChildren.push(c));
      }
    });
    return withChildren;
  }, [roles]);

  useEffect(() => {
    dispatch(fetchRoles());
    dispatch(fetchUsers());
  }, [dispatch]);

  const columns = useMemo(
    () => [
      { title: "ID", dataIndex: "id", key: "id", width: "10%" },
      {
        title: "Потребителско име",
        dataIndex: "username",
        key: "username",
        width: "20%",
      },
      {
        title: "Роли и права",
        dataIndex: "roles",
        key: "roles",
        width: "60%",
        render: (roles: string[]) => <TagPreview roles={roles} />,
      },
      {
        title: "Действия",
        key: "actions",
        width: "10%",
        render: (_: unknown, record: UserOut) => (
          <Space>
            <Button
              icon={<EditOutlined />}
              onClick={() => {
                setEditingUser(record);
                editForm.setFieldsValue({ roles: [] });
                // map role names to ids by matching the flattened role list (includes children)
                const roleIds = (record.roles || [])
                  .map(
                    (r: string) => flattenedRoles.find((x) => x.name === r)?.id
                  )
                  .filter(Boolean) as number[];
                editForm.setFieldsValue({ roles: roleIds });
                setEditVisible(true);
              }}
            />
            <Popconfirm
              title="Сигурни ли сте, че искате да изтриете потребителя?"
              onConfirm={() => dispatch(removeUser(record.id))}
              okText="Да"
              cancelText="Не"
              okButtonProps={{
                className:
                  "!bg-gradient-to-br !from-blue-600 !to-cyan-400 rounded-md flex items-center justify-center text-white font-semibold",
              }}
            >
              <Button danger icon={<DeleteOutlined />} />
            </Popconfirm>
          </Space>
        ),
      },
    ],
    [flattenedRoles, editForm, dispatch]
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Потребители</h1>
        <Button
          className="!bg-gradient-to-br !from-blue-600 !to-cyan-400 rounded-md flex items-center justify-center text-white font-semibold"
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setCreateVisible(true)}
        >
          Създай потребител
        </Button>
      </div>

      <Table rowKey="id" columns={columns} dataSource={users} />

      <Modal
        title="Създай потребител"
        open={createVisible}
        closable={false}
        onCancel={() => setCreateVisible(false)}
        okText="Създай"
        cancelText="Отказ"
        okButtonProps={{
          className:
            "!bg-gradient-to-br !from-blue-600 !to-cyan-400 rounded-md flex items-center justify-center text-white font-semibold",
        }}
        onOk={async () => {
          const vals = await form.validateFields();
          await dispatch(createUser(vals));
          form.resetFields();
          setCreateVisible(false);
        }}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="username"
            label="Потребителско име"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="password"
            label="Парола"
            rules={[{ required: true }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="roles"
            label="Роли и права"
            rules={[{ required: true }]}
          >
            <Select
              mode="multiple"
              placeholder="Изберете роли"
              options={roleOptions}
            />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={`Редакция на роли и права: ${editingUser?.username ?? ""}`}
        open={editVisible}
        closable={false}
        onCancel={() => setEditVisible(false)}
        okText="Запази"
        cancelText="Отказ"
        okButtonProps={{
          className:
            "!bg-gradient-to-br !from-blue-600 !to-cyan-400 rounded-md flex items-center justify-center text-white font-semibold",
        }}
        onOk={async () => {
          const vals = await editForm.validateFields();
          if (!editingUser) return;
          await dispatch(
            updateUserRoles({ userId: editingUser.id, roles: vals.roles || [] })
          );
          setEditVisible(false);
        }}
      >
        <Form form={editForm} layout="vertical">
          <Form.Item
            name="roles"
            label="Роли и права"
            rules={[{ required: true }]}
          >
            <Select
              mode="multiple"
              placeholder="Изберете роли"
              options={roleOptions}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UsersPage;
