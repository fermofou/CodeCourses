import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input, Button, Modal, Form, InputNumber, notification } from "antd";
import { EditOutlined } from "@ant-design/icons";

interface UserType {
  name: string;
  id: string;
  level: number;
  points: number;
  mail: string;
  is_admin: boolean;
}

interface EditUserFormData {
  name: string;
  level: number;
  points: number;
}

const calculateRank = (points: number): string => {
  if (points >= 20000) return "Grandmaster";
  if (points >= 10000) return "Master";
  if (points >= 7500) return "Candidate";
  if (points >= 5000) return "Expert";
  if (points >= 3000) return "Specialist";
  if (points >= 1000) return "Pupil";
  return "Newbie";
};

const getRankColor = (rank: string): string => {
  switch (rank) {
    case "Grandmaster": return "text-[#FF0000]";
    case "Master": return "text-[#FF8C00]";
    case "Candidate": return "text-[#AA00AA]";
    case "Expert": return "text-[#0000FF]";
    case "Specialist": return "text-[#03A89E]";
    case "Pupil": return "text-[#008000]";
    case "Newbie": return "text-[#808080]";
    default: return "";
  }
};

const Users = () => {
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<UserType | null>(null);
  const [form] = Form.useForm<EditUserFormData>();
  const [isLoadingSave, setIsLoadingSave] = useState(false);
  const [previewRank, setPreviewRank] = useState<string>("");
  const [previewRankColor, setPreviewRankColor] = useState<string>("");
  const [api, contextHolder] = notification.useNotification();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("http://localhost:8080/admin/users");
        const data = await res.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
    // Add interval to refresh data like in leaderboard
    const interval = setInterval(fetchUsers, 5000);
    return () => clearInterval(interval);
  }, []);

  const showEditModal = (user: UserType) => {
    setEditingUser(user);
    form.setFieldsValue({
      name: user.name,
      level: user.level,
      points: user.points,
    });
    setPreviewRank(calculateRank(user.points));
    setPreviewRankColor(getRankColor(calculateRank(user.points)));
    setIsEditModalVisible(true);
  };

  const handleEditCancel = () => {
    setIsEditModalVisible(false);
    setEditingUser(null);
    form.resetFields();
  };

  const handleEditOk = async () => {
    try {
      if (!editingUser?.id) {
        throw new Error("No user selected for editing");
      }

      const values = await form.validateFields();
      setIsLoadingSave(true);

      const response = await fetch(`http://localhost:8080/admin/updateUser/${editingUser.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: values.name,
          level: values.level,
          points: values.points,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error: ${response.status} - ${errorText}`);
      }

      const result = await response.json();

      if (result.status === "updated") {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === editingUser.id
              ? {
                  ...user,
                  name: values.name,
                  level: values.level,
                  points: values.points,
                }
              : user
          )
        );

        api.success({
          message: "User Updated",
          description: `User ${values.name} was successfully updated.`,
          placement: "topRight",
          duration: 4,
        });

        setIsEditModalVisible(false);
        setEditingUser(null);
        form.resetFields();
      }
    } catch (error) {
      console.error("Error updating user:", error);
      api.error({
        message: "Update Failed",
        description: `Failed to update user: ${error instanceof Error ? error.message : "Unknown error"}`,
        placement: "topRight",
        duration: 6,
      });
    } finally {
      setIsLoadingSave(false);
    }
  };

  const handlePointsChange = (value: number | null) => {
    if (value !== null) {
      const newRank = calculateRank(value);
      setPreviewRank(newRank);
      setPreviewRankColor(getRankColor(newRank));
    }
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  return (
    <div className="w-full">
      {contextHolder}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Users</h1>
        <p className="text-gray-600">Manage platform users</p>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4">
          <Input.Search
            placeholder="Search users..."
            style={{ width: 250 }}
            allowClear
            onSearch={(value: string) => setSearchText(value)}
          />
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="border-b-2">
            <TableHead className="w-[35%]">User</TableHead>
            <TableHead className="w-[20%] text-left">Rank</TableHead>
            <TableHead className="w-[15%] text-center">Level</TableHead>
            <TableHead className="w-[15%] text-center">Points</TableHead>
            <TableHead className="w-[15%] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users
            .filter((user) => user.name.toLowerCase().includes(searchText.toLowerCase()))
            .map((user) => {
              const rank = calculateRank(user.points);
              const rankColor = getRankColor(rank);

              return (
                <TableRow key={user.id} className="border-b transition-colors hover:bg-muted/50">
                  <TableCell className="w-[35%]">
                    <div className="flex items-center space-x-3">
                      <Avatar className="border border-gray-200">
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{user.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="w-[20%]">
                    <div className="flex items-center">
                      <span className={rankColor}>{rank}</span>
                    </div>
                  </TableCell>
                  <TableCell className="w-[15%] text-center font-medium">{user.level}</TableCell>
                  <TableCell className="w-[15%] text-center font-medium">{user.points}</TableCell>
                  <TableCell className="w-[15%] text-right">
                    <div className="flex justify-end gap-3">
                      <Button 
                        type="primary"
                        icon={<EditOutlined />} 
                        onClick={() => showEditModal(user)}
                      >
                        Edit
                      </Button>
                      <Button 
                        danger 
                        onClick={() => console.log('Delete', user.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
        </TableBody>
      </Table>

      <Modal
        title="Edit User"
        open={isEditModalVisible}
        onOk={handleEditOk}
        onCancel={handleEditCancel}
        okText="Save"
        cancelText="Cancel"
        okButtonProps={{ loading: isLoadingSave }}
      >
        <Form form={form} layout="vertical" initialValues={{ name: "", level: 1, points: 0 }}>
          <Form.Item 
            name="name" 
            label="Name" 
            rules={[{ required: true, message: "Please enter the user's name" }]}
          >
            <Input placeholder="User name" />
          </Form.Item>

          <Form.Item 
            name="level" 
            label="Level" 
            rules={[{ required: true, message: "Please enter the user's level" }]}
          >
            <InputNumber min={1} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            name="points"
            label="Points"
            rules={[{ required: true, message: "Please enter the user's points" }]}
          >
            <InputNumber min={0} style={{ width: "100%" }} onChange={handlePointsChange} />
          </Form.Item>

          <div className="mt-4 p-3 bg-gray-50 rounded-md">
            <div className="text-sm text-gray-600 mb-2">Rank Preview:</div>
            <div className="flex items-center">
              <span className={previewRankColor + " text-lg font-medium"}>{previewRank}</span>
            </div>
            <div className="text-xs text-gray-500 mt-1">Rank is calculated automatically based on points</div>
          </div>

          {editingUser && <div className="mt-4 text-xs text-gray-500">User ID: {editingUser.id}</div>}
        </Form>
      </Modal>
    </div>
  );
};

export default Users;