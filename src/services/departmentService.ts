import { graphqlClient } from "./graphqlClient";
import {
  Department,
  CreateDepartmentInput,
  UpdateDepartmentInput,
  DepartmentsResponse,
} from "../types/department";

export const departmentService = {
  login: async (
    username: string,
    password: string
  ): Promise<{ accessToken: string }> => {
    const query = `
      mutation {
          login(loginUserData: { username: "${username}", password: "${password}" }) {
            message
            accessToken
          }
        }
    
    `;
    const response = await graphqlClient<{ login: { accessToken: string } }>(
      query
    );
    return response.login;
  },

  getDepartments: async (
    token: string,
    page: number = 1,
    limit: number = 10
  ): Promise<DepartmentsResponse> => {
    const query = `
    query getDepartments($pagination: PaginationInput!) {
      getDepartments(pagination: $pagination) {
        departments {
          id
          name
          subDepartments {
            id
            name
          }
        }
        totalCount
      }
    }
  `;

    const response = await graphqlClient<{
      getDepartments: DepartmentsResponse;
    }>(query, { pagination: { page, limit } }, token);
    return response.getDepartments;
  },

  createDepartment: async (
    token: string,
    input: CreateDepartmentInput
  ): Promise<Department> => {
    const query = `
      mutation createDepartment($input: CreateDepartmentInput!) {
        createDepartment(input: $input) {
          id
          name
           createdAt
       updatedAt
          subDepartments {
           id
           name
           createdAt
       updatedAt
          }
        }
      }
    `;

    const response = await graphqlClient<{ createDepartment: Department }>(
      query,
      { input },
      token
    );
    return response.createDepartment;
  },

  updateDepartment: async (
    token: string,
    input: UpdateDepartmentInput
  ): Promise<Department> => {
    const query = `
      mutation updateDept($input: UpdateDepartmentInput!) {
        updateDepartment(input: $input) {
          id
          name
          subDepartments {
            id
            name
          }
        }
      }
    `;

    const response = await graphqlClient<{ updateDepartment: Department }>(
      query,
      { input },
      token
    );
    return response.updateDepartment;
  },

  deleteDepartment: async (token: string, id: number): Promise<boolean> => {
    const query = `
      mutation {
        deleteDepartment(id: ${id})
      }
    `;

    const response = await graphqlClient<{ deleteDepartment: boolean }>(
      query,
      undefined,
      token
    );
    return response.deleteDepartment;
  },
};
