import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { departmentService } from "../services/departmentService";
import { Department } from "../types/department";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, Edit, Trash2, ChevronDown, ChevronUp } from "lucide-react";

const Dashboard = () => {
  const { token } = useAuth();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [newDepartmentName, setNewDepartmentName] = useState("");
  const [subDepartmentInputs, setSubDepartmentInputs] = useState<string[]>([
    "",
  ]);
  const [currentDepartment, setCurrentDepartment] = useState<Department | null>(
    null
  );
  const [expandedDepartments, setExpandedDepartments] = useState<number[]>([]);

  const itemsPerPage = 5;
  useEffect(() => {
    if (token) {
      fetchDepartments();
    }
  }, [token, currentPage]);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      if (token) {
        const result = await departmentService.getDepartments(
          token,
          currentPage,
          itemsPerPage
        );
        setDepartments(result.departments);
        setTotalPages(Math.ceil(result.totalCount / itemsPerPage));
      }
    } catch (error) {
      console.error("Error fetching departments:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleDepartmentExpansion = (departmentId: number) => {
    setExpandedDepartments((prev) =>
      prev.includes(departmentId)
        ? prev.filter((id) => id !== departmentId)
        : [...prev, departmentId]
    );
  };

  const handleCreateDepartment = async () => {
    console.log("hhshhds");
    if (newDepartmentName.length < 2) {
      toast.error("Department name must be at least 2 characters long");
      return;
    }

    try {
      const validSubDepartments = subDepartmentInputs
        .filter((name) => name.length >= 2)
        .map((name) => ({ name }));

      if (token) {
        await departmentService.createDepartment(token, {
          name: newDepartmentName,
          subDepartments:
            validSubDepartments.length > 0 ? validSubDepartments : null,
        });

        toast.success("Department created successfully");
        setIsCreateModalOpen(false);
        setNewDepartmentName("");
        setSubDepartmentInputs([""]);
        fetchDepartments();
      }
    } catch (error) {
      console.error("Error creating department:", error);
    }
  };

  const handleUpdateDepartment = async () => {
    if (!currentDepartment) return;

    if (newDepartmentName.length < 2) {
      toast.error("Department name must be at least 2 characters long");
      return;
    }

    try {
      if (token) {
        await departmentService.updateDepartment(token, {
          id: currentDepartment.id,
          name: newDepartmentName,
        });

        toast.success("Department updated successfully");
        setIsUpdateModalOpen(false);
        setCurrentDepartment(null);
        setNewDepartmentName("");
        fetchDepartments();
      }
    } catch (error) {
      console.error("Error updating department:", error);
    }
  };

  const handleDeleteDepartment = async () => {
    if (!currentDepartment) return;

    try {
      if (token) {
        await departmentService.deleteDepartment(token, currentDepartment.id);

        toast.success("Department deleted successfully");
        setIsDeleteModalOpen(false);
        setCurrentDepartment(null);
        fetchDepartments();
      }
    } catch (error) {
      console.error("Error deleting department:", error);
    }
  };

  const openUpdateModal = (department: Department) => {
    setCurrentDepartment(department);
    setNewDepartmentName(department.name);
    setIsUpdateModalOpen(true);
  };

  const openDeleteModal = (department: Department) => {
    setCurrentDepartment(department);
    setIsDeleteModalOpen(true);
  };

  const handleAddSubDepartmentInput = () => {
    setSubDepartmentInputs([...subDepartmentInputs, ""]);
  };

  const handleRemoveSubDepartmentInput = (index: number) => {
    setSubDepartmentInputs(subDepartmentInputs.filter((_, i) => i !== index));
  };

  const handleSubDepartmentChange = (index: number, value: string) => {
    const newInputs = [...subDepartmentInputs];
    newInputs[index] = value;
    setSubDepartmentInputs(newInputs);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Department Management</h1>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus size={18} className="mr-2" /> Add Department
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin-slow w-12 h-12 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <>
          {departments.length === 0 ? (
            <Card>
              <CardContent className="p-6 flex flex-col items-center justify-center h-64">
                <p className="text-lg text-muted-foreground mb-4">
                  No departments found
                </p>
                <Button onClick={() => setIsCreateModalOpen(true)}>
                  <Plus size={18} className="mr-2" /> Create Your First
                  Department
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {departments.map((department) => (
                <Card
                  key={department.id}
                  className="overflow-hidden department-item"
                >
                  <CardHeader className="p-4 bg-secondary/20">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg">
                        {department.name}
                      </CardTitle>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openUpdateModal(department)}
                        >
                          <Edit size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => openDeleteModal(department)}
                        >
                          <Trash2 size={16} />
                        </Button>
                        {department.subDepartments &&
                          department.subDepartments.length > 0 && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                toggleDepartmentExpansion(department.id)
                              }
                            >
                              {expandedDepartments.includes(department.id) ? (
                                <ChevronUp size={16} />
                              ) : (
                                <ChevronDown size={16} />
                              )}
                            </Button>
                          )}
                      </div>
                    </div>
                  </CardHeader>

                  {/* Sub Departments */}
                  {department.subDepartments &&
                    department.subDepartments.length > 0 &&
                    expandedDepartments.includes(department.id) && (
                      <CardContent className="bg-background/50 p-4 border-t">
                        <h3 className="text-sm font-medium text-muted-foreground mb-2">
                          Sub Departments
                        </h3>
                        <ul className="space-y-2">
                          {department.subDepartments.map((subDept) => (
                            <li
                              key={subDept.id}
                              className="p-2 rounded-md bg-secondary/20"
                            >
                              {subDept.name}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    )}
                </Card>
              ))}

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-2 mt-4">
                  <Button
                    variant="outline"
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* Create Department Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Department</DialogTitle>
            <DialogDescription>
              Add a new department to your organization.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Department Name</label>
              <Input
                value={newDepartmentName}
                onChange={(e) => setNewDepartmentName(e.target.value)}
                placeholder="Enter department name"
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">
                  Sub Departments (Optional)
                </label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAddSubDepartmentInput}
                >
                  <Plus size={14} className="mr-1" /> Add
                </Button>
              </div>

              {subDepartmentInputs.map((input, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    value={input}
                    onChange={(e) =>
                      handleSubDepartmentChange(index, e.target.value)
                    }
                    placeholder={`Sub department ${index + 1}`}
                    className="flex-1"
                  />
                  {subDepartmentInputs.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive"
                      onClick={() => handleRemoveSubDepartmentInput(index)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCreateModalOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateDepartment}>Create Department</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Update Department Modal */}
      <Dialog open={isUpdateModalOpen} onOpenChange={setIsUpdateModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Department</DialogTitle>
            <DialogDescription>Edit the department name.</DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-2">
            <label className="text-sm font-medium">Department Name</label>
            <Input
              value={newDepartmentName}
              onChange={(e) => setNewDepartmentName(e.target.value)}
              placeholder="Enter department name"
              className="w-full"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsUpdateModalOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdateDepartment}>Update Department</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Department Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Department</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this department and all its
              sub-departments? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteDepartment}>
              Delete Department
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
