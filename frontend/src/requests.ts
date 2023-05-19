import { notification } from "antd";
import { API_URL } from "./constants";

const resHandler = (res: any) => {
  if (res.status === 401) {
    location.href = "/sign-in";
  }
  if (res.status === 404) {
    return {
      json: () => null,
    }
  }
  return res;
}

export const login = async (email: string, password: string) => {
  try {
    const res = await fetch(`${API_URL}/api/sessions`, {
      method: "POST",
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email,
        password,
      }),
    })
      .then((res) => {
        if (res.status !== 200) {
          notification.info({
            message: "Login failed, Please check your email and password",
          });
          throw new Error("Login failed");
        }
        return res;
      })
      .then((res) => res.json());
      return res;
  } catch (e: any) {
    console.log("[requests] fail to login: ", e.message);
  }
  return null;
};

export const getUserInfo = async () => {
  const refreshToken = localStorage.getItem("refreshToken");
  const accessToken = localStorage.getItem("accessToken");
  return fetch(`${API_URL}/api/users/me`, {
    method: "GET",
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
      "Authorization": `Bearer ${accessToken}`,
      "x-refresh": `${refreshToken}`,
    }
  }).then((res) => {
    if(res.status === 401) {
      location.href = "/sign-in";
    }
    return res;
  }).then((res) => res.json());
}

export const getProjects = async() => {
  const refreshToken = localStorage.getItem("refreshToken");
  const accessToken = localStorage.getItem("accessToken");
  return fetch(`${API_URL}/api/projects`, {
    method: "GET",
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
      "Authorization": `Bearer ${accessToken}`,
      "x-refresh": `${refreshToken}`,
    }
  }).then(resHandler).then((res) => res.json());
}

export const createProject = async (name: string, description: string) => {
  const refreshToken = localStorage.getItem("refreshToken");
  const accessToken = localStorage.getItem("accessToken");
  return fetch(`${API_URL}/api/projects`, {
    method: "POST",
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
      "Authorization": `Bearer ${accessToken}`,
      "x-refresh": `${refreshToken}`,
    },
    body: JSON.stringify({
      name,
      description,
      users: [],
    }),
  }).then(resHandler).then((res) => res.json());
}

export const duplicateProject = async(project: any) => {
  const refreshToken = localStorage.getItem("refreshToken");
  const accessToken = localStorage.getItem("accessToken");
  return fetch(`${API_URL}/api/projects`, {
    method: "POST",
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
      "Authorization": `Bearer ${accessToken}`,
      "x-refresh": `${refreshToken}`,
    },
    body: JSON.stringify(project),
  }).then(resHandler).then((res) => res.json());
}

export const deleteProject = async (_id: string) => {
  const refreshToken = localStorage.getItem("refreshToken");
  const accessToken = localStorage.getItem("accessToken");
  return fetch(`${API_URL}/api/projects/${_id}`, {
    method: "DELETE",
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
      "Authorization": `Bearer ${accessToken}`,
      "x-refresh": `${refreshToken}`,
    },
  }).then(resHandler)
}

export const updateProject = async (_id: string, name: string, description: string) => {
  const refreshToken = localStorage.getItem("refreshToken");
  const accessToken = localStorage.getItem("accessToken");
  return fetch(`${API_URL}/api/projects/${_id}`, {
    method: "PUT",
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
      "Authorization": `Bearer ${accessToken}`,
      "x-refresh": `${refreshToken}`,
    },
    body: JSON.stringify({
      name,
      description,
    }),
  }).then(resHandler).then((res) => res.json());
}

export const getSurveyBySurveyId = async (surveyId: string) => {
  const refreshToken = localStorage.getItem("refreshToken");
  const accessToken = localStorage.getItem("accessToken");
  return fetch(`${API_URL}/api/surveys/${surveyId}`, {
    method: "GET",
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
      "Authorization": `Bearer ${accessToken}`,
      "x-refresh": `${refreshToken}`,
    },
  }).then(resHandler).then((res) => res.json());
}

export const updateSurveyById = async (surveyId: string, title: string, content: object) => {
  const refreshToken = localStorage.getItem("refreshToken");
  const accessToken = localStorage.getItem("accessToken");
  return fetch(`${API_URL}/api/surveys/${surveyId}`, {
    method: "PUT",
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
      "Authorization": `Bearer ${accessToken}`,
      "x-refresh": `${refreshToken}`,
    },
    body: JSON.stringify({
      title,
      content,
    }),
  }).then(resHandler).then((res) => res.json());
}

export const publishSurvey = async (surveyId: string, patientId: string, customUrlLink?: string) => {
  const refreshToken = localStorage.getItem("refreshToken");
  const accessToken = localStorage.getItem("accessToken");
  const payload = customUrlLink ? {
    surveyId,
    userId: patientId,
    url: customUrlLink,
  } : {
    surveyId,
    userId: patientId,
  }
  return fetch(`${API_URL}/api/url`, {
    method: "POST",
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
      "Authorization": `Bearer ${accessToken}`,
      "x-refresh": `${refreshToken}`,
    },
    body: JSON.stringify(payload),
  }).then(resHandler).then((res) => res.json());
}