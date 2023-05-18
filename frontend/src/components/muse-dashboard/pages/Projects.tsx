import { useEffect, useState } from "react";
import {
  Row,
  Col,
  Card,
  Popover,
  Table,
  message,
  Button,
  Avatar,
  Typography,
  Space,
  Popconfirm,
  Form,
  Input,
  notification,
} from "antd";

import {
  PlusCircleOutlined,
  CopyOutlined,
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";

import ButtonModal from "../../buttonModal";

import { Link } from "react-router-dom";

import {
  getProjects,
  deleteProject,
  createProject,
  duplicateProject,
  updateProject,
} from "../../../requests";


function Projects() {
  const [projects, setProjects] = useState<object[]>([]);
  const [projectForm] = Form.useForm();
  useEffect(() => {
    async function initProjectData() {
      const data = await getProjects();
      if(data && data.length > 0){
        setProjects(data);
      }
    }
    initProjectData();
  }, []);
  const onFinishEditProject = async (values: any) => {
    const project = {
      ...values,
    };
    const res = await updateProject(
      project._id,
      project.name,
      project.description
    );
    // console.log('[log] update project', res);
    if (!res || !res._id) {
      notification.error({
        message: "Update project failed: " + res.message,
      });
      return;
    }
    notification.success({
      message: "Update project success",
    });
    const tmp = projects.filter((item: any) => item._id !== project._id);
    tmp.push(res);
    setProjects([...tmp]);
  };
  const onCreateProject = async (values: any) => {
    const project = {
      ...values,
    };
    const res = await createProject(project.name, project.description);
    // console.log('[log] create project', res);
    if (!res || !res._id) {
      notification.error({
        message: "Create project failed: " + res.message,
      });
      return;
    }
    notification.success({
      message: "Create project success",
    });
    console.log("[log] create project", projects)
    const tmp = [...projects];
    tmp.push(res);
    setProjects([...tmp]);
  };
  const confirmDeleteProject = async (projectId: string) => {
    const res = await deleteProject(projectId);
    if (!res || res.status !== 200) {
      notification.error({
        message: "Delete project failed",
      });
      return;
    }
    notification.success({
      message: "Delete project success",
    });
    const tmp = projects.filter((item: any) => item._id !== projectId);
    setProjects([...tmp]);
  };
  const confirmCopyProject = async (projectId: string) => {
    let tmpProject: any = {
      ...projects.filter((item: any) => item._id === projectId)[0],
    };
    tmpProject._id = null;
    tmpProject.admin = tmpProject.admin._id;
    tmpProject.survey = tmpProject.survey.surveyId;
    tmpProject.createdAt = null;
    tmpProject.updatedAt = null;
    tmpProject.name = tmpProject.name + " (copy)";
    const res = await duplicateProject(tmpProject);
    console.log("[log] duplicate project", res);
    if (!res || !res._id) {
      notification.error({
        message: "Duplicate project failed",
      });
      return;
    }
    notification.success({
      message: "Duplicate project success",
    });
    const tmp = [...projects];
    tmp.push(res);
    setProjects([...tmp]);
  };
  const ProjectEditForm = ({ project }: { project: any }) => {
    const [projectEditForm] = Form.useForm();
    useEffect(() => {
      projectEditForm.setFieldsValue(project);
    });
    return (
      <Form
        form={projectEditForm}
        title="Edit Projects"
        onFinish={onFinishEditProject}
        layout="horizontal"
      >
        <Form.Item name="_id" label="Id">
          <Input placeholder="Enter project id" disabled />
        </Form.Item>
        <Form.Item name="name" label="Name" rules={[{ required: true }]}>
          <Input placeholder="Enter project name" />
        </Form.Item>
        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true }]}
        >
          <Input placeholder="Enter description of this project" />
        </Form.Item>
        <Form.Item>
          <span>
            For more editting, delete this project and create new one.
          </span>
        </Form.Item>
        <Form.Item className="flex-center">
          <Button type="primary" htmlType="submit">
            Edit
          </Button>
        </Form.Item>
      </Form>
    );
  };
  const ProjectAddForm = (
    <Form
      form={projectForm}
      title="Create Project"
      onFinish={onCreateProject}
      layout="horizontal"
    >
      <Form.Item name="name" label="Name" rules={[{ required: true }]}>
        <Input placeholder="Enter project name" />
      </Form.Item>
      <Form.Item
        name="description"
        label="Description"
        rules={[{ required: true }]}
      >
        <Input placeholder="Enter the description of project" />
      </Form.Item>
      <Form.Item className="flex-center">
        <Button type="primary" htmlType="submit">
          Create
        </Button>
      </Form.Item>
    </Form>
  );
  // table code start
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: "10%",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      width: "30%",
    },

    {
      title: "Survey",
      key: "survey",
      dataIndex: "survey",
      render: (survey: any) => (
        <Popover content="Click to enter the survey editor">
          <Link to={`/editor?surveyId=${survey.surveyId}`}>
            <span>{survey.title}</span>
          </Link>
        </Popover>
      ),
    },
    {
      title: "Admin",
      key: "admin",
      dataIndex: "admin",
      render: (user: any) => (
        <p>
          {user.name}
          <br /> {user.email}
        </p>
      ),
    },
    {
      title: "Operators",
      key: "users",
      dataIndex: "users",
      render: (survey: any) => <>{JSON.stringify(survey)}</>,
    },
    {
      title: "Created Date",
      key: "createdDate",
      dataIndex: "createdAt",
      render: (date: string) => (
        <span>{new Date(date).toLocaleDateString("en-US")}</span>
      ),
    },
    {
      title: "Updated Date",
      key: "updatedDate",
      dataIndex: "updatedAt",
      render: (date: string) => (
        <span>{new Date(date).toLocaleDateString("en-US")}</span>
      ),
    },
    {
      title: "Action",
      key: "action",
      width: "15%",
      render: (text: string, record: any) => (
        <>
          <Space>
            <ButtonModal
              buttonShape="circle"
              buttonSize="small"
              buttonIcon={<EditOutlined />}
              modalTitle={`Edit Project: ${record.name}`}
              cancelText="Close"
            >
              <ProjectEditForm project={record} />
            </ButtonModal>
          </Space>
          <Space size="middle">
            <Popconfirm
              title="Do you want to duplicate this project?"
              onConfirm={() => confirmCopyProject(record._id)}
              okText="Yes"
              cancelText="No"
            >
              <Button shape="circle" icon={<CopyOutlined />} size="small" />
            </Popconfirm>
          </Space>
          <Space size="middle">
            <Popconfirm
              title="Are you sure to delete this project?"
              onConfirm={() => confirmDeleteProject(record._id)}
              okText="Yes"
              cancelText="No"
            >
              <Button shape="circle" icon={<DeleteOutlined />} size="small" />
            </Popconfirm>
          </Space>
        </>
      ),
    },
  ];
  return (
    <>
      <div className="tabled">
        <Row gutter={[24, 0]}>
          <Col xs="24" xl={24}>
            <Card
              bordered={false}
              className="criclebox tablespace mb-24"
              title="Projects Table"
              extra={[
                <ButtonModal
                  buttonText={
                    <div className="flex-center">
                      <PlusCircleOutlined /> &nbsp; Create Project
                    </div>
                  }
                  modalTitle="Create Project"
                  cancelText="Close"
                >
                  {ProjectAddForm}
                </ButtonModal>,
              ]}
            >
              <div className="table-responsive">
                <Table
                  columns={columns}
                  dataSource={projects}
                  pagination={false}
                  className="ant-border-space"
                />
              </div>
            </Card>

            {/* <Card
              bordered={false}
              className="criclebox tablespace mb-24"
              title="Projects Table"
              extra={
                <>
                  <Radio.Group onChange={onChange} defaultValue="all">
                    <Radio.Button value="all">All</Radio.Button>
                    <Radio.Button value="online">ONLINE</Radio.Button>
                    <Radio.Button value="store">STORES</Radio.Button>
                  </Radio.Group>
                </>
              }
            >
              <div className="table-responsive">
                <Table
                  columns={project}
                  dataSource={dataproject}
                  pagination={false}
                  className="ant-border-space"
                />
              </div>
              <div className="uploadfile pb-15 shadow-none">
                <Upload {...formProps}>
                  <Button
                    type="dashed"
                    className="ant-full-box"
                    icon={<ToTopOutlined />}
                  >
                    Click to Upload
                  </Button>
                </Upload>
              </div>
            </Card> */}
          </Col>
        </Row>
      </div>
    </>
  );
}

export default Projects;
