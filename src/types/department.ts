export interface Department {
  id: number;
  name: string;
  subDepartments?: SubDepartment[];
}

export interface SubDepartment {
  id: number;
  name: string;
}

export interface CreateDepartmentInput {
  name: string;
  subDepartments?: { name: string }[] | null;
}

export interface UpdateDepartmentInput {
  id: number;
  name: string;
}

export interface DepartmentsResponse {
  departments: Department[];
  totalCount: number;
}

export const paginationInput = {
  page: 1,
  limit: 10,
};
