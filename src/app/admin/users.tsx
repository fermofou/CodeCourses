import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input, Button, Modal, Form, InputNumber, Select, notification } from "antd";
import { EditOutlined, UserOutlined } from "@ant-design/icons";
import UserProfileModal from "@/components/UserProfileModal";

interface MedalType {
  id: number;
  name: string;
  requirement: string;
  imageUrl: string;
}

interface UserType {
  name: string;
  id: string;
  level: number;
  points: number;
  mail: string;
  is_admin: boolean;
  medals?: MedalType[];
}

interface EditUserFormData {
  name: string;
  level: number;
  points: number;
  medals: number[];
}

const calculateRank = (level: number): string => {
  if (level >= 100) return "Grandmaster";
  if (level >= 80) return "Master";
  if (level >= 60) return "Candidate";
  if (level >= 40) return "Expert";
  if (level >= 20) return "Specialist";
  if (level >= 10) return "Pupil";
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
  const [allMedals, setAllMedals] = useState<MedalType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<UserType | null>(null);
  const [form] = Form.useForm<EditUserFormData>();
  const [isLoadingSave, setIsLoadingSave] = useState(false);
  const [previewRank, setPreviewRank] = useState<string>("");
  const [previewRankColor, setPreviewRankColor] = useState<string>("");
  const [api, contextHolder] = notification.useNotification();
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

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
    const interval = setInterval(fetchUsers, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetch("/api/badges")
      .then(res => res.json())
      .then(data => setAllMedals(
        data.map((b: any) => ({ id: b.badge_id, name: b.name, requirement: b.requirement, imageUrl: b.image_url }))
      ))
      .catch(err => console.error("Error fetching badges:", err));
  }, []);

  const showEditModal = (user: UserType) => {
    setEditingUser(user);
    // Fetch user's current medals
    fetch(`http://localhost:8080/admin/user/${user.id}/badges`)
      .then(res => res.json())
      .then((badges: any[]) => {
        const medalIds = badges.map(b => b.badge_id);
        form.setFieldsValue({
          name: user.name,
          level: user.level,
          points: user.points,
          medals: medalIds,
        });
        setPreviewRank(calculateRank(user.level));
        setPreviewRankColor(getRankColor(calculateRank(user.level)));
        setIsEditModalVisible(true);
      })
      .catch(err => {
        console.error("Error loading user badges:", err);
        // still open modal with defaults
        form.setFieldsValue({ name: user.name, level: user.level, points: user.points, medals: [] });
        setPreviewRank(calculateRank(user.level));
        setPreviewRankColor(getRankColor(calculateRank(user.level)));
        setIsEditModalVisible(true);
      });
  };

  const handleEditCancel = () => {
    setIsEditModalVisible(false);
    setEditingUser(null);
    form.resetFields();
  };

  const handleEditOk = async () => {
    try {
      if (!editingUser) throw new Error("No user selected");
      const values = await form.validateFields();
      setIsLoadingSave(true);

      console.log("medals :",values.medals);
      const response = await fetch(`http://localhost:8080/admin/updateUser/${editingUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name,
          level: values.level,
          points: values.points,
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(errText);
      }

      setUsers(prev => prev.map(u => u.id === editingUser.id ? { ...u, ...values, medals: allMedals.filter(m => values.medals.includes(m.id)) } : u));
      api.success({ message: "User updated successfully" });
      handleEditCancel();
    } catch (err) {
      console.error(err);
      api.error({ message: "Error updating user" });
    } finally {
      setIsLoadingSave(false);
    }
  };

  const handleLevelChange = (value: number | null) => {
    if (value !== null) {
      const rank = calculateRank(value);
      setPreviewRank(rank);
      setPreviewRankColor(getRankColor(rank));
    }
  };

  const showUserProfile = (user: UserType) => {
    setSelectedUser(user);
    setIsProfileModalOpen(true);
  };

  if (loading) return <div className="container mx-auto px-4 py-8">Loading...</div>;

  return (
    <div className="w-full">
      {contextHolder}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Users</h1>
        <p className="text-gray-600">Manage platform users</p>
      </div>

      <div className="flex justify-between items-center mb-4">
        <Input.Search
          placeholder="Search users..."
          style={{ width: 250 }}
          allowClear
          onChange={e => setSearchText(e.target.value)}
        />
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
          {users.filter(u => u.name.toLowerCase().includes(searchText.toLowerCase())).map(user => {
            const rank = calculateRank(user.level);
            const color = getRankColor(rank);
            return (
              <TableRow key={user.id} className="border-b hover:bg-muted/50">
                <TableCell className="w-[35%]">
                  <div className="flex items-center space-x-3">
                    <Avatar
                      className="border border-gray-200 cursor-pointer"
                      onClick={() => showUserProfile(user)}
                    >
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span
                      className="font-medium cursor-pointer hover:text-blue-600"
                      onClick={() => showUserProfile(user)}
                    >
                      {user.name}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="w-[20%]"><span className={color}>{rank}</span></TableCell>
                <TableCell className="w-[15%] text-center font-medium">{user.level}</TableCell>
                <TableCell className="w-[15%] text-center font-medium">{user.points}</TableCell>
                <TableCell className="w-[15%] text-right">
                  <div className="flex justify-end gap-3">
                    <Button icon={<UserOutlined />} onClick={() => showUserProfile(user)}>
                      Profile
                    </Button>
                    <Button icon={<EditOutlined />} onClick={() => showEditModal(user)}>
                      Edit
                    </Button>
                    <Button danger onClick={() => console.log('Delete', user.id)}>
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
        <Form
          form={form}
          layout="vertical"
          initialValues={{ name: '', level: 1, points: 0, medals: [] }}
        >
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: "Please enter the user's name" }]}>
            <Input placeholder="User name" />
          </Form.Item>

          <Form.Item
            name="level"
            label="Level"
            rules={[{ required: true, message: "Please enter the user's level" }]}
          >
            <InputNumber min={1} style={{ width: '100%' }} onChange={handleLevelChange} />
          </Form.Item>

          <Form.Item
            name="points"
            label="Points"
            rules={[{ required: true, message: "Please enter the user's points" }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item name="medals" label="Medals">
            <Select mode="multiple" placeholder="Select medals">
              {allMedals.map(medal => (
                <Select.Option key={medal.id} value={medal.id}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                  <img
                    src={medal.imageUrl}
                    alt={medal.name}
                    style={{ width: 18, height: 18, objectFit: "contain", marginRight: 6 }}
                  />
                  {medal.name} – {medal.requirement}
                  </span>
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <div className="mt-4 p-3 bg-gray-50 rounded-md">        
            <div className="text-sm text-gray-600 mb-2">Rank Preview:</div>
            <div className="flex items-center">
              <span className={previewRankColor + " text-lg font-medium"}>
                {previewRank}
              </span>
            </div>
            <div className="text-xs text-gray-500 mt-1">Rank is calculated automatically based on level</div>
          </div>

          {editingUser && (
            <div className="mt-4 text-xs text-gray-500">User ID: {editingUser.id}</div>
          )}
        </Form>
      </Modal>

      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        user={selectedUser}
      />
    </div>
  );
};

export default Users;
